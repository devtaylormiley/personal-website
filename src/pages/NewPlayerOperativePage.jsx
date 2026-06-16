import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DeathwatchVeteranSelect from '../components/blackfang/DeathwatchVeteranSelect'
import OperativeDataslate from '../components/blackfang/OperativeDataslate'
import ActionButton from '../components/ui/ActionButton'
import { useAuth } from '../context/AuthContext'
import { DEATHWATCH_TEAM_SLUG } from '../data/deathwatchVeteranGuides'
import {
  adjustAbilityScoreWithBoost,
  clampAbilityScoresToLevel,
  resolveOperativeAbilityScores,
} from '../lib/abilityScores'
import { createHomebrewOperative, listHomebrewTeams } from '../lib/homebrewApi'
import { makeDefaultHomebrewOperative } from '../lib/homebrewDefaults'
import { PLAYER_OPERATIVES_PATH } from '../lib/blackfangNavigation'
import { getOperativeAccentTone } from '../lib/operativeAccentTones'
import {
  collectWeaponOptions,
  fetchOfficialKillTeam,
  fetchOfficialOperative,
  fetchOperativesIndex,
  fetchWeaponsIndex,
  mapOfficialOperativeToHomebrew,
} from '../lib/kt24Teams'

const RETURN_TO = 'player-operatives'
const DRAFT_OPERATIVE_ID = 'new-player-operative'

function applyVeteranTemplate(official) {
  const mapped = mapOfficialOperativeToHomebrew(official, {})
  delete mapped.id
  return {
    ...mapped,
    cardType: 'custom',
    category: 'po',
    notes: mapped.notes ?? '',
  }
}

export default function NewPlayerOperativePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [operative, setOperative] = useState(() => ({
    ...makeDefaultHomebrewOperative(0),
    id: DRAFT_OPERATIVE_ID,
  }))
  const [teamId, setTeamId] = useState(null)
  const [homebrewTeams, setHomebrewTeams] = useState([])
  const [deathwatchOperatives, setDeathwatchOperatives] = useState([])
  const [selectedVeteranId, setSelectedVeteranId] = useState(null)
  const [applyingVeteranId, setApplyingVeteranId] = useState(null)
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
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    Promise.all([
      fetchOfficialKillTeam(DEATHWATCH_TEAM_SLUG),
      listHomebrewTeams(user.id),
    ])
      .then(([team, teams]) => {
        setDeathwatchOperatives(
          [...(team.operatives ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
        )
        setHomebrewTeams(teams)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  const weaponOptions = useMemo(() => {
    return collectWeaponOptions([globalWeapons, operative?.weapons ?? []])
  }, [globalWeapons, operative])

  const accentTone = useMemo(() => {
    const index = deathwatchOperatives.findIndex((entry) => entry.id === selectedVeteranId)
    return getOperativeAccentTone(index >= 0 ? index : 0)
  }, [deathwatchOperatives, selectedVeteranId])

  const canCreate = Boolean(selectedVeteranId && operative?.name?.trim())

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

  async function handleSelectVeteran(veteranId) {
    if (!veteranId || applyingVeteranId) return
    setApplyingVeteranId(veteranId)
    setError('')
    try {
      const official = await fetchOfficialOperative(DEATHWATCH_TEAM_SLUG, veteranId)
      setOperative({ ...applyVeteranTemplate(official), id: DRAFT_OPERATIVE_ID })
      setSelectedVeteranId(veteranId)
      setWeaponsResetKey((value) => value + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setApplyingVeteranId(null)
    }
  }

  async function handleCopyFromOperative(key) {
    if (!key) return
    const [teamSlug, officialOpId] = key.split(':')
    setCopyLoading(true)
    setError('')
    try {
      const official = await fetchOfficialOperative(teamSlug, officialOpId)
      setOperative({ ...applyVeteranTemplate(official), id: DRAFT_OPERATIVE_ID })
      setWeaponsResetKey((value) => value + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setCopyLoading(false)
    }
  }

  async function handleCreate() {
    if (!user || !operative || !canCreate) return
    setSaving(true)
    setError('')
    try {
      const { id: _draftId, ...operativePayload } = operative
      const created = await createHomebrewOperative({
        userId: user.id,
        operative: operativePayload,
        teamId,
      })
      navigate(
        `/projects/blackfang-campaign/homebrew-operative/${created.id}?returnTo=${RETURN_TO}`,
        { replace: true },
      )
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (!user) {
    return <p className="bf-body">Sign in with Google to create player operatives.</p>
  }

  if (loading) {
    return <p className="bf-muted mt-8 text-center text-sm">Loading Deathwatch veterans…</p>
  }

  const editorToolbar = (
    <>
      <p className="bf-mono-label text-[10px] sm:text-xs">
        {selectedVeteranId ? 'Draft ready — edit below, then create' : 'Select a veteran to begin'}
      </p>
      <div className="flex flex-wrap gap-2">
        <ActionButton
          label={saving ? 'Creating…' : 'Create operative'}
          onClick={handleCreate}
          disabled={!canCreate || saving}
          className="bf-btn-primary px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
        />
        <Link
          to={PLAYER_OPERATIVES_PATH}
          className="bf-btn-ghost inline-flex items-center px-3 py-1.5 text-xs font-medium"
        >
          Cancel
        </Link>
      </div>
    </>
  )

  return (
    <section className="bf-panel-elevated p-4 sm:p-6">
      <div className="mx-auto w-full max-w-5xl min-w-0">
        <p className="mb-4">
          <Link to={PLAYER_OPERATIVES_PATH} className="bf-link inline-flex items-center gap-1 text-sm">
            ← Back to Player Operatives
          </Link>
        </p>

        <header className="max-w-3xl">
          <p className="bf-eyebrow">New character</p>
          <h1 className="bf-title mt-2">Player Operative</h1>
          <p className="bf-body mt-4 text-sm leading-relaxed sm:text-base">
            Start from a Deathwatch veteran archetype, then customise the dataslate for your Blackfang
            campaign character.
          </p>
        </header>

        {error ? <p className="bf-error mt-4 text-sm">{error}</p> : null}

        <section className="operative-card-editor mt-8 rounded-xl border p-4 sm:p-5">
          <h2 className="bf-section-label">Deathwatch veteran</h2>
          <p className="bf-muted mt-1 text-xs sm:text-sm">
            Community breakdowns below — pick the profile that fits how you want to play.
          </p>
          <div className="mt-5">
            <DeathwatchVeteranSelect
              operatives={deathwatchOperatives}
              selectedId={selectedVeteranId}
              applyingId={applyingVeteranId}
              onSelect={handleSelectVeteran}
              disabled={saving}
            />
          </div>
        </section>

        <div className={`mt-8 ${selectedVeteranId ? '' : 'pointer-events-none opacity-50'}`}>
          <h2 className="bf-section-label mb-4">Operative dataslate</h2>
          <OperativeDataslate
            operative={operative}
            density="compact"
            accentTone={accentTone}
            isDirty={canCreate}
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
        </div>
      </div>
    </section>
  )
}
