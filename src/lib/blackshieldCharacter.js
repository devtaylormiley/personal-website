export function validateBlackshieldCharacter(operative) {
  const errors = {}

  if (!operative?.name?.trim()) {
    errors.name = 'Operative name is required.'
  }

  if (!operative?.formerChapter?.trim()) {
    errors.formerChapter = 'Former chapter is required for a Blackshield.'
  }

  return errors
}

export function hasBlackshieldValidationErrors(operative) {
  return Object.keys(validateBlackshieldCharacter(operative)).length > 0
}
