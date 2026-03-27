import React from 'react';
import { Heart, ShoppingCart, Star, Flame, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { formatPrice } from '../utils/whatsapp';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? 'star-filled fill-amber-400' : 'star-empty'}`}
        />
      ))}
      <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { name, price, originalPrice, image_url, stock, category, rating, isFeatured, isOnSale, salesCount } = product;
  const { addToCart, items } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const inStock    = stock > 0;
  const lowStock   = inStock && stock <= 3;
  const inCart     = items.some((i) => i.id === product.id);
  const favorited  = isFavorite(product.id);
  const discount   = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className={`group relative bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
      isFeatured ? 'border-indigo-200 shadow-md shadow-indigo-50' : 'border-slate-100 shadow-sm'
    }`}>

      <button
        onClick={() => toggleFavorite(product.id)}
        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full backdrop-blur-sm transition-all shadow-sm ${
          favorited
            ? 'bg-rose-500 text-white'
            : 'bg-white/80 text-slate-400 hover:bg-rose-50 hover:text-rose-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
      </button>

      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {isOnSale && discount > 0 && (
          <span className="flex items-center gap-1 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
            <Tag className="w-2.5 h-2.5" />
            -{discount}%
          </span>
        )}
        {salesCount >= 300 && (
          <span className="flex items-center gap-1 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
            <Flame className="w-2.5 h-2.5" />
            Mais vendido
          </span>
        )}
        {isFeatured && !isOnSale && (
          <span className="bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
            Destaque
          </span>
        )}
      </div>

      <div className="relative bg-slate-50 aspect-[4/3] overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Sem imagem</span>
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
            <span className="bg-white text-slate-800 font-bold text-sm px-4 py-1.5 rounded-full shadow-lg">Esgotado</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{category}</span>
          {salesCount > 0 && (
            <span className="text-xs text-slate-400">{salesCount.toLocaleString('pt-BR')} vendidos</span>
          )}
        </div>

        <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 flex-1">{name}</h3>

        <StarRating rating={rating} />

        {lowStock && (
          <p className="text-xs font-semibold text-amber-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
            Últimas {stock} unidades!
          </p>
        )}

        <div className="flex items-end justify-between gap-2 mt-auto pt-1">
          <div>
            {originalPrice && isOnSale && (
              <p className="text-xs text-slate-400 line-through">{formatPrice(originalPrice)}</p>
            )}
            <p className={`text-xl font-black ${isOnSale ? 'text-rose-600' : 'text-indigo-700'}`}>
              {formatPrice(price)}
            </p>
          </div>

          <button
            onClick={() => inStock && addToCart(product)}
            disabled={!inStock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
              !inStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : inCart
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200 hover:shadow-emerald-300 active:scale-95'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 active:scale-95'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {inStock ? (inCart ? 'Adicionado' : 'Comprar') : 'Esgotado'}
          </button>
        </div>
      </div>
    </div>
  );
}
