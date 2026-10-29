import React from 'react';
import { MenuItem, Merchant } from '../../types';
import { useApp } from '../../context/AppContext';
import { Plus, Check } from 'lucide-react';

interface ShopeeProductCardProps {
  item: MenuItem;
  merchant: Merchant;
  onSelect?: () => void;
}

export const ShopeeProductCard: React.FC<ShopeeProductCardProps> = ({ item, merchant, onSelect }) => {
  const { addToCart, showToast } = useApp();
  const [justAdded, setJustAdded] = React.useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(merchant, item, 1);
    setJustAdded(true);
    showToast(`Ditambahkan ke keranjang: ${item.name}`);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const discountPercent = item.originalPrice && item.originalPrice > item.price
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect?.();
        }
      }}
      className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-sky-500/60 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      {/* 1. GAMBAR (Aspect Ratio 1:1 Khas Shopee) */}
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback placeholder if image fails
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80';
          }}
        />

        {/* Optional Diskon Tag jika ada promo */}
        {discountPercent && (
          <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-red-600 to-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs tracking-wider">
            -{discountPercent}%
          </div>
        )}

        {/* Quick Add "+" Floating Button */}
        <button
          onClick={handleQuickAdd}
          title="Tambah ke keranjang"
          aria-label={`Tambah ${item.name}`}
          className={`absolute bottom-1.5 right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white group-hover:scale-105'
          }`}
        >
          {justAdded ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
        </button>
      </div>

      {/* 2. NAMA & 3. HARGA (Rapat, Bersih, Tuntas Sesuai Permintaan) */}
      <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1 gap-1">
        {/* NAMA (Line Clamp 2) */}
        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors min-h-[2rem]">
          {item.name}
        </h4>

        {/* HARGA */}
        <div className="pt-0.5 flex items-baseline justify-between gap-1 flex-wrap">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-sky-400">Rp</span>
            <span className="text-xs sm:text-sm font-extrabold font-mono text-blue-600 dark:text-sky-400 tracking-tight">
              {item.price.toLocaleString('id-ID')}
            </span>
          </div>

          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-[9px] sm:text-[10px] text-slate-400 line-through">
              Rp{item.originalPrice.toLocaleString('id-ID')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
