import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import OperativeDataslate from '../components/blackfang/OperativeDataslate'
import BlackshieldCharacterForm from '../components/blackfang/BlackshieldCharacterForm'
import ActionButton from '../components/ui/ActionButton'
import { useAuth } from '../context/AuthContext'
import {
  adjustAbilityScoreWithBoost,
  clampAbilityScoresToLevel,
  resolveOperativeAbilityScores,
} from '../lib/abilityScores'
import {
  deleteHomebrewOperative,
  getHomebrewOperative,
  listHomebrewTeams,
  updateHomebrewOperative,
} from '../lib/homebrewApi'
import {
  collectWeaponOptions,
  fetchOperativesIndex,
  fetchOfficialOperative,
  fetchWeaponsIndex,
  mapOfficialOperativeToHomebrew,
} from '../lib/kt24Teams'

function clone(value) {
  return structuredClone(value)
}

export default function HomebrewOperativePage() {
  const { operativeId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo')
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [operative, setOperative] = useState(null)
  const [teamId, setTeamId] = useState(null)
  const [original, setOriginal] = useState(null)
  const [homebrewTeams, setHomebrewTeams] = useState([])
  const [officialOperatives, setOfficialOperatives] = useState([])
  const [globalWeapons, setGlobalWeapons] = useState([])
  const [copyLoading, setCopyLoading] = useState(false)
  const [weaponsResetKey, setWeaponsResetKey] = useState(0)

  useEffect(() => {
    fetchOperativesIndex()
      .then(setOfficialOperatives)
      .catch(() => setOfficialOperatives([]))
    fetchWeaponsIndex()
      .then(setGlobalWeapons)
      .catch(() => setGlobalWeapons([]))
  }, [])

  useEffect(() => {
    if (!user || !operativeId) return

    setLoading(true)
    setError('')

    Promise.all([getHomebrewOperative(operativeId, user.id), listHomebrewTeams(user.id)])
      .then(([op, teams]) => {
        setOperative(op)
        setTeamId(op.teamId ?? null)
        setHomebrewTeams(teams)
        setOriginal({ operative: clone(op), teamId: op.teamId ?? null })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [operativeId, user])

  const weaponOptions = useMemo(() => {
    const homebrewWeapons = operative?.weapons ?? []
    return collectWeaponOptions([globalWeapons, homebrewWeapons])
  }, [globalWeapons, operative])

  const isDirty = useMemo(() => {
    if (!operative || !original) return false
    return (
      JSON.stringify(operative) !== JSON.stringify(original.operative) ||
      teamId !== original.teamId
    )
  }, [operative, original, teamId])

  function updateField(field, value) {
    setOperative((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  function updateLevel(level) {
    setOperative((prev) => {
      if (!prev) return prev
      const scores = resolveOperativeAbilityScores(prev)
      return {
        ...prev,
        level,
        abilityScores: clampAbilityScoresToLevel(scores, level),
      }
    })
  }

  function adjustAbilityScore(key, direction) {
    setOperative((prev) => {
      if (!prev) return prev
      const scores = resolveOperativeAbilityScores(prev)
      const level = Math.min(20, Math.max(1, Number(prev.level) || 1))
      return {
        ...prev,
        abilityScores: adjustAbilityScoreWithBoost(scores, key, direction, level),
      }
    })
  }

  function updateWeapon(weaponIndex, field, value) {
    setOperative((prev) => {
      if (!prev) return prev
      const weapons = prev.weapons.map((weapon, index) =>
        index === weaponIndex ? { ...weapon, [field]: value } : weapon,
      )
      return { ...prev, weapons }
    })
  }

  function replaceWeapon(weaponIndex, weapon) {
    setOperative((prev) => {
      if (!prev) return prev
      const weapons = prev.weapons.map((entry, index) => (index === weaponIndex ? weapon : entry))
      return { ...prev, weapons }
    })
  }

  function addWeapon() {
    setOperative((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        weapons: [...(prev.weapons ?? []), { name: '', atk: '', hit: '', dmg: '', rules: '' }],
      }
    })
  }

  function removeWeapon(weaponIndex) {
    setOperative((prev) => {
      if (!prev) return prev
      return { ...prev, weapons: prev.weapons.filter((_, index) => index !== weaponIndex) }
    })
  }

  async function handleCopyFromOperative(key) {
    if (!key || !operativeId) return
    const [teamSlug, officialOpId] = key.split(':')
    setCopyLoading(true)
    setError('')
    try {
      const official = await fetchOfficialOperative(teamSlug, officialOpId)
      const mapped = mapOfficialOperativeToHomebrew(official, { keepId: operativeId })
      setOperative(mapped)
      setWeaponsResetKey((value) => value + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setCopyLoading(false)
    }
  }

  async function handleSave() {
    if (!operative) return
    setSaving(true)
    setError('')
    try {
      const saved = await updateHomebrewOperative({
        operativeId,
        userId: user.id,
        operative,
        teamId,
      })
      setOperative({ ...saved, teamId: teamId ?? null })
      setOriginal({ operative: clone(saved), teamId: teamId ?? null })
      if (returnTo === 'party') {
        navigate('/projects/blackfang-campaign/party')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete “${operative?.name}” permanently?`)) return
    setSaving(true)
    setError('')
    try {
      await deleteHomebrewOperative(operativeId, user.id)
      navigate(returnTo === 'party' ? '/projects/blackfang-campaign/party' : '/projects/blackfang-campaign/kt24-data/operatives')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (!user) {
    return <p className="bf-body">Sign in with Google to access homebrew operatives.</p>
  }

  if (loading) {
    return <p className="bf-muted mt-8 text-center text-sm">Loading operative…</p>
  }

  if (error && !operative) {
    return <p className="bf-error mt-8 text-sm">{error}</p>
  }

  const assignedTeam = homebrewTeams.find((team) => team.id === teamId)
  const isBlackshield = operative?.isBlackshield === true

  return (
    <>
      <header className="bf-divider border-b pb-8">
        <p className="bf-eyebrow">{isBlackshield ? 'Blackshield operative' : 'Homebrew operative'}</p>
        <h1 className="bf-title mt-2">{operative.name}</h1>

        <div className="mt-6 flex max-w-md flex-col gap-2">
          <label htmlFor="hb-op-team" className="bf-muted text-xs font-medium tracking-wider uppercase">
            Kill team assignment
          </label>
          <select
            id="hb-op-team"
            value={teamId ?? ''}
            onChange={(e) => setTeamId(e.target.value || null)}
            className="bf-input rounded-lg px-4 py-2.5 text-sm"
          >
            <option value="">Unassigned — pick a team later</option>
            {homebrewTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.killTeam.name}
              </option>
            ))}
          </select>
          {assignedTeam ? (
            <p className="bf-hint text-xs">
              Assigned to{' '}
              <Link
                to={`/projects/blackfang-campaign/homebrew/${assignedTeam.id}`}
                className="text-[var(--bf-accent)] hover:underline"
              >
                {assignedTeam.killTeam.name}
              </Link>
              . Saving here updates the roster link; edit the full team dataslate from that page.
            </p>
          ) : (
            <p className="bf-hint text-xs">
              This operative is not linked to a homebrew kill team yet. Assign one when ready.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <ActionButton
            label={saving ? 'Saving…' : 'Save changes'}
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="bf-btn-primary px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
          />
          <ActionButton
            label="Delete operative"
            onClick={handleDelete}
            disabled={saving}
            className="bf-btn-danger px-4 py-2 text-sm font-medium disabled:opacity-40"
          />
        </div>
        {error && <p className="bf-error mt-4 text-sm">{error}</p>}
      </header>

      {isBlackshield ? (
        <section className="bf-panel-elevated mt-8 p-4 sm:p-6">
          <h2 className="bf-section-label">Blackshield dossier</h2>
          <p className="bf-muted mt-1 text-xs sm:text-sm">
            Campaign identity for this party roster character — former chapter and backstory.
          </p>
          <div className="mt-6">
            <BlackshieldCharacterForm
              operative={operative}
              onFieldChange={updateField}
              onLevelChange={updateLevel}
              onAbilityScoreAdjust={adjustAbilityScore}
            />
          </div>
        </section>
      ) : null}

      <section className="mt-10 min-w-0">
        <OperativeDataslate
          operative={operative}
          density="compact"
          isDirty={isDirty}
          showAbilityScores={!isBlackshield}
          onFieldChange={updateField}
          onLevelChange={updateLevel}
          onAbilityScoreAdjust={adjustAbilityScore}
          onWeaponChange={updateWeapon}
          onReplaceWeapon={replaceWeapon}
          onAddWeapon={addWeapon}
          onRemoveWeapon={removeWeapon}
          weaponOptions={weaponOptions}
          officialOperatives={officialOperatives}
          onCopyFromOperative={handleCopyFromOperative}
          copyLoading={copyLoading}
          weaponsResetKey={weaponsResetKey}
        />
      </section>
    </>
  )
}
