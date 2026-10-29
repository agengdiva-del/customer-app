import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_MERCHANTS } from '../../data/mockData';
import { ShopeeProductCard } from './ShopeeProductCard';
import { MenuItem, Merchant } from '../../types';
import { 
  Search, 
  X, 
  Flame, 
  Star, 
  ArrowDownUp, 
  SlidersHorizontal,
  UserPlus, 
  Wallet, 
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

type SortCriteria = 'terlaris' | 'populer' | 'harga_asc' | 'harga_desc' | 'nama_asc';
type CategoryCriteria = 'all' | 'warung_makan' | 'jajanan' | 'minuman' | 'cirebon' | 'sembako';

interface CatalogEntry {
  item: MenuItem;
  merchant: Merchant;
}

export const HomeView: React.FC = () => {
  const { 
    walletBalance, 
    openAuthModal, 
    setSelectedMerchant, 
    activeOrder,
    setIsTrackingModalOpen,
    setActiveTab,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortCriteria>('terlaris');
  const [categoryFilter, setCategoryFilter] = useState<CategoryCriteria>('all');

  // Flatten all menu items from all merchants into a rich product catalog
  const allCatalogProducts: CatalogEntry[] = useMemo(() => {
    const list: CatalogEntry[] = [];
    INITIAL_MERCHANTS.forEach(m => {
      m.menu.forEach(dish => {
        list.push({
          item: {
            ...dish,
            merchantName: m.name,
            merchantCategory: m.category,
            rating: dish.rating || m.rating,
            soldCount: dish.soldCount || (dish.isPopular ? 1500 : 350)
          },
          merchant: m
        });
      });
    });
    return list;
  }, []);

  // Filter and sort items based on Nama / Jenis / Harga / Terlaris / Populer
  const filteredProducts = useMemo(() => {
    return allCatalogProducts.filter(({ item, merchant }) => {
      // 1. Kriteria Nama (Instant keyword filter)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchMerchant = merchant.name.toLowerCase().includes(q);
        const matchCat = item.category?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        if (!matchName && !matchMerchant && !matchCat && !matchDesc) {
          return false;
        }
      }

      // 2. Kriteria Jenis / Kategori
      if (categoryFilter === 'warung_makan') {
        const text = (item.category + ' ' + merchant.category + ' ' + item.name).toLowerCase();
        const isWarungMakan =
          text.includes('makan') ||
          text.includes('nasi') ||
          text.includes('tradisional') ||
          text.includes('sup') ||
          text.includes('daging') ||
          text.includes('bakso') ||
          text.includes('mie') ||
          text.includes('sate') ||
          text.includes('warteg');
        if (!isWarungMakan) return false;
      } else if (categoryFilter === 'jajanan') {
        const text = (item.category + ' ' + merchant.category + ' ' + item.name).toLowerCase();
        const isJajanan =
          text.includes('jajanan') ||
          text.includes('camilan') ||
          text.includes('martabak') ||
          text.includes('gorengan') ||
          text.includes('tahu') ||
          text.includes('seblak') ||
          text.includes('pisang') ||
          text.includes('cireng');
        if (!isJajanan) return false;
      } else if (categoryFilter === 'minuman') {
        const text = (item.category + ' ' + merchant.category + ' ' + item.name).toLowerCase();
        const isMinuman =
          text.includes('minum') ||
          text.includes('es ') ||
          text.includes('es') ||
          text.includes('cendol') ||
          text.includes('teh') ||
          text.includes('kelapa') ||
          text.includes('wedang');
        if (!isMinuman) return false;
      } else if (categoryFilter === 'cirebon') {
        const text = (item.name + ' ' + item.description + ' ' + merchant.name).toLowerCase();
        const isKhasCirebon =
          text.includes('jamblang') ||
          text.includes('empal') ||
          text.includes('lengko') ||
          text.includes('gejrot') ||
          text.includes('balakutak') ||
          text.includes('cirebon') ||
          text.includes('docang');
        if (!isKhasCirebon) return false;
      } else if (categoryFilter === 'sembako') {
        const text = (item.category + ' ' + merchant.category + ' ' + item.name).toLowerCase();
        const isSembako =
          merchant.type === 'grocery' ||
          text.includes('sembako') ||
          text.includes('sayur') ||
          text.includes('bumbu') ||
          text.includes('beras') ||
          text.includes('minyak');
        if (!isSembako) return false;
      }

      return true;
    }).sort((a, b) => {
      // 3. Kriteria Sort: Terlaris / Populer / Harga (Asc/Desc) / Nama (A-Z)
      if (sortBy === 'terlaris') {
        const aSold = a.item.soldCount || (a.item.isPopular ? 1500 : 200);
        const bSold = b.item.soldCount || (b.item.isPopular ? 1500 : 200);
        return bSold - aSold;
      }
      if (sortBy === 'populer') {
        const aScore = (a.item.isPopular ? 50 : 0) + ((a.item.rating || a.merchant.rating) * 100);
        const bScore = (b.item.isPopular ? 50 : 0) + ((b.item.rating || b.merchant.rating) * 100);
        return bScore - aScore;
      }
      if (sortBy === 'harga_asc') {
        return a.item.price - b.item.price;
      }
      if (sortBy === 'harga_desc') {
        return b.item.price - a.item.price;
      }
      if (sortBy === 'nama_asc') {
        return a.item.name.localeCompare(b.item.name, 'id');
      }
      return 0;
    });
  }, [allCatalogProducts, searchQuery, categoryFilter, sortBy]);

  return (
    <div className="space-y-2.5 pb-20">
      {/* 1. SLIM & COMPACT BRAND HEADER (Ringkas 1 Layar, Hemat Ruang, Logo AWD & Tombol Daftar) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white rounded-2xl p-2.5 sm:p-3 shadow-md border border-blue-500/30 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* AWD Official Logo Vektor Gambar */}
          <div className="relative shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-500 shadow-sm">
            <img
              src="/assets/aistudio/Designer_b056b7f0.png"
              alt="AWD Logo"
              className="w-full h-full object-contain rounded-full bg-white"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-black tracking-tight text-white leading-none">
                AWD <span className="text-sky-300 font-extrabold">Pelanggan</span>
              </span>
              <span className="px-1.5 py-0.2 rounded bg-sky-500/30 border border-sky-400/40 text-[9px] font-extrabold uppercase text-sky-200">
                Khusus Pelanggan
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-blue-100/90 truncate leading-tight mt-0.5">
              Pesan makanan warung, jajanan pasar & sembako Wong Nangun
            </p>
          </div>
        </div>

        {/* Quick Actions: Daftar Pelanggan & Saldo Dompet */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-bold text-white transition-colors"
            title="MitraPay Saldo"
          >
            <Wallet className="w-3.5 h-3.5 text-sky-300" />
            <span className="font-mono text-sky-200 hidden sm:inline">Rp{walletBalance.toLocaleString('id-ID')}</span>
          </button>

          <button
            onClick={() => openAuthModal('register')}
            className="flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-black text-[11px] sm:text-xs shadow-xs transition-transform active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            <span className="whitespace-nowrap">Daftar Pelanggan</span>
          </button>
        </div>
      </div>

      {/* 2. ACTIVE DELIVERY SLIM ALERT (Jika Ada Pengantaran Aktif) */}
      {activeOrder && activeOrder.status !== 'completed' && activeOrder.status !== 'cancelled' && (
        <div
          onClick={() => setIsTrackingModalOpen(true)}
          role="button"
          tabIndex={0}
          className="bg-blue-950/90 hover:bg-blue-950 text-white rounded-xl px-3 py-2 border border-blue-500/40 flex items-center justify-between gap-2 shadow-xs cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0" />
            <span className="font-bold text-sky-300 truncate">Kurir AWD Antar Pesanan:</span>
            <span className="font-medium text-slate-200 truncate">{activeOrder.merchantName}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-300 font-mono shrink-0 font-bold">
            <Clock className="w-3 h-3" />
            <span>~{activeOrder.etaMinutes}m</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </div>
        </div>
      )}

      {/* 3. SEARCH & CRITERIA BAR (Nama, Jenis, Harga, Terlaris, Populer) */}
      <div className="space-y-1.5 bg-white dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        {/* Pencarian Nama Input */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-blue-600 dark:text-sky-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari warung, nasi jamblang, tahu gejrot, seblak, es teh..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap px-1">
            <span className="font-mono text-blue-600 dark:text-sky-400 font-extrabold">{filteredProducts.length}</span> menu
          </div>
        </div>

        {/* Kriteria Urutkan (Terlaris / Populer / Harga Rendah / Harga Tinggi / Nama) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px] font-bold">
          <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0 tracking-wider mr-0.5">
            Urutkan:
          </span>

          <button
            onClick={() => setSortBy('terlaris')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap transition-colors shrink-0 ${
              sortBy === 'terlaris'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-300" />
            <span>Terlaris</span>
          </button>

          <button
            onClick={() => setSortBy('populer')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap transition-colors shrink-0 ${
              sortBy === 'populer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            <span>Populer</span>
          </button>

          <button
            onClick={() => setSortBy(sortBy === 'harga_asc' ? 'harga_desc' : 'harga_asc')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap transition-colors shrink-0 ${
              sortBy === 'harga_asc' || sortBy === 'harga_desc'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowDownUp className="w-3 h-3" />
            <span>Harga: {sortBy === 'harga_desc' ? 'Termahal' : 'Termurah'}</span>
          </button>

          <button
            onClick={() => setSortBy('nama_asc')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors shrink-0 ${
              sortBy === 'nama_asc'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Nama A-Z
          </button>
        </div>

        {/* Kriteria Jenis / Kategori (Semua, Warung Makan, Jajanan & Camilan, Minuman & Es, Khas Cirebon, Sembako) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-bold">
          <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0 tracking-wider mr-0.5">
            Jenis:
          </span>

          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 ${
              categoryFilter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
            }`}
          >
            Semua
          </button>

          <button
            onClick={() => setCategoryFilter('warung_makan')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 ${
              categoryFilter === 'warung_makan'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
            }`}
          >
            🍲 Warung Makan
          </button>

          <button
            onClick={() => setCategoryFilter('jajanan')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 ${
              categoryFilter === 'jajanan'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
            }`}
          >
            🍡 Jajanan & Camilan
          </button>

          <button
            onClick={() => setCategoryFilter('minuman')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 ${
              categoryFilter === 'minuman'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
            }`}
          >
            🥤 Minuman & Es
          </button>

          <button
            onClick={() => setCategoryFilter('cirebon')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 ${
              categoryFilter === 'cirebon'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
            }`}
          >
            🌶️ Khas Cirebon
          </button>

          <button
            onClick={() => setCategoryFilter('sembako')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 ${
              categoryFilter === 'sembako'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
            }`}
          >
            🛒 Sembako Warung
          </button>
        </div>
      </div>

      {/* 4. KATALOG UTAMA KERAPATAN SHOPEE (Hanya Gambar, Nama, dan Harga) */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            <span>Katalog Produk Warung & Jajanan</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">
            Kerapatan E-Commerce Shopee
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs sm:text-sm text-slate-500">
              Tidak ada produk yang cocok dengan pencarian "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setSortBy('terlaris');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        ) : (
          /* Grid Kerapatan Shopee: 2 kolom di mobile, 3 di sm, 4 di md, 5 di lg dengan gap rapat */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {filteredProducts.map(({ item, merchant }) => (
              <ShopeeProductCard
                key={`${merchant.id}-${item.id}`}
                item={item}
                merchant={merchant}
                onSelect={() => setSelectedMerchant(merchant)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
