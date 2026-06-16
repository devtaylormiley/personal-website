/** Chip-only palette — wider than operative header accents. */
export const RULE_CHIP_TONES = [
  'green',
  'amber',
  'orange',
  'cyan',
  'violet',
  'rose',
  'lime',
  'teal',
  'gold',
  'magenta',
]

function hashString(text) {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  return hash
}

/** Stable per rule label; index offsets adjacent chips on the same weapon. */
export function getRuleChipTone(rule, index = 0) {
  const hash = hashString(String(rule ?? '').toLowerCase())
  return RULE_CHIP_TONES[(hash + Math.abs(Number(index) || 0)) % RULE_CHIP_TONES.length]
}

/** Class name for dataslate rows/cards (ploys, abilities, etc.). */
export function dataslateToneClass(label, index = 0) {
  return `bf-tone-${getRuleChipTone(label, index)}`
}
