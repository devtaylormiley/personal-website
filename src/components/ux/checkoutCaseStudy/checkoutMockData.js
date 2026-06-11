export const cartItems = [
  { id: '1', name: 'Merino crew neck', variant: 'Charcoal · M', price: 68 },
  { id: '2', name: 'Organic cotton tee', variant: 'Stone · L', price: 42 },
]

export const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
export const shippingEstimate = 8
export const taxEstimate = Math.round(cartSubtotal * 0.0825 * 100) / 100
export const orderTotal = cartSubtotal + shippingEstimate + taxEstimate
