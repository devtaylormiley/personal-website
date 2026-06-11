import { useEffect, useMemo, useState } from 'react'

async function fetchTeamDefaults(teamSlug) {
  const res = await fetch(`/data/kt24/teams/${teamSlug}.json`)
  if (!res.ok) throw new Error(`Kill team not found: ${teamSlug}`)
  return res.json()
}

export function useKillTeamRoster(teamSlug) {
  const [source, setSource] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let cancelled = false
    setHydrated(false)
    setLoadError(null)
    setSource(null)

    fetchTeamDefaults(teamSlug)
      .then((data) => {
        if (cancelled) return
        setSource({
          killTeamId: data.killteamId,
          factionId: data.factionId,
          killTeam: data.killTeam,
          operatives: data.operatives,
        })
        setHydrated(true)
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err.message)
          setHydrated(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [teamSlug])

  const poOperatives = useMemo(
    () => (source?.operatives ?? []).filter((op) => op.category === 'po'),
    [source],
  )
  const npoOperatives = useMemo(
    () => (source?.operatives ?? []).filter((op) => op.category === 'npo'),
    [source],
  )

  return {
    killTeam: source?.killTeam ?? null,
    operatives: source?.operatives ?? [],
    poOperatives,
    npoOperatives,
    hydrated,
    loadError,
    killteamId: source?.killTeamId,
    factionId: source?.factionId,
    teamSlug,
  }
}
