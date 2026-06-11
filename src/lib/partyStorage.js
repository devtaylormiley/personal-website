const PARTY_KEY = 'bf-campaign-party'
export const PARTY_SLOT_COUNT = 6

export function emptyParty() {
  return {
    killTeamId: null,
    slots: Array.from({ length: PARTY_SLOT_COUNT }, () => null),
  }
}

export function loadParty(userId) {
  if (!userId) return emptyParty()
  try {
    const raw = localStorage.getItem(`${PARTY_KEY}:${userId}`)
    if (!raw) return emptyParty()
    const parsed = JSON.parse(raw)
    const slots = Array.from({ length: PARTY_SLOT_COUNT }, (_, index) => parsed.slots?.[index] ?? null)
    return {
      killTeamId: parsed.killTeamId ?? null,
      slots,
    }
  } catch {
    return emptyParty()
  }
}

export function saveParty(userId, party) {
  if (!userId) return
  localStorage.setItem(`${PARTY_KEY}:${userId}`, JSON.stringify(party))
}
