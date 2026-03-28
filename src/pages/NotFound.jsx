import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center mt-12">
      <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <SearchX className="w-12 h-12" />
      </div>
      <h1 className="text-5xl sm:text-6xl font-black text-slate-800 mb-4 tracking-tight">
        404
      </h1>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mb-3">
        Ops! Página não encontrada
      </h2>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        Parece que você se perdeu. A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para o Início
      </Link>
    </main>
  );
}
