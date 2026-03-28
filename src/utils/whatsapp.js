
export const WHATSAPP_PHONE = '5562981756077';

export function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function buildWhatsAppUrl({ items, subtotal, discount, shipping, total, couponCode }) {
  const itemLines = items
    .map(
      (item) =>
        `• ${item.name} (x${item.quantity}) — ${formatPrice(item.price * item.quantity)}`
    )
    .join('\n');

  const discountLine = discount > 0 ? `Desconto (${couponCode}): -${formatPrice(discount)}\n` : '';
  const shippingLabel = shipping === 0 ? 'Frete: Grátis 🎁\n' : `Frete: ${formatPrice(shipping)}\n`;

  const message =
    `Olá! Quero fazer um pedido:\n\n` +
    `${itemLines}\n\n` +
    `Subtotal: ${formatPrice(subtotal)}\n` +
    `${discountLine}` +
    `${shippingLabel}` +
    `*Total: ${formatPrice(total)}*`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
