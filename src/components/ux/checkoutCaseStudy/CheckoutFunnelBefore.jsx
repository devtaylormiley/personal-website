import { useState } from 'react'
import { cartItems, cartSubtotal, orderTotal, shippingEstimate, taxEstimate } from './checkoutMockData'

const DEMO_BYPASS_HINT = ' Press Continue again to skip validation (demo only).'

const STEPS = [
  { id: 'cart', label: 'Cart' },
  { id: 'account', label: 'Account' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
]

function StepIndicator({ currentIndex }) {
  return (
    <ol className="flex flex-wrap gap-1 text-[10px] text-zinc-500 sm:text-xs">
      {STEPS.map((step, index) => (
        <li key={step.id} className="flex items-center gap-1">
          <span
            className={
              index === currentIndex
                ? 'font-medium text-zinc-200'
                : index < currentIndex
                  ? 'text-zinc-400'
                  : ''
            }
          >
            {index + 1}. {step.label}
          </span>
          {index < STEPS.length - 1 ? <span className="text-zinc-700">›</span> : null}
        </li>
      ))}
    </ol>
  )
}

export default function CheckoutFunnelBefore() {
  const [stepIndex, setStepIndex] = useState(0)
  const [bannerError, setBannerError] = useState('')
  const [validationFailedOnce, setValidationFailedOnce] = useState(false)
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState({ line1: '', city: '', zip: '' })
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' })

  const step = STEPS[stepIndex].id

  function getStepValidationError() {
    if (step === 'account' && !email.includes('@')) {
      return 'Please fix the errors below before continuing.'
    }
    if (step === 'shipping' && (!address.line1 || !address.zip)) {
      return 'Please fix the errors below before continuing.'
    }
    if (step === 'payment' && card.number.length < 12) {
      return 'Please fix the errors below before continuing.'
    }
    return ''
  }

  function advanceStep() {
    setValidationFailedOnce(false)
    setBannerError('')
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1)
    }
  }

  function goNext() {
    const validationError = getStepValidationError()
    if (validationError) {
      if (validationFailedOnce) {
        advanceStep()
        return
      }
      setValidationFailedOnce(true)
      setBannerError(`${validationError}${DEMO_BYPASS_HINT}`)
      return
    }
    advanceStep()
  }

  function goBack() {
    setValidationFailedOnce(false)
    setBannerError('')
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  return (
    <div className="overflow-hidden rounded-lg border border-red-900/30 bg-zinc-950 shadow-inner">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2">
        <p className="text-xs font-medium text-zinc-500">Northline Goods — checkout (legacy)</p>
        <span className="rounded bg-red-950/80 px-2 py-0.5 text-[10px] font-medium text-red-300 uppercase">
          Before
        </span>
      </div>

      <div className="border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <StepIndicator currentIndex={stepIndex} />
      </div>

      {bannerError ? (
        <div
          className="border-b border-red-900/50 bg-red-950/40 px-4 py-2 text-xs text-red-300"
          role="alert"
        >
          {bannerError}
        </div>
      ) : null}

      <div className="max-h-[28rem] overflow-auto p-4 sm:p-6">
        {step === 'cart' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-200">Your cart</h4>
            <ul className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 px-3 py-3 text-sm">
                  <div>
                    <p className="text-zinc-200">{item.name}</p>
                    <p className="text-xs text-zinc-500">{item.variant}</p>
                  </div>
                  <span className="text-zinc-300">${item.price}</span>
                </li>
              ))}
            </ul>
            <p className="text-right text-sm text-zinc-400">
              Subtotal <span className="text-zinc-200">${cartSubtotal}</span>
            </p>
            <p className="text-xs text-zinc-600">
              Shipping and tax calculated on a later step.
            </p>
          </div>
        )}

        {step === 'account' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-200">Sign in or continue as guest</h4>
            <label className="block text-xs text-zinc-500">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="button"
              className="w-full rounded border border-zinc-600 py-2 text-sm text-zinc-300"
            >
              Sign in with password
            </button>
          </div>
        )}

        {step === 'shipping' && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-zinc-200">Shipping address</h4>
            <input
              placeholder="Street address"
              value={address.line1}
              onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              />
              <input
                placeholder="ZIP"
                value={address.zip}
                onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))}
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-zinc-200">Payment</h4>
            <input
              placeholder="Card number"
              value={card.number}
              onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              />
              <input
                placeholder="CVC"
                value={card.cvc}
                onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))}
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-3 text-sm text-zinc-400">
            <h4 className="font-medium text-zinc-200">Review your order</h4>
            <p>2 items · Ships to {address.line1 || '—'}</p>
            <p>Payment ending in {card.number.slice(-4) || '—'}</p>
            <p className="border-t border-zinc-800 pt-3 text-zinc-200">
              Total due: ${orderTotal.toFixed(2)}
            </p>
            <p className="text-xs text-zinc-600">
              Totals first appear here — not visible during shipping or payment.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-zinc-800 bg-zinc-900/80 px-4 py-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-400 disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={goNext}
          className="rounded bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900"
        >
          {step === 'review' ? 'Place order' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
