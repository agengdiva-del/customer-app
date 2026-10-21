import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Receipt, 
  Wallet, 
  Bell, 
  User as UserIcon, 
  ShoppingBag, 
  ArrowRight 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cart, 
    cartTotal, 
    setIsCartOpen, 
    unreadNotifCount,
    setActiveService 
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Floating Cart Pill if Cart is Not Empty */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-16 sm:bottom-20 left-0 right-0 z-30 px-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white p-3.5 rounded-2xl shadow-xl shadow-blue-900/30 flex items-center justify-between gap-3 transition-transform active:scale-[0.99] border border-blue-400/30"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-xs">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-bold tracking-tight">
                    {totalCartCount} item di keranjang
                  </div>
                  <div className="text-[11px] text-blue-100 font-mono tabular-nums">
                    Rp{cartTotal.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white text-blue-700 text-xs font-bold py-1.5 px-3 rounded-xl shadow-sm">
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1.5 px-2 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-items-center">
          {/* Home */}
          <button
            onClick={() => {
              setActiveTab('home');
              setActiveService(null);
            }}
            className={`flex flex-col items-center justify-center w-full py-1 min-h-[48px] rounded-xl transition-all ${
              activeTab === 'home' 
                ? 'text-blue-600 dark:text-sky-400 font-bold scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'home' ? 'bg-blue-50 dark:bg-blue-950/60' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Beranda</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center justify-center w-full py-1 min-h-[48px] rounded-xl transition-all ${
              activeTab === 'orders' 
                ? 'text-blue-600 dark:text-sky-400 font-bold scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'orders' ? 'bg-blue-50 dark:bg-blue-950/60' : ''}`}>
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Pesanan</span>
          </button>

          {/* Wallet */}
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center justify-center w-full py-1 min-h-[48px] rounded-xl transition-all ${
              activeTab === 'wallet' 
                ? 'text-blue-600 dark:text-sky-400 font-bold scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'wallet' ? 'bg-blue-50 dark:bg-blue-950/60' : ''}`}>
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">MitraPay</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`relative flex flex-col items-center justify-center w-full py-1 min-h-[48px] rounded-xl transition-all ${
              activeTab === 'notifications' 
                ? 'text-blue-600 dark:text-sky-400 font-bold scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl relative ${activeTab === 'notifications' ? 'bg-blue-50 dark:bg-blue-950/60' : ''}`}>
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-sky-500 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Aktivitas</span>
          </button>

          {/* Account */}
          <button
            onClick={() => setActiveTab('account')}
            className={`flex flex-col items-center justify-center w-full py-1 min-h-[48px] rounded-xl transition-all ${
              activeTab === 'account' 
                ? 'text-blue-600 dark:text-sky-400 font-bold scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'account' ? 'bg-blue-50 dark:bg-blue-950/60' : ''}`}>
              <UserIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Akun</span>
          </button>
        </div>
      </nav>
    </>
  );
};
