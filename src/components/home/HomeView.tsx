import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_MERCHANTS, VOUCHERS_LIST } from '../../data/mockData';
import { BannerCarousel } from './BannerCarousel';
import { ServiceGrid } from './ServiceGrid';
import { ActiveOrderWidget } from './ActiveOrderWidget';
import { MerchantCard } from './MerchantCard';
import { 
  Search, 
  SlidersHorizontal, 
  QrCode, 
  ArrowUpRight, 
  Send, 
  Sparkles, 
  Tag, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    walletBalance, 
    user, 
    setActiveTab, 
    setActiveService, 
    showToast,
    setIsKycModalOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'nearest' | 'highest_rated' | 'promo' | 'open'>('all');

  // Filter merchants based on search and selected filter
  const filteredMerchants = INITIAL_MERCHANTS.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.menu.some(dish => dish.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (filterType === 'nearest') return m.distanceKm <= 1.2;
    if (filterType === 'highest_rated') return m.rating >= 4.8;
    if (filterType === 'open') return m.isOpen;
    if (filterType === 'promo') return m.menu.some(dish => dish.originalPrice && dish.originalPrice > dish.price);

    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Brand Hero Welcome Banner featuring AWD Official Logo */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-blue-500/30 flex items-center justify-between gap-4 overflow-hidden relative">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-[10px] font-extrabold uppercase tracking-widest text-sky-300">
              ARJAWINANGUN HIPERLOKAL
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
            AWD <span className="text-sky-400 font-extrabold">Arjawinangun Delivery</span>
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md">
            Layanan pengantaran makanan, pasar, apotek, dan paket resmi <strong className="text-white">By Wong Nangun</strong>.
          </p>
        </div>

        {/* AWD Circular Emblem Logo */}
        <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-500 shadow-xl shadow-blue-500/30">
          <img
            src="/assets/aistudio/Designer_b056b7f0.png"
            alt="AWD Logo"
            className="w-full h-full object-contain rounded-full bg-white shadow-inner"
          />
        </div>
      </div>

      {/* Search Bar & Filter Strip */}
      <section className="space-y-2.5">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari empal gentong, nasi jamblang, obat, sayur di Arjawinangun..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => showToast('Filter lokasi Arjawinangun aktif')}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200/80 dark:border-slate-800 text-blue-600 dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-slate-800 shrink-0 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType('nearest')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 ${
              filterType === 'nearest'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300'
            }`}
          >
            Terdekat (&le; 1.2 km)
          </button>
          <button
            onClick={() => setFilterType('highest_rated')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 ${
              filterType === 'highest_rated'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300'
            }`}
          >
            Rating Tertinggi (4.8+)
          </button>
          <button
            onClick={() => setFilterType('promo')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 ${
              filterType === 'promo'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300'
            }`}
          >
            Promo Diskon
          </button>
          <button
            onClick={() => setFilterType('open')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 ${
              filterType === 'open'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300'
            }`}
          >
            Buka Sekarang
          </button>
        </div>
      </section>

      {/* Quick MitraPay Action Card with Blue Gradient Design */}
      <section className="bg-gradient-to-r from-blue-800 via-indigo-800 to-sky-700 text-white rounded-3xl p-4 sm:p-5 shadow-xl shadow-blue-900/20 border border-blue-400/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-black text-xl shadow-inner">
            <span>Rp</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">MitraPay Saldo</span>
              <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">
                {user.loyaltyLevel.toUpperCase()}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white tabular-nums tracking-tight">
              Rp{walletBalance.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="ml-auto sm:ml-4 pl-3 border-l border-white/20 text-right sm:text-left">
            <div className="text-[10px] text-blue-200 font-medium">Poin Loyalitas</div>
            <div className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{user.points} pts</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-xs transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-sky-300" />
            <span>Top Up</span>
          </button>
          <button
            onClick={() => showToast('Buka Pemindai QRIS MitraPay')}
            className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-xs transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-300" />
            <span>Bayar QR</span>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-sky-300" />
            <span>Transfer</span>
          </button>
        </div>
      </section>

      {/* KYC Verification Reminder Banner (if not fully verified) */}
      {user.verificationStatus !== 'verified' && (
        <section className="bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10 border border-blue-300 dark:border-blue-800/60 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-sky-400 shrink-0" />
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Verifikasi Akun & Dapatkan +50 Poin MitraArja
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Upload foto KTP dan foto selfie untuk batas saldo tanpa limit.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsKycModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shrink-0 shadow-sm"
          >
            Verifikasi
          </button>
        </section>
      )}

      {/* Active Order Live Tracker Banner (If Order in progress) */}
      <ActiveOrderWidget />

      {/* Main Promo Carousel */}
      <BannerCarousel />

      {/* Super-App Services Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Layanan MitraArja · AWD
          </h3>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-sky-400">
            Arjawinangun & Sekitarnya
          </span>
        </div>
        <ServiceGrid />
      </section>

      {/* Vouchers & Promos Horizontal Strip */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-blue-600" />
            <span>Kupon & Diskon Spesial Hari Ini</span>
          </h3>
          <span className="text-xs text-blue-600 dark:text-sky-400 font-semibold cursor-pointer">
            Lihat Semua
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VOUCHERS_LIST.map(v => (
            <div
              key={v.code}
              className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-blue-100 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2 hover:border-blue-400 transition-colors"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold font-mono text-blue-700 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                    {v.code}
                  </span>
                  <span className="text-[10px] text-slate-400">{v.expiry}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {v.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {v.minOrder}
                </div>
              </div>
              <button
                onClick={() => showToast(`Kupon ${v.code} berhasil disalin!`)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/60 shrink-0 transition-colors"
              >
                Gunakan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Merchants & Stores in Arjawinangun */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {filterType === 'all' ? 'Merchant & Kuliner Pilihan Arjawinangun' : 'Hasil Filter Toko'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mitra resmi UMKM lokal terverifikasi siap antar langsung oleh kurir AWD
            </p>
          </div>
          <button
            onClick={() => setActiveService('food')}
            className="text-xs text-blue-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-0.5"
          >
            <span>Selengkapnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {filteredMerchants.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">Tidak ada merchant yang cocok dengan pencarian "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMerchants.map(merchant => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
