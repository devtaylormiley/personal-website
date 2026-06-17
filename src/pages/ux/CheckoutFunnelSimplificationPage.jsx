import { useState } from 'react'
import { Link } from 'react-router-dom'
import CheckoutFunnelBefore from '../../components/ux/checkoutCaseStudy/CheckoutFunnelBefore'
import CheckoutFunnelAfter from '../../components/ux/checkoutCaseStudy/CheckoutFunnelAfter'
import { getUxCaseNumber } from '../../data/uxImprovements'

const fixes = [
  'Five screens became three — account merged into delivery, and review folded into a final confirm step with totals already known',
  'Order summary stays on screen (sidebar on desktop, expandable bar on mobile) so subtotal, shipping, tax, and total never disappear mid-checkout',
  'Inline field validation on blur replaces a single generic banner after you hit Continue — errors sit next to the field that needs fixing',
  'Segmented progress shows Delivery → Payment → Confirm with the same layout width and primary button placement on every step',
]

export default function CheckoutFunnelSimplificationPage() {
  const [view, setView] = useState('before')

  return (
    <article className="scroll-mt-20 px-6 pt-28 pb-24">
      <div className="mx-auto w-full max-w-7xl">
        <nav className="text-sm text-zinc-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="transition-colors hover:text-violet-400">
                Portfolio
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-600">
              /
            </li>
            <li>
              <Link to="/projects/ux" className="transition-colors hover:text-violet-400">
                UI/UX improvements
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-600">
              /
            </li>
            <li className="text-zinc-300">Checkout funnel simplification</li>
          </ol>
        </nav>

        <header className="mt-8 border-b border-zinc-800 pb-8">
          <p className="text-sm font-medium tracking-widest text-violet-400 uppercase">
            Case study · {getUxCaseNumber('checkout-funnel-simplification')}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Checkout funnel simplification
          </h1>
          <p className="mt-2 text-sm font-medium text-zinc-500 uppercase">E-commerce</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">
            Mobile checkout abandonment spiked at shipping and payment. The legacy funnel split cart,
            account, address, payment, and review into five full-page steps with no running total —
            shoppers re-entered context on every screen and only saw tax and shipping on the last
            step.
          </p>
        </header>

        <div className="mt-10 flex flex-wrap gap-2">
          {[
            { id: 'before', label: 'Before' },
            { id: 'after', label: 'After' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                view === id
                  ? 'bg-violet-600 text-white'
                  : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-12">
          {view === 'before' ? (
            <section>
              <h3 className="mb-3 text-sm font-medium text-red-300/90">Before</h3>
              <CheckoutFunnelBefore />
              <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-zinc-500">
                <li>
                  Five steps — Cart, Account, Shipping, Payment, Review — each a separate screen
                  with a text-only breadcrumb and no order summary column
                </li>
                <li>
                  Subtotal on cart only; shipping and tax deferred with a note that they appear
                  later — full total visible for the first time on Review
                </li>
                <li>
                  Validation runs only when Continue is pressed; a single red banner at the top
                  does not point to which fields failed
                </li>
                <li>
                  Mobile uses the same stacked layout as desktop with no sticky summary — context
                  resets every step
                </li>
              </ul>
            </section>
          ) : (
            <section>
              <h3 className="mb-3 text-sm font-medium text-emerald-300/90">After</h3>
              <CheckoutFunnelAfter />
              <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-zinc-500">
                <li>
                  Three steps — Delivery (email + address + shipping method), Payment, Confirm —
                  guest checkout without a dedicated sign-in gate
                </li>
                <li>
                  Persistent order summary with line items, shipping, tax, and total updating as
                  choices change; collapsible on small viewports
                </li>
                <li>
                  Inline errors on blur with red field borders — Continue is blocked until the
                  current step is valid
                </li>
                <li>
                  Pill-style progress indicator and consistent footer actions; primary CTA label
                  reflects the next step
                </li>
              </ul>
            </section>
          )}
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-medium text-zinc-100">What changed</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {fixes.map((fix) => (
              <li
                key={fix}
                className="flex gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300"
              >
                <span className="text-violet-400" aria-hidden="true">
                  ✓
                </span>
                {fix}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}
