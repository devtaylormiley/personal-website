import { useState } from 'react'
import {
  cartItems,
  cartSubtotal,
  orderTotal,
  shippingEstimate,
  taxEstimate,
} from './checkoutMockData'

const DEMO_BYPASS_HINT = ' Press Continue again to skip validation (demo only).'

const STEPS = [
  { id: 'delivery', label: 'Delivery' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirm', label: 'Confirm' },
]

function OrderSummary({ compact = false }) {
  return (
    <aside
      className={
        compact
          ? 'rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 text-xs'
          : 'rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm'
      }
    >
      <h4 className="font-medium text-zinc-200">Order summary</h4>
      <ul className="mt-3 space-y-2 text-zinc-400">
        {cartItems.map((item) => (
          <li key={item.id} className="flex justify-between gap-2">
            <span className="min-w-0 truncate">
              {item.name}
              <span className="block text-[10px] text-zinc-600">{item.variant}</span>
            </span>
            <span className="shrink-0 text-zinc-300">${item.price}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-3 space-y-1 border-t border-zinc-800 pt-3 text-zinc-500">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="text-zinc-300">${cartSubtotal}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd className="text-zinc-300">${shippingEstimate}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Tax</dt>
          <dd className="text-zinc-300">${taxEstimate.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between border-t border-zinc-800 pt-2 font-medium text-zinc-100">
          <dt>Total</dt>
          <dd>${orderTotal.toFixed(2)}</dd>
        </div>
      </dl>
    </aside>
  )
}

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1 text-xs text-red-400" role="alert">
      {message}
    </p>
  )
}

export default function CheckoutFunnelAfter() {
  const [stepIndex, setStepIndex] = useState(0)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [bannerError, setBannerError] = useState('')
  const [validationFailedOnce, setValidationFailedOnce] = useState(false)
  const [touched, setTouched] = useState({})
  const [delivery, setDelivery] = useState({
    email: '',
    line1: '',
    city: '',
    zip: '',
    method: 'standard',
  })
  const [payment, setPayment] = useState({ number: '', expiry: '', cvc: '' })

  const step = STEPS[stepIndex].id

  const errors = {
    email:
      touched.email && !delivery.email.includes('@') ? 'Enter a valid email address.' : '',
    line1: touched.line1 && !delivery.line1 ? 'Street address is required.' : '',
    zip: touched.zip && delivery.zip.length < 5 ? 'Enter a valid ZIP code.' : '',
    card:
      touched.card && payment.number.length < 12 ? 'Enter a valid card number.' : '',
    expiry: touched.expiry && !payment.expiry ? 'Expiry required.' : '',
  }

  function touch(field) {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  function canAdvanceFromDelivery() {
    return (
      delivery.email.includes('@') &&
      delivery.line1 &&
      delivery.zip.length >= 5
    )
  }

  function canAdvanceFromPayment() {
    return payment.number.length >= 12 && payment.expiry && payment.cvc.length >= 3
  }

  function getStepValidationError() {
    if (step === 'delivery' && !canAdvanceFromDelivery()) {
      return 'Complete the required fields before continuing.'
    }
    if (step === 'payment' && !canAdvanceFromPayment()) {
      return 'Complete payment details before continuing.'
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
      if (step === 'delivery') {
        setTouched({ email: true, line1: true, zip: true })
      } else if (step === 'payment') {
        setTouched((t) => ({ ...t, card: true, expiry: true }))
      }
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
    <div className="overflow-hidden rounded-lg border border-emerald-900/40 bg-zinc-950 shadow-inner">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2">
        <p className="text-xs font-medium text-zinc-500">Northline Goods — checkout (redesign)</p>
        <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-[10px] font-medium text-emerald-300 uppercase">
          After
        </span>
      </div>

      <div className="border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <div className="flex gap-2">
          {STEPS.map((s, index) => (
            <div
              key={s.id}
              className={`flex-1 rounded-full py-1.5 text-center text-[10px] font-medium sm:text-xs ${
                index === stepIndex
                  ? 'bg-violet-600 text-white'
                  : index < stepIndex
                    ? 'bg-violet-950/60 text-violet-300'
                    : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {bannerError ? (
        <div
          className="border-b border-red-900/50 bg-red-950/40 px-4 py-2 text-xs text-red-300"
          role="alert"
        >
          {bannerError}
        </div>
      ) : null}

      <div className="lg:grid lg:grid-cols-[1fr_minmax(12rem,16rem)] lg:gap-0">
        <div className="max-h-[24rem] overflow-auto p-4 sm:p-6 lg:max-h-[28rem]">
          <button
            type="button"
            className="mb-4 flex w-full items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-left text-xs text-zinc-300 lg:hidden"
            onClick={() => setSummaryOpen((o) => !o)}
            aria-expanded={summaryOpen}
          >
            <span>Order summary · ${orderTotal.toFixed(2)}</span>
            <span aria-hidden="true">{summaryOpen ? '▲' : '▼'}</span>
          </button>
          {summaryOpen ? (
            <div className="mb-4 lg:hidden">
              <OrderSummary compact />
            </div>
          ) : null}

          {step === 'delivery' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Contact & delivery</h4>
                <p className="mt-1 text-xs text-zinc-500">
                  Cart items and shipping on one screen — no separate account step.
                </p>
              </div>
              <label className="block text-xs text-zinc-500">
                Email
                <input
                  type="email"
                  value={delivery.email}
                  onChange={(e) => setDelivery((d) => ({ ...d, email: e.target.value }))}
                  onBlur={() => touch('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`mt-1 w-full rounded border bg-zinc-900 px-3 py-2 text-sm text-zinc-200 ${
                    errors.email ? 'border-red-800' : 'border-zinc-700'
                  }`}
                />
                <FieldError id="email-error" message={errors.email} />
              </label>
              <label className="block text-xs text-zinc-500">
                Street address
                <input
                  value={delivery.line1}
                  onChange={(e) => setDelivery((d) => ({ ...d, line1: e.target.value }))}
                  onBlur={() => touch('line1')}
                  aria-invalid={Boolean(errors.line1)}
                  aria-describedby={errors.line1 ? 'line1-error' : undefined}
                  className={`mt-1 w-full rounded border bg-zinc-900 px-3 py-2 text-sm ${
                    errors.line1 ? 'border-red-800' : 'border-zinc-700'
                  }`}
                />
                <FieldError id="line1-error" message={errors.line1} />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="City"
                  value={delivery.city}
                  onChange={(e) => setDelivery((d) => ({ ...d, city: e.target.value }))}
                  className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                />
                <div>
                  <input
                    placeholder="ZIP"
                    value={delivery.zip}
                    onChange={(e) => setDelivery((d) => ({ ...d, zip: e.target.value }))}
                    onBlur={() => touch('zip')}
                    aria-invalid={Boolean(errors.zip)}
                    aria-describedby={errors.zip ? 'zip-error' : undefined}
                    className={`w-full rounded border bg-zinc-900 px-3 py-2 text-sm ${
                      errors.zip ? 'border-red-800' : 'border-zinc-700'
                    }`}
                  />
                  <FieldError id="zip-error" message={errors.zip} />
                </div>
              </div>
              <fieldset className="space-y-2">
                <legend className="text-xs text-zinc-500">Shipping method</legend>
                {[
                  { id: 'standard', label: 'Standard (5–7 days)', price: 8 },
                  { id: 'express', label: 'Express (2 days)', price: 18 },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center justify-between rounded border px-3 py-2 text-sm ${
                      delivery.method === opt.id
                        ? 'border-violet-600 bg-violet-950/30'
                        : 'border-zinc-800'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-zinc-300">
                      <input
                        type="radio"
                        name="ship"
                        checked={delivery.method === opt.id}
                        onChange={() => setDelivery((d) => ({ ...d, method: opt.id }))}
                        className="accent-violet-500"
                      />
                      {opt.label}
                    </span>
                    <span className="text-zinc-400">${opt.price}</span>
                  </label>
                ))}
              </fieldset>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-zinc-200">Payment</h4>
              <label className="block text-xs text-zinc-500">
                Card number
                <input
                  value={payment.number}
                  onChange={(e) => setPayment((p) => ({ ...p, number: e.target.value }))}
                  onBlur={() => touch('card')}
                  aria-invalid={Boolean(errors.card)}
                  aria-describedby={errors.card ? 'card-error' : undefined}
                  className={`mt-1 w-full rounded border bg-zinc-900 px-3 py-2 text-sm ${
                    errors.card ? 'border-red-800' : 'border-zinc-700'
                  }`}
                  placeholder="4242 4242 4242 4242"
                />
                <FieldError id="card-error" message={errors.card} />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    placeholder="MM/YY"
                    value={payment.expiry}
                    onChange={(e) => setPayment((p) => ({ ...p, expiry: e.target.value }))}
                    onBlur={() => touch('expiry')}
                    className={`w-full rounded border bg-zinc-900 px-3 py-2 text-sm ${
                      errors.expiry ? 'border-red-800' : 'border-zinc-700'
                    }`}
                  />
                  <FieldError message={errors.expiry} />
                </div>
                <input
                  placeholder="CVC"
                  value={payment.cvc}
                  onChange={(e) => setPayment((p) => ({ ...p, cvc: e.target.value }))}
                  className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-3 text-sm">
              <h4 className="font-medium text-zinc-200">Confirm & place order</h4>
              <p className="text-zinc-400">
                Deliver to {delivery.line1}, {delivery.city} {delivery.zip}
              </p>
              <p className="text-zinc-400">Receipt sent to {delivery.email}</p>
              <p className="text-zinc-400">
                Card ···· {payment.number.slice(-4) || '4242'}
              </p>
              <button
                type="button"
                className="mt-2 w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
              >
                Place order · ${orderTotal.toFixed(2)}
              </button>
            </div>
          )}
        </div>

        <div className="hidden border-l border-zinc-800 bg-zinc-900/30 p-4 lg:block">
          <OrderSummary />
        </div>
      </div>

      {step !== 'confirm' ? (
        <div className="flex justify-between border-t border-zinc-800 bg-zinc-900/80 px-4 py-3">
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
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            Continue to {step === 'delivery' ? 'payment' : 'review'}
          </button>
        </div>
      ) : (
        <div className="border-t border-zinc-800 px-4 py-2 text-center text-xs text-zinc-600 lg:hidden">
          Summary totals stayed visible while you checked out.
        </div>
      )}
    </div>
  )
}
