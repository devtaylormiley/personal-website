import SignInFormBefore from './SignInFormBefore'
import NavTileBefore from './NavTileBefore'

export default function AccessibilityFlowsBefore() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <NavTileBefore />
      <SignInFormBefore />
    </div>
  )
}
