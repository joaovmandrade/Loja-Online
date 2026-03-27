import React from 'react';

export default function CategoryFilter({ categories, selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
            selected === cat
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200'
              : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
