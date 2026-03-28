import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingCart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/whatsapp';
import { supabase } from '../services/supabase';

export default function Favorites({ open, onClose }) {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const [favProducts, setFavProducts] = useState([]);

  useEffect(() => {
    if (open && favorites.length > 0) {
      supabase
        .from('products')
        .select('*')
        .in('id', favorites)
        .then(({ data }) => {
          if (data) setFavProducts(data);
        });
    } else if (favorites.length === 0) {
      setFavProducts([]);
    }
  }, [open, favorites]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-bold text-slate-800 text-lg">Favoritos</h2>
            {favProducts.length > 0 && (
              <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {favProducts.length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {favProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 p-8">
            <Heart className="w-16 h-16 text-slate-200" />
            <p className="font-medium">Nenhum favorito ainda</p>
            <p className="text-sm text-center">Toque no ❤️ em um produto para salvar</p>
            <button onClick={onClose} className="mt-4 px-6 py-2 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors">
              Explorar produtos
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {favProducts.map((product) => (
              <div key={product.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-100 shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Heart className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 line-clamp-2">{product.name}</p>
                  <p className="text-base font-black text-indigo-700 mt-0.5">{formatPrice(product.price)}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => product.stock > 0 && addToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        product.stock === 0
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {product.stock === 0 ? 'Esgotado' : 'Adicionar'}
                    </button>
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
