import React from 'react';
import { Merchant } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, Clock, Bike, CheckCircle, Heart } from 'lucide-react';

interface MerchantCardProps {
  merchant: Merchant;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({ merchant }) => {
  const { setSelectedMerchant, toggleFavorite, isFavorite } = useApp();
  const favorited = isFavorite(merchant.id);

  return (
    <div 
      onClick={() => setSelectedMerchant(merchant)}
      className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer flex flex-col"
    >
      {/* Banner Image Container */}
      <div className="relative h-36 sm:h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={merchant.bannerUrl}
          alt={merchant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(merchant.id);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors shadow-xs"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Promo tag or Distance badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-sky-400" />
            {merchant.deliveryTimeMin} mnt
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
            <Bike className="w-3 h-3 text-sky-400" />
            {merchant.distanceKm} km
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-blue-600 dark:text-sky-400">
              {merchant.category}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{merchant.rating.toFixed(1)}</span>
              <span className="text-[10px] font-normal text-slate-400">({merchant.reviewCount})</span>
            </div>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 flex items-center gap-1">
            <span>{merchant.name}</span>
            {merchant.isVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            )}
          </h4>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {merchant.tagline}
          </p>
        </div>

        {/* Delivery Fee & Address */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <span>Ongkir</span>
            <span className="font-bold text-blue-700 dark:text-sky-400 font-mono tabular-nums">
              Rp{merchant.deliveryFee.toLocaleString('id-ID')}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
            {merchant.address}
          </span>
        </div>
      </div>
    </div>
  );
};
