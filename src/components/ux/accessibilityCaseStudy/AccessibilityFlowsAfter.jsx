import SignInFormAfter from './SignInFormAfter'
import NavTileAfter from './NavTileAfter'

export default function AccessibilityFlowsAfter() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <NavTileAfter />
      <SignInFormAfter />
    </div>
  )
}
