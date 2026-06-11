import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlackfangTerminalShell from '../components/blackfang/BlackfangTerminalShell'
import BlackfangBreadcrumbs from '../components/blackfang/BlackfangBreadcrumbs'
import KillTeamHeader from '../components/blackfang/KillTeamHeader'
import OperativeDataslate from '../components/blackfang/OperativeDataslate'
import StickyAfterFullScroll from '../components/blackfang/StickyAfterFullScroll'
import ActionButton from '../components/ui/ActionButton'
import { useAuth } from '../context/AuthContext'
import {
  deleteHomebrewTeam,
  getHomebrewTeam,
  replaceHomebrewOperatives,
  updateHomebrewTeam,
  uploadHomebrewTeamImage,
} from '../lib/homebrewApi'
import {
  collectWeaponOptions,
  fetchKillTeamIndex,
  fetchOfficialKillTeam,
  fetchOfficialOperative,
  fetchOperativesIndex,
  fetchWeaponsIndex,
  mapOfficialOperativeToHomebrew,
  mapOfficialToHomebrew,
} from '../lib/kt24Teams'
import { makeDefaultHomebrewOperative } from '../lib/homebrewDefaults'
import {
  adjustAbilityScoreWithBoost,
  clampAbilityScoresToLevel,
  resolveOperativeAbilityScores,
} from '../lib/abilityScores'

function clone(value) {
  return structuredClone(value)
}

function makeNewOperative(index) {
  return {
    id: `new-op-${Date.now()}-${index}`,
    ...makeDefaultHomebrewOperative(index),
  }
}

export default function HomebrewTeamPage() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [killTeam, setKillTeam] = useState(null)
  const [operatives, setOperatives] = useState([])
  const [killteamId, setKillteamId] = useState(null)
  const [factionId, setFactionId] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [original, setOriginal] = useState(null)
  const [officialTeams, setOfficialTeams] = useState([])
  const [officialOperatives, setOfficialOperatives] = useState([])
  const [globalWeapons, setGlobalWeapons] = useState([])
  const [copyLoading, setCopyLoading] = useState(false)
  const [operativeCopyId, setOperativeCopyId] = useState(null)
  const [weaponsResetVersions, setWeaponsResetVersions] = useState({})
  const [imageUploading, setImageUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('po')

  useEffect(() => {
    fetchKillTeamIndex()
      .then(setOfficialTeams)
      .catch(() => setOfficialTeams([]))
    fetchOperativesIndex()
      .then(setOfficialOperatives)
      .catch(() => setOfficialOperatives([]))
    fetchWeaponsIndex()
      .then(setGlobalWeapons)
      .catch(() => setGlobalWeapons([]))
  }, [])

  useEffect(() => {
    if (!user || !teamId) return

    setLoading(true)
    setError('')
    getHomebrewTeam(teamId, user.id)
      .then((data) => {
        setKillTeam(data.killTeam)
        setOperatives(data.operatives)
        setKillteamId(data.killteamId ?? null)
        setFactionId(data.factionId ?? null)
        setImageUrl(data.imageUrl ?? '')
        setOriginal({
          killTeam: clone(data.killTeam),
          operatives: clone(data.operatives),
          killteamId: data.killteamId ?? null,
          factionId: data.factionId ?? null,
          imageUrl: data.imageUrl ?? '',
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [teamId, user])

  const isKillTeamDirty = useMemo(() => {
    if (!original?.killTeam || !killTeam) return false
    return (
      JSON.stringify(killTeam) !== JSON.stringify(original.killTeam) ||
      killteamId !== original.killteamId ||
      factionId !== original.factionId ||
      imageUrl !== original.imageUrl
    )
  }, [killTeam, killteamId, factionId, imageUrl, original])

  const isAnyDirty = useMemo(() => {
    if (!original) return false
    if (isKillTeamDirty) return true
    return JSON.stringify(operatives) !== JSON.stringify(original.operatives)
  }, [isKillTeamDirty, operatives, original])

  const weaponOptions = useMemo(() => {
    const homebrewWeapons = operatives.flatMap((op) => op.weapons ?? [])
    return collectWeaponOptions([globalWeapons, homebrewWeapons])
  }, [globalWeapons, operatives])

  function isOperativeDirty(id) {
    if (!original) return false
    const current = operatives.find((op) => op.id === id)
    const originalOp = original.operatives.find((op) => op.id === id)
    if (!originalOp) return true
    return JSON.stringify(current) !== JSON.stringify(originalOp)
  }

  if (!user) {
    return (
      <div className="blackfang-campaign min-h-screen px-4 pt-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-screen-2xl">
          <BlackfangTerminalShell title="access_denied">
            <p className="bf-body">Sign in with Google to access homebrew teams.</p>
          </BlackfangTerminalShell>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="blackfang-campaign flex min-h-[50vh] items-center justify-center px-4 pt-4 bf-muted">
        <span className="bf-terminal-prompt">LOADING_HOMEBREW</span>
        <span className="bf-terminal-cursor">█</span>
      </div>
    )
  }

  if (error || !killTeam) {
    return (
      <div className="blackfang-campaign min-h-screen px-4 pt-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-screen-2xl">
          <BlackfangTerminalShell title="not_found">
            <BlackfangBreadcrumbs
              items={[
                { label: 'Portfolio', to: '/#projects', icon: 'portfolio' },
                { label: 'KT24 Data', to: '/projects/blackfang-campaign/kt24-data', icon: 'killTeams' },
                { label: 'Not found', icon: 'team' },
              ]}
            />
            <p className="bf-error mt-8 text-sm">{error || 'Homebrew team not found.'}</p>
          </BlackfangTerminalShell>
        </div>
      </div>
    )
  }

  const terminalTitle = `homebrew_${(killTeam.name ?? teamId).replace(/\s+/g, '_').toUpperCase()}`

  const breadcrumbItems = [
    { label: 'Portfolio', to: '/#projects', icon: 'portfolio' },
    { label: 'KT24 Data', to: '/projects/blackfang-campaign/kt24-data', icon: 'killTeams' },
    { label: killTeam.name, icon: 'team' },
  ]

  const tabOperatives = operatives.filter((op) => op.category === activeTab)

  function updateKillTeamField(field, value) {
    setKillTeam((prev) => ({ ...prev, [field]: value }))
  }

  function updateOperativeField(id, field, value) {
    setOperatives((prev) => prev.map((op) => (op.id === id ? { ...op, [field]: value } : op)))
  }

  function updateOperativeLevel(id, level) {
    setOperatives((prev) =>
      prev.map((op) => {
        if (op.id !== id) return op
        const scores = resolveOperativeAbilityScores(op)
        return {
          ...op,
          level,
          abilityScores: clampAbilityScoresToLevel(scores, level),
        }
      }),
    )
  }

  function adjustAbilityScore(id, key, direction) {
    setOperatives((prev) =>
      prev.map((op) => {
        if (op.id !== id) return op
        const scores = resolveOperativeAbilityScores(op)
        const level = Math.min(20, Math.max(1, Number(op.level) || 1))
        return {
          ...op,
          abilityScores: adjustAbilityScoreWithBoost(scores, key, direction, level),
        }
      }),
    )
  }

  function updateWeapon(operativeId, weaponIndex, field, value) {
    setOperatives((prev) =>
      prev.map((op) => {
        if (op.id !== operativeId) return op
        const weapons = op.weapons.map((w, idx) =>
          idx === weaponIndex ? { ...w, [field]: value } : w,
        )
        return { ...op, weapons }
      }),
    )
  }

  function replaceWeapon(operativeId, weaponIndex, weapon) {
    setOperatives((prev) =>
      prev.map((op) => {
        if (op.id !== operativeId) return op
        const weapons = op.weapons.map((w, idx) =>
          idx === weaponIndex ? { ...weapon } : w,
        )
        return { ...op, weapons }
      }),
    )
  }

  function addWeapon(operativeId, weapon) {
    setOperatives((prev) =>
      prev.map((op) =>
        op.id === operativeId ? { ...op, weapons: [...op.weapons, weapon] } : op,
      ),
    )
  }

  function removeWeapon(operativeId, weaponIndex) {
    setOperatives((prev) =>
      prev.map((op) => {
        if (op.id !== operativeId) return op
        return { ...op, weapons: op.weapons.filter((_, idx) => idx !== weaponIndex) }
      }),
    )
  }

  function removeOperative(id) {
    setOperatives((prev) => prev.filter((op) => op.id !== id))
  }

  async function handleCopyFromTeam(slug) {
    const teamName = officialTeams.find((t) => t.slug === slug)?.name ?? 'this team'
    if (
      isAnyDirty &&
      !window.confirm(
        `Replace all dataslate fields with data from ${teamName}? Unsaved changes will be lost.`,
      )
    ) {
      return
    }

    setCopyLoading(true)
    setError('')
    try {
      const official = await fetchOfficialKillTeam(slug)
      const mapped = mapOfficialToHomebrew(official)
      setKillTeam(mapped.killTeam)
      setOperatives(mapped.operatives)
      setKillteamId(mapped.killteamId)
      setFactionId(mapped.factionId)
      setImageUrl('')
    } catch (err) {
      setError(err.message)
    } finally {
      setCopyLoading(false)
    }
  }

  async function handleCopyFromOperative(homebrewOperativeId, key) {
    const entry = officialOperatives.find((item) => item.key === key)
    const label = entry ? `${entry.teamName} — ${entry.name}` : 'this operative'
    if (
      isOperativeDirty(homebrewOperativeId) &&
      !window.confirm(`Replace this operative's dataslate with ${label}? Unsaved changes will be lost.`)
    ) {
      return
    }

    const [teamSlug, operativeId] = key.split(':')
    setOperativeCopyId(homebrewOperativeId)
    setError('')
    try {
      const official = await fetchOfficialOperative(teamSlug, operativeId)
      const mapped = mapOfficialOperativeToHomebrew(official, { keepId: homebrewOperativeId })
      setOperatives((prev) =>
        prev.map((op) => (op.id === homebrewOperativeId ? mapped : op)),
      )
      setWeaponsResetVersions((prev) => ({
        ...prev,
        [homebrewOperativeId]: (prev[homebrewOperativeId] ?? 0) + 1,
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setOperativeCopyId(null)
    }
  }

  async function handleImageUpload(file) {
    setImageUploading(true)
    setError('')
    try {
      const url = await uploadHomebrewTeamImage({ teamId, userId: user.id, file })
      setImageUrl(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setImageUploading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await updateHomebrewTeam({
        teamId,
        userId: user.id,
        killTeam,
        killteamId,
        factionId,
        imageUrl,
      })
      const savedOps = await replaceHomebrewOperatives({
        teamId,
        userId: user.id,
        operatives,
      })
      setOperatives(savedOps)
      setOriginal({
        killTeam: clone(killTeam),
        operatives: clone(savedOps),
        killteamId,
        factionId,
        imageUrl,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteTeam() {
    if (!window.confirm('Delete this homebrew team permanently?')) return
    setSaving(true)
    try {
      await deleteHomebrewTeam(teamId, user.id)
      navigate('/projects/blackfang-campaign/kt24-data')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="blackfang-campaign min-h-screen px-4 pt-4 pb-16 sm:px-6">
      <div className="mx-auto max-w-screen-2xl">
        <BlackfangTerminalShell title={terminalTitle}>
        <BlackfangBreadcrumbs items={breadcrumbItems} />

        <header className="bf-divider mt-6 border-b pb-8">
          <p className="bf-eyebrow">Homebrew private</p>
          <h1 className="bf-title mt-2">{killTeam.name}</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionButton
              label={saving ? 'Saving…' : 'Save changes'}
              onClick={handleSave}
              disabled={!isAnyDirty || saving}
              className="bf-btn-primary px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
            />
            <ActionButton
              label="Delete team"
              onClick={handleDeleteTeam}
              disabled={saving}
              className="bf-btn-danger px-4 py-2 text-sm font-medium disabled:opacity-40"
            />
            <ActionButton
              label="Add operative"
              onClick={() => setOperatives((prev) => [...prev, makeNewOperative(prev.length)])}
              disabled={saving}
              className="bf-btn-ghost px-4 py-2 text-sm font-medium disabled:opacity-40"
            />
          </div>
          {error && <p className="bf-error mt-4 text-sm">{error}</p>}
        </header>

        <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-8">
          <StickyAfterFullScroll className="min-w-0">
            <KillTeamHeader
              killTeam={killTeam}
              killteamId={killteamId}
              factionId={factionId}
              imageUrl={imageUrl}
              isDirty={isKillTeamDirty}
              onFieldChange={updateKillTeamField}
              officialTeams={officialTeams}
              onCopyFromTeam={handleCopyFromTeam}
              copyLoading={copyLoading}
              onImageUpload={handleImageUpload}
              onImageRemove={() => setImageUrl('')}
              imageUploading={imageUploading}
            />
          </StickyAfterFullScroll>

          <section className="min-w-0 overflow-x-hidden">
            <div className="bf-divider flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="bf-heading text-xl">Operative dataslates</h2>
              <div className="bf-panel flex rounded-lg p-1" role="tablist">
                {[
                  { id: 'po', label: 'POs' },
                  { id: 'npo', label: 'NPOs' },
                ].map((tab) => (
                  <ActionButton
                    key={tab.id}
                    label={tab.label}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`bf-tab ${activeTab === tab.id ? 'bf-tab-active' : 'bf-tab-inactive'}`}
                  />
                ))}
              </div>
            </div>

            {tabOperatives.length === 0 ? (
              <p className="bf-muted mt-8 rounded-xl border border-dashed border-[var(--bf-border)] px-6 py-12 text-center text-sm">
                No operatives in this tab.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {tabOperatives.map((operative) => (
                  <li key={operative.id}>
                    <div className="mb-1.5 flex justify-end">
                      <ActionButton
                        label="Remove operative"
                        onClick={() => removeOperative(operative.id)}
                        className="bf-btn-danger rounded-lg px-2.5 py-1 text-xs font-medium"
                      />
                    </div>
                    <OperativeDataslate
                      operative={operative}
                      density="compact"
                      isDirty={isOperativeDirty(operative.id)}
                      onFieldChange={(field, value) =>
                        updateOperativeField(operative.id, field, value)
                      }
                      onLevelChange={(level) => updateOperativeLevel(operative.id, level)}
                      onAbilityScoreAdjust={(key, direction) =>
                        adjustAbilityScore(operative.id, key, direction)
                      }
                      onWeaponChange={(weaponIndex, field, value) =>
                        updateWeapon(operative.id, weaponIndex, field, value)
                      }
                      onReplaceWeapon={(weaponIndex, weapon) =>
                        replaceWeapon(operative.id, weaponIndex, weapon)
                      }
                      onAddWeapon={(weapon) => addWeapon(operative.id, weapon)}
                      onRemoveWeapon={(weaponIndex) => removeWeapon(operative.id, weaponIndex)}
                      weaponOptions={weaponOptions}
                      officialOperatives={officialOperatives}
                      onCopyFromOperative={(key) => handleCopyFromOperative(operative.id, key)}
                      copyLoading={operativeCopyId === operative.id}
                      weaponsResetKey={weaponsResetVersions[operative.id] ?? 0}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        </BlackfangTerminalShell>
      </div>
    </div>
  )
}
