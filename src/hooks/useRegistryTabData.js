import { useEffect, useState } from 'react'
import { listHomebrewOperatives, listHomebrewTeams } from '../lib/homebrewApi'
import {
  fetchEquipmentIndex,
  fetchKillTeamIndex,
  fetchNpoIndex,
  fetchOperativesIndex,
  fetchWeaponsIndex,
} from '../lib/kt24Teams'

/**
 * Fetches KT24 registry index data only for tabs that have been opened.
 */
export function useRegistryTabData(activeTab, { user, hasSupabaseEnv }) {
  const [loadedTabs, setLoadedTabs] = useState({})
  const [error, setError] = useState(null)
  const [teams, setTeams] = useState([])
  const [operatives, setOperatives] = useState([])
  const [npos, setNpos] = useState([])
  const [weapons, setWeapons] = useState([])
  const [equipment, setEquipment] = useState([])
  const [homebrewTeams, setHomebrewTeams] = useState([])
  const [homebrewOperatives, setHomebrewOperatives] = useState([])

  useEffect(() => {
    if (loadedTabs[activeTab]) return undefined

    let cancelled = false

    async function loadTab() {
      setError(null)
      try {
        switch (activeTab) {
          case 'teams': {
            const teamRows = await fetchKillTeamIndex()
            if (!cancelled) setTeams(teamRows)
            break
          }
          case 'operatives': {
            const rows = await fetchOperativesIndex().catch(() => [])
            if (!cancelled) setOperatives(rows)
            break
          }
          case 'joint-npos': {
            const rows = await fetchNpoIndex().catch(() => [])
            if (!cancelled) setNpos(rows)
            break
          }
          case 'weapons': {
            const rows = await fetchWeaponsIndex().catch(() => [])
            if (!cancelled) setWeapons(rows)
            break
          }
          case 'equipment': {
            const rows = await fetchEquipmentIndex().catch(() => [])
            if (!cancelled) setEquipment(rows)
            break
          }
          default:
            break
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) {
          setLoadedTabs((prev) => ({ ...prev, [activeTab]: true }))
        }
      }
    }

    loadTab()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once per tab visit
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'teams' && activeTab !== 'operatives') return undefined

    if (!user || !hasSupabaseEnv) {
      if (activeTab === 'teams') setHomebrewTeams([])
      if (activeTab === 'operatives') setHomebrewOperatives([])
      return undefined
    }

    let cancelled = false

    if (activeTab === 'teams' || activeTab === 'operatives') {
      listHomebrewTeams(user.id)
        .then((rows) => {
          if (!cancelled) setHomebrewTeams(rows)
        })
        .catch(() => {
          if (!cancelled) setHomebrewTeams([])
        })
    }

    if (activeTab === 'operatives') {
      listHomebrewOperatives(user.id)
        .then((rows) => {
          if (!cancelled) setHomebrewOperatives(rows)
        })
        .catch(() => {
          if (!cancelled) setHomebrewOperatives([])
        })
    }

    return () => {
      cancelled = true
    }
  }, [activeTab, user, hasSupabaseEnv])

  const isLoading = !loadedTabs[activeTab]

  async function refreshHomebrewTeams() {
    if (!user || !hasSupabaseEnv) {
      setHomebrewTeams([])
      return
    }
    const rows = await listHomebrewTeams(user.id)
    setHomebrewTeams(rows)
  }

  async function refreshHomebrewOperatives() {
    if (!user || !hasSupabaseEnv) {
      setHomebrewOperatives([])
      return
    }
    const rows = await listHomebrewOperatives(user.id)
    setHomebrewOperatives(rows)
  }

  return {
    isLoading,
    error,
    teams,
    operatives,
    npos,
    weapons,
    equipment,
    homebrewTeams,
    homebrewOperatives,
    refreshHomebrewTeams,
    refreshHomebrewOperatives,
  }
}
