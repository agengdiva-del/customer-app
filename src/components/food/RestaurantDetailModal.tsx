import React, { useState } from 'react';
import { Merchant, MenuItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Star, 
  Clock, 
  Bike, 
  MapPin, 
  CheckCircle, 
  Plus, 
  Minus, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface RestaurantDetailModalProps {
  merchant: Merchant;
  onClose: () => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({ merchant, onClose }) => {
  const { addToCart, cart } = useApp();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(merchant.menu.map(m => m.category)))];

  const displayedDishes = selectedCategory === 'Semua' 
    ? merchant.menu 
    : merchant.menu.filter(m => m.category === selectedCategory);

  const handleOpenDish = (dish: MenuItem) => {
    setSelectedItem(dish);
    setQuantity(1);
    setNotes('');
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItem) return;
    addToCart(merchant, selectedItem, quantity, notes);
    setSelectedItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-blue-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Hero Banner */}
        <div className="relative h-44 sm:h-52 w-full shrink-0">
          <img
            src={merchant.bannerUrl}
            alt={merchant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/30" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Store Logo & Title Overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
            <img
              src={merchant.logoUrl}
              alt={merchant.name}
              className="w-14 h-14 rounded-2xl border-2 border-white dark:border-slate-800 object-cover shadow-md bg-white shrink-0"
            />
            <div className="text-white min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-xl font-bold truncate">
                  {merchant.name}
                </h2>
                {merchant.isVerified && (
                  <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-blue-100 truncate">{merchant.tagline}</p>
            </div>
          </div>
        </div>

        {/* Info Metrics Bar */}
        <div className="px-4 py-2.5 bg-blue-50/50 dark:bg-slate-800/60 border-b border-blue-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{merchant.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({merchant.reviewCount} ulasan)</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{merchant.deliveryTimeMin} mnt</span>
          </div>
          <div className="flex items-center gap-1">
            <Bike className="w-4 h-4 text-blue-600" />
            <span>{merchant.distanceKm} km</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="truncate max-w-[100px]">{merchant.address}</span>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {displayedDishes.map(dish => {
            const inCart = cart.find(c => c.item.id === dish.id);
            return (
              <div
                key={dish.id}
                onClick={() => handleOpenDish(dish)}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-slate-800/40 transition-all cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {dish.name}
                    </h4>
                    {dish.isPopular && (
                      <span className="flex items-center gap-0.5 text-[9px] bg-sky-100 dark:bg-sky-950 text-blue-700 dark:text-sky-400 font-bold px-1.5 py-0.2 rounded shrink-0">
                        <Sparkles className="w-2.5 h-2.5" /> Terlaris
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {dish.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 font-mono">
                    <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-sky-400 tabular-nums">
                      Rp{dish.price.toLocaleString('id-ID')}
                    </span>
                    {dish.originalPrice && (
                      <span className="text-[11px] line-through text-slate-400 tabular-nums">
                        Rp{dish.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {inCart && (
                    <div className="absolute top-1.5 right-1.5 bg-blue-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                      {inCart.quantity}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDish(dish);
                    }}
                    className="absolute bottom-1 right-1 p-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-blue-600 shadow"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dish Customization & Add to Cart Sub-Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-blue-100 dark:border-slate-800 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedItem.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedItem.description}
                </p>
                <div className="text-sm font-bold text-blue-600 font-mono mt-1">
                  Rp{selectedItem.price.toLocaleString('id-ID')}
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Special Instructions Note */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Catatan Pesanan (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Sambal dipisah, kuah panas..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Quantity Selector & Confirm CTA */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm font-mono w-5 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleConfirmAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah · Rp{(selectedItem.price * quantity).toLocaleString('id-ID')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
