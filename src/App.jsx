import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Favorites from './components/Favorites';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { INITIAL_PRODUCTS } from './data/products';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [favOpen, setFavOpen]  = useState(false);

  const products = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('admin_products'));
      return Array.isArray(stored) && stored.length > 0 ? stored : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  })();

  return (
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            <Navbar
              onCartOpen={() => setCartOpen(true)}
              onFavOpen={() => setFavOpen(true)}
            />

            <div className="flex-1 pb-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </div>

            <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Minha Loja &mdash; Compras pelo WhatsApp 🛒
            </footer>

            <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
            <Favorites open={favOpen} onClose={() => setFavOpen(false)} products={products} />

            <FloatingWhatsApp />
          </div>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
