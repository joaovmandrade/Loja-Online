import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Store, Settings, X, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Navbar({ onCartOpen, onFavOpen }) {
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        <Link to="/" className="flex items-center gap-2 font-black text-xl text-slate-900 hover:text-indigo-600 transition-colors shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:block">Minha Loja</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 justify-end">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Produtos
          </Link>
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              location.pathname === '/admin' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onFavOpen}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-rose-500 transition-all"
            title="Favoritos"
          >
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            onClick={onCartOpen}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all"
            title="Carrinho"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              location.pathname === '/' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Produtos
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
              location.pathname === '/admin' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
