import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { INITIAL_PRODUCTS, CATEGORIES } from '../data/products';
import { SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'default',   label: 'Relevância' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc',label: 'Maior preço' },
  { value: 'rating',    label: 'Avaliação' },
  { value: 'sales',     label: 'Mais vendidos' },
];

export default function Home() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('Todos');
  const [sort, setSort]         = useState('default');
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const baseProducts = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('admin_products'));
      return Array.isArray(stored) && stored.length > 0 ? stored : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }, []);

  const products = useMemo(() => {
    let list = baseProducts;

    if (search)
      list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    if (category !== 'Todos')
      list = list.filter((p) => p.category === category);

    if (onSaleOnly)
      list = list.filter((p) => p.isOnSale);

    switch (sort) {
      case 'price_asc':  list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price_desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating':     list = [...list].sort((a, b) => b.rating - a.rating); break;
      case 'sales':      list = [...list].sort((a, b) => b.salesCount - a.salesCount); break;
      default:
        list = [...list].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [baseProducts, search, category, sort, onSaleOnly]);

  const featured   = baseProducts.filter((p) => p.isFeatured).slice(0, 4);
  const onSaleList = baseProducts.filter((p) => p.isOnSale);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white px-8 py-10 sm:py-14">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full" />

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
            <Sparkles className="w-3 h-3" /> Novidades da semana
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-3">
            Produtos incríveis,<br />preços impossíveis.
          </h1>
          <p className="text-indigo-100 text-base mb-6">
            Compre direto pelo WhatsApp. Rápido, simples e seguro.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2.5 bg-white text-indigo-700 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors shadow-md"
            >
              Ver produtos
            </button>
            <button
              onClick={() => setOnSaleOnly(true)}
              className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl text-sm hover:bg-white/30 border border-white/20 transition-colors"
            >
              🏷️ Ver promoções
            </button>
          </div>

          <div className="flex gap-6 mt-8">
            <div><p className="text-2xl font-black">{baseProducts.length}+</p><p className="text-xs text-indigo-200">Produtos</p></div>
            <div className="w-px bg-white/20" />
            <div><p className="text-2xl font-black">{onSaleList.length}</p><p className="text-xs text-indigo-200">Em promoção</p></div>
            <div className="w-px bg-white/20" />
            <div><p className="text-2xl font-black">⚡ Rápido</p><p className="text-xs text-indigo-200">Via WhatsApp</p></div>
          </div>
        </div>
      </section>

      {featured.length > 0 && category === 'Todos' && !search && !onSaleOnly && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h2 className="text-lg font-black text-slate-800">Em destaque</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <section id="products-section">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:border-indigo-400 shadow-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              onClick={() => setOnSaleOnly(!onSaleOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                onSaleOnly
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-500'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Promoções
            </button>
          </div>
        </div>

        <div className="mb-5">
          <CategoryFilter categories={CATEGORIES} selected={category} onChange={setCategory} />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{products.length}</span> produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <div className="text-5xl">🔍</div>
            <p className="font-medium text-lg">Nenhum produto encontrado</p>
            <p className="text-sm">Tente buscar outro termo ou categoria</p>
            <button
              onClick={() => { setSearch(''); setCategory('Todos'); setOnSaleOnly(false); }}
              className="mt-2 px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
