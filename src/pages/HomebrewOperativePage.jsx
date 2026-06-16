import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import OperativeDataslate from '../components/blackfang/OperativeDataslate'
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
import { PLAYER_OPERATIVES_PATH } from '../lib/blackfangNavigation'
import { getOperativeAccentTone } from '../lib/operativeAccentTones'
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

function homebrewOperativeReturnPath(returnTo) {
  switch (returnTo) {
    case 'party':
      return '/projects/blackfang-campaign/party'
    case 'player-operatives':
      return PLAYER_OPERATIVES_PATH
    default:
      return '/projects/blackfang-campaign/kt24-data/operatives'
  }
}

function homebrewOperativeReturnLabel(returnTo) {
  switch (returnTo) {
    case 'party':
      return 'Party'
    case 'player-operatives':
      return 'Player Operatives'
    default:
      return 'Operatives registry'
  }
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

  const accentTone = useMemo(() => {
    if (!operativeId) return 'green'
    let hash = 0
    for (let i = 0; i < operativeId.length; i++) {
      hash = (hash * 31 + operativeId.charCodeAt(i)) >>> 0
    }
    return getOperativeAccentTone(hash)
  }, [operativeId])

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
      if (returnTo) {
        navigate(homebrewOperativeReturnPath(returnTo))
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
      navigate(homebrewOperativeReturnPath(returnTo))
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

  if (!operative) {
    return <p className="bf-muted mt-8 text-center text-sm">Operative not found.</p>
  }

  const assignedTeam = homebrewTeams.find((team) => team.id === teamId)
  const editorToolbar = (
    <>
      <p className="bf-mono-label text-[10px] sm:text-xs">
        {isDirty ? 'Unsaved changes' : 'All changes saved'}
      </p>
      <div className="flex flex-wrap gap-2">
        <ActionButton
          label={saving ? 'Saving…' : 'Save changes'}
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="bf-btn-primary px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
        />
        <ActionButton
          label="Delete operative"
          onClick={handleDelete}
          disabled={saving}
          className="bf-btn-danger px-3 py-1.5 text-xs font-medium disabled:opacity-40"
        />
      </div>
    </>
  )

  return (
    <section className="bf-panel-elevated p-4 sm:p-6">
      <div className="mx-auto w-full max-w-3xl min-w-0">
        {returnTo ? (
          <p className="mb-4">
            <Link
              to={homebrewOperativeReturnPath(returnTo)}
              className="bf-link inline-flex items-center gap-1 text-sm"
            >
              ← Back to {homebrewOperativeReturnLabel(returnTo)}
            </Link>
          </p>
        ) : null}

        {error ? <p className="bf-error mb-4 text-sm">{error}</p> : null}

        <OperativeDataslate
          operative={operative}
          density="compact"
          accentTone={accentTone}
          isDirty={isDirty}
          teamId={teamId}
          homebrewTeams={homebrewTeams}
          onTeamChange={setTeamId}
          toolbar={editorToolbar}
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

        {assignedTeam ? (
          <p className="bf-hint mt-4 text-xs">
            Full team dataslate:{' '}
            <Link
              to={`/projects/blackfang-campaign/homebrew/${assignedTeam.id}`}
              className="text-[var(--bf-accent)] hover:underline"
            >
              {assignedTeam.killTeam.name}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  )
}
