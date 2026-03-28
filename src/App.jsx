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
import NotFound from './pages/NotFound';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [favOpen, setFavOpen]  = useState(false);

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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

            <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Minha Loja &mdash; Compras pelo WhatsApp 🛒
            </footer>

            <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
            <Favorites open={favOpen} onClose={() => setFavOpen(false)} />

            <FloatingWhatsApp />
          </div>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
