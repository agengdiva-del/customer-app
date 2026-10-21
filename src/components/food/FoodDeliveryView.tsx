import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_MERCHANTS } from '../../data/mockData';
import { MerchantCard } from '../home/MerchantCard';
import { 
  ArrowLeft, 
  Search, 
  Flame, 
  Utensils, 
  Coffee, 
  Fish, 
  Sparkles,
  Layers
} from 'lucide-react';

export const FoodDeliveryView: React.FC = () => {
  const { setActiveService } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [search, setSearch] = useState('');

  const foodCategories = [
    { id: 'Semua', label: 'Semua', icon: Layers },
    { id: 'Tradisional', label: 'Khas Cirebon', icon: Flame },
    { id: 'Bakso & Mie', label: 'Bakso & Mie', icon: Utensils },
    { id: 'Sup & Daging', label: 'Empal & Sate', icon: Flame },
    { id: 'Camilan', label: 'Martabak', icon: Sparkles },
    { id: 'Coffee', label: 'Kopi & Minuman', icon: Coffee },
    { id: 'Seafood', label: 'Seafood Segar', icon: Fish },
  ];

  const foodMerchants = INITIAL_MERCHANTS.filter(m => m.type === 'food').filter(m => {
    const matchesCategory = selectedCategory === 'Semua' || 
      m.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Tradisional' && m.category.includes('Tradisional')) ||
      (selectedCategory === 'Bakso & Mie' && m.category.includes('Bakso'));

    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.menu.some(dish => dish.name.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-20">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveService(null)}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>AWD Food</span>
            <span className="text-xs font-bold text-sky-500 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
              Arjawinangun
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kuliner lezat autentik diantar hangat & cepat oleh kurir AWD
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari empal asem, nasi jamblang, sate kambing, martabak..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {foodCategories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {foodMerchants.map(merchant => (
          <MerchantCard key={merchant.id} merchant={merchant} />
        ))}
      </div>
    </div>
  );
};
