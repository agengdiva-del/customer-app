import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_MERCHANTS, GROCERY_IMAGE } from '../../data/mockData';
import { ArrowLeft, Clock, Zap, Plus, Sparkles, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../../types';

export const GroceryView: React.FC = () => {
  const { setActiveService, addToCart, showToast } = useApp();
  const [deliveryType, setDeliveryType] = useState<'instant' | 'scheduled'>('instant');
  const [scheduledSlot, setScheduledSlot] = useState('Besok Pagi (06:00 - 08:00 WIB)');

  const groceryMerchant = INITIAL_MERCHANTS.find(m => m.type === 'grocery') || INITIAL_MERCHANTS[3];

  const handleQuickAdd = (item: MenuItem) => {
    addToCart(groceryMerchant, item, 1);
  };

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
            <span>AWD Mart · Pasar Segar Arja</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sayur petik segar, bumbu dapur & sembako harga pasar tradisional
          </p>
        </div>
      </div>

      {/* Instant vs Scheduled Delivery Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="text-xs font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider">
          PILIHAN WAKTU PENGANTARAN KURIR AWD
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setDeliveryType('instant');
              showToast('Pengantaran Instan Aktif (Tiba dlm 20-30 menit)');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              deliveryType === 'instant'
                ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-slate-800 text-blue-900 dark:text-blue-300 ring-2 ring-blue-500/30 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-bold">Instan (20 Menit)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Kurir AWD langsung belanja & antar ke rumah
            </p>
          </button>

          <button
            onClick={() => {
              setDeliveryType('scheduled');
              showToast('Pengantaran Terjadwal Dipilih');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              deliveryType === 'scheduled'
                ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-slate-800 text-blue-900 dark:text-blue-300 ring-2 ring-blue-500/30 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="text-xs sm:text-sm font-bold">Terjadwal</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Pilih jam tiba sesuai jadwal memasak Anda
            </p>
          </button>
        </div>

        {deliveryType === 'scheduled' && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Slot Pengiriman:</span>
            <select
              value={scheduledSlot}
              onChange={(e) => setScheduledSlot(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option>Besok Pagi (06:00 - 08:00 WIB)</option>
              <option>Besok Siang (11:00 - 13:00 WIB)</option>
              <option>Besok Sore (16:00 - 18:00 WIB)</option>
            </select>
          </div>
        )}
      </div>

      {/* Featured Banner */}
      <div className="relative rounded-3xl overflow-hidden h-36 bg-slate-900 shadow-md">
        <img
          src={GROCERY_IMAGE}
          alt="Pasar Segar"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-indigo-900/60 to-transparent p-4 flex flex-col justify-center text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
            PASAR DARURAT JUNGJANG ARJAWINANGUN
          </span>
          <h3 className="text-base sm:text-lg font-bold">
            Harga Asli Pasar Tanpa Mark-Up Berlebih
          </h3>
          <p className="text-xs text-blue-100 mt-0.5">
            Jaminan garansi kesegaran: sayur layu kurir AWD siap ganti
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Kebutuhan Dapur & Bahan Pokok Segar
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {groceryMerchant.menu.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
            >
              <div>
                <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.isPopular && (
                    <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow">
                      Segar
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-blue-600 dark:text-sky-400 font-bold block">
                  {item.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                  {item.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  Rp{item.price.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={() => handleQuickAdd(item)}
                  className="p-1.5 px-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  title="Tambah ke Keranjang"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden xs:inline">Beli</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
