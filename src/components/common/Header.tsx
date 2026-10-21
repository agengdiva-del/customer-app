import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  ChevronDown, 
  Wallet, 
  Bell, 
  Moon, 
  Sun, 
  Smartphone, 
  Monitor, 
  Database,
  Plus
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    selectedAddress, 
    addresses, 
    setSelectedAddress, 
    walletBalance, 
    unreadNotifCount, 
    setActiveTab, 
    isDarkMode, 
    toggleDarkMode, 
    isMobileFrame, 
    toggleMobileFrame,
    setIsEnterpriseHubOpen,
    setActiveService
  } = useApp();

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-blue-100 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Location */}
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={() => {
              setActiveTab('home');
              setActiveService(null);
            }} 
            className="flex items-center gap-2 focus:outline-none shrink-0 group text-left"
          >
            {/* New Official AWD Logo Image */}
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-blue-700 via-sky-500 to-indigo-600 shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <img
                src="/assets/aistudio/Designer_b056b7f0.png"
                alt="AWD - Arjawinangun Delivery Logo"
                className="w-full h-full object-contain rounded-xl bg-white"
              />
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-extrabold text-slate-900 dark:text-white tracking-tight text-lg leading-none flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent font-black tracking-tighter text-xl">
                  AWD
                </span>
                <span className="text-slate-800 dark:text-slate-200 text-sm font-bold">
                  Mitra<span className="text-blue-600">Arja</span>
                </span>
              </div>
              <span className="text-[10px] text-blue-600 dark:text-sky-400 block tracking-wider font-bold uppercase mt-0.5">
                Arjawinangun Delivery · By Wong Nangun
              </span>
            </div>
          </button>

          {/* Location Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-sky-50/50 hover:from-blue-100 hover:to-sky-100 dark:from-slate-800 dark:to-slate-800/80 dark:hover:from-slate-700 border border-blue-200/50 dark:border-slate-700 transition-colors text-left text-xs max-w-[170px] sm:max-w-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate leading-tight">
                  {selectedAddress?.label || 'Alamat'}: {selectedAddress?.village || 'Arjawinangun'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                  {selectedAddress?.streetAddress || 'Arjawinangun, Cirebon'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
            </button>

            {/* Address Switcher Dropdown */}
            {isLocationDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-800 py-1.5 z-40 text-xs">
                <div className="px-3 py-1.5 font-bold text-blue-600 dark:text-sky-400 border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                  PILIH ALAMAT PENGANTARAN
                </div>
                {addresses.map(addr => (
                  <button
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setIsLocationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-blue-50/60 dark:hover:bg-slate-800/60 transition-colors ${
                      selectedAddress.id === addr.id 
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-600" />
                    <div className="min-w-0">
                      <div className="font-semibold text-xs flex items-center gap-1.5">
                        {addr.label}
                        {addr.isDefault && (
                          <span className="text-[9px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1 py-0.2 rounded font-normal">
                            Utama
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {addr.streetAddress}, {addr.village}
                      </div>
                    </div>
                  </button>
                ))}
                <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => {
                      setIsLocationDropdownOpen(false);
                      setActiveTab('account');
                    }}
                    className="w-full py-1.5 px-3 rounded-xl border border-dashed border-blue-500 text-blue-600 dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-center font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Tambah Alamat Baru
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Wallet, DB Hub, Theme, Frame Toggle, Notifs */}
        <div className="flex items-center gap-2">
          {/* MitraPay Balance Chip (Blue Gradient) */}
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 text-white shadow-sm shadow-blue-500/20 hover:opacity-95 transition-all"
            title="Buka Dompet MitraPay"
          >
            <Wallet className="w-3.5 h-3.5 shrink-0" />
            <div className="text-left leading-tight hidden xs:block">
              <span className="text-[9px] uppercase font-bold text-blue-100 block -mb-0.5 tracking-wider">MitraPay</span>
              <span className="text-xs font-bold font-mono tabular-nums">
                Rp{walletBalance.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-xs font-bold font-mono tabular-nums xs:hidden">
              Rp{(walletBalance / 1000).toFixed(0)}rb
            </span>
          </button>

          {/* Enterprise Schema Hub Button */}
          <button
            onClick={() => setIsEnterpriseHubOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors"
            title="Lihat Supabase Database Schema & Arsitektur Flutter"
          >
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>Supabase & Flutter</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Mobile Simulator Frame Toggle */}
          <button
            onClick={toggleMobileFrame}
            className={`p-2 rounded-xl transition-colors hidden md:flex items-center justify-center ${
              isMobileFrame 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isMobileFrame ? 'Tampilan Responsif Penuh' : 'Tampilan Bingkai Ponsel (Simulator)'}
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
