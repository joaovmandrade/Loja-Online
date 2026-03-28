import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, MapPin, Truck, ChevronRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, buildWhatsAppUrl } from '../utils/whatsapp';
import { validateCoupon, calcDiscount, simulateShipping, calcTotal } from '../utils/pricing';

export default function Cart({ open, onClose }) {
  const { items, removeFromCart, updateQty, subtotal, clearCart } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const [cepInput, setCepInput] = useState('');
  const [shippingOptions, setShippingOptions] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [cepLoading, setCepLoading] = useState(false);

  // Address Step State
  const [step, setStep] = useState('cart'); // 'cart' | 'address'
  const [address, setAddress] = useState({ street: '', number: '', neighborhood: '', city: 'Anápolis', complement: '' });
  const [addressError, setAddressError] = useState('');

  const discount      = calcDiscount(subtotal, appliedCoupon);
  const shippingPrice = appliedCoupon?.type === 'shipping'
    ? 0
    : (selectedShipping?.price ?? 0);
  const total = calcTotal({ subtotal, discount, shippingPrice });

  const applyCoupon = () => {
    setCouponError('');
    const coupon = validateCoupon(couponInput.trim());
    if (!coupon) {
      setCouponError('Cupom inválido. Tente: SAVE10, SAVE20, PROMO50, FRETEFREE');
      return;
    }
    setAppliedCoupon({ code: couponInput.toUpperCase(), ...coupon });
    setCouponInput('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const calcShipping = () => {
    setCepLoading(true);
    setTimeout(() => {
      const options = simulateShipping(cepInput);
      if (options) {
        setShippingOptions(options);
        setSelectedShipping(options[0]);
      }
      setCepLoading(false);
    }, 800);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setStep('address'); // Move to address step
  };

  const handleFinalCheckout = () => {
    setAddressError('');
    
    // Validate city Anápolis
    const normalizedCity = address.city.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalizedCity !== 'anapolis') {
      setAddressError('Desculpe, realizamos entregas apenas na cidade de Anápolis-GO.');
      return;
    }
    if (!address.street || !address.number || !address.neighborhood) {
      setAddressError('Preencha todos os campos obrigatórios (Rua, Número, Bairro).');
      return;
    }

    const compiledAddress = `${address.street}, ${address.number} - ${address.neighborhood}${address.complement ? ` (${address.complement})` : ''}, ${address.city}`;

    const url = buildWhatsAppUrl({
      items,
      subtotal,
      discount,
      shipping: shippingPrice,
      total,
      couponCode: appliedCoupon?.code,
      address: compiledAddress
    });
    window.open(url, '_blank');
    clearCart();
    setStep('cart');
    onClose();
  };

  const formatCep = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    return digits.length > 5 ? digits.replace(/^(\d{5})(\d+)/, '$1-$2') : digits;
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {step === 'address' ? (
              <button onClick={() => setStep('cart')} className="p-1 -ml-1 text-slate-500 hover:bg-slate-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
            )}
            <h2 className="font-bold text-slate-800 text-lg">{step === 'address' ? 'Endereço de Entrega' : 'Carrinho'}</h2>
            {items.length > 0 && step === 'cart' && (
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)} itens
              </span>
            )}
          </div>
          <button onClick={() => { onClose(); setStep('cart'); }} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 p-8">
            <ShoppingBag className="w-16 h-16 text-slate-200" />
            <p className="font-medium">Seu carrinho está vazio</p>
            <p className="text-sm text-center">Adicione produtos para continuar</p>
            <button onClick={() => { onClose(); setStep('cart'); }} className="mt-4 px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
              Ver produtos
            </button>
          </div>
        ) : step === 'address' ? (
          <div className="flex-1 flex flex-col pt-2">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <p className="text-sm text-slate-600 mb-2">Preencha os dados de entrega. <strong className="text-indigo-600">Entregamos apenas em Anápolis.</strong></p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Cidade *</label>
                  <input value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} placeholder="Anápolis" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-700" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rua / Avenida *</label>
                  <input value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} placeholder="Ex: Rua das Flores" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-700" />
                </div>
                <div className="flex gap-3">
                  <div className="w-1/3">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Número *</label>
                    <input value={address.number} onChange={(e) => setAddress({...address, number: e.target.value})} placeholder="123" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bairro *</label>
                    <input value={address.neighborhood} onChange={(e) => setAddress({...address, neighborhood: e.target.value})} placeholder="Centro" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-700" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Complemento</label>
                  <input value={address.complement} onChange={(e) => setAddress({...address, complement: e.target.value})} placeholder="Apto, Bloco, Referência (Opcional)" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-700" />
                </div>
              </div>

              {addressError && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                  {addressError}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 px-5 py-4 bg-white">
               <button
                  onClick={handleFinalCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Enviar Pedido no WhatsApp
                </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-100 shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatPrice(item.price)} cada</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold text-slate-800 w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-sm font-black text-slate-800">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cupom de desconto</p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700">{appliedCoupon.code}</span>
                      <span className="text-xs text-emerald-600">— {appliedCoupon.label}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-emerald-500 hover:text-emerald-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                      placeholder="Ex: SAVE10"
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-700"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-rose-500 mt-1.5">{couponError}</p>}
              </div>

              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Calcular frete</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      value={cepInput}
                      onChange={(e) => setCepInput(formatCep(e.target.value))}
                      placeholder="00000-000"
                      maxLength={9}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-700"
                    />
                  </div>
                  <button
                    onClick={calcShipping}
                    disabled={cepLoading}
                    className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-60"
                  >
                    {cepLoading ? '...' : 'Calcular'}
                  </button>
                </div>

                {shippingOptions && appliedCoupon?.type !== 'shipping' && (
                  <div className="mt-2 space-y-1.5">
                    {shippingOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedShipping(opt)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition-all ${
                          selectedShipping?.id === opt.id
                            ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          <span className="font-medium">{opt.label}</span>
                        </div>
                        <span className="font-bold">{formatPrice(opt.price)}</span>
                      </button>
                    ))}
                  </div>
                )}
                {appliedCoupon?.type === 'shipping' && (
                  <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Frete grátis aplicado!
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 px-5 py-4 bg-white space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Desconto</span>
                  <span className="font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-600">
                <span>Frete</span>
                <span className="font-semibold">
                  {appliedCoupon?.type === 'shipping'
                    ? 'Grátis 🎁'
                    : selectedShipping
                    ? formatPrice(selectedShipping.price)
                    : '—'}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total</span>
                <span className="text-indigo-700 text-xl">{formatPrice(total)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-indigo-200 transition-all"
              >
                Continuar para Entrega
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-slate-400 mt-1">
                Disponíveis: SAVE10, SAVE20, PROMO50, FRETEFREE
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
