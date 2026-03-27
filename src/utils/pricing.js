
export const COUPONS = {
  SAVE10:    { type: 'percent',  value: 10,  label: '10% de desconto' },
  SAVE20:    { type: 'percent',  value: 20,  label: '20% de desconto' },
  PROMO50:   { type: 'fixed',    value: 50,  label: 'R$ 50 de desconto' },
  FRETEFREE: { type: 'shipping', value: 0,   label: 'Frete grátis' },
};

export function validateCoupon(code) {
  return COUPONS[code.toUpperCase()] || null;
}

export function calcDiscount(subtotal, coupon) {
  if (!coupon) return 0;
  if (coupon.type === 'percent') return (subtotal * coupon.value) / 100;
  if (coupon.type === 'fixed') return Math.min(coupon.value, subtotal);
  return 0;
}

export const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'PAC (5-8 dias)',    price: 15.90 },
  { id: 'express',  label: 'SEDEX (1-3 dias)',   price: 28.90 },
  { id: 'economy',  label: 'Econômico (8-15d)', price: 9.90 },
];

export function simulateShipping(cep) {
  if (!cep || cep.replace(/\D/g, '').length < 8) return null;
  return SHIPPING_OPTIONS;
}

export function calcTotal({ subtotal, discount, shippingPrice }) {
  return Math.max(0, subtotal - discount + shippingPrice);
}
