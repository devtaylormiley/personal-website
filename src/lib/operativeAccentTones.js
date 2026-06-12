export const OPERATIVE_ACCENT_TONES = ['green', 'amber', 'orange', 'cyan', 'violet']

export function getOperativeAccentTone(index) {
  return OPERATIVE_ACCENT_TONES[Math.abs(Number(index) || 0) % OPERATIVE_ACCENT_TONES.length]
}
