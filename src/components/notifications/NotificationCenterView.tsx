import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Tag, 
  CheckCircle2, 
  Clock, 
  ShoppingBag, 
  CreditCard, 
  CheckCheck,
  Navigation
} from 'lucide-react';

export const NotificationCenterView: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    setIsTrackingModalOpen, 
    setActiveTab,
    showToast 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'order' | 'promo' | 'payment'>('all');

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case 'promo': return <Tag className="w-4 h-4 text-sky-500" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-indigo-600" />;
      default: return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Notifikasi & Aktivitas AWD
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pemberitahuan terkini seputar pesanan, promo & saldo MitraPay
          </p>
        </div>
        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Tandai Dibaca</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
        {(['all', 'order', 'promo', 'payment'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeFilter === tab
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {tab === 'all' && 'Semua'}
            {tab === 'order' && 'Pesanan'}
            {tab === 'promo' && 'Promo & Voucher'}
            {tab === 'payment' && 'Pembayaran'}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            Tidak ada notifikasi di kategori ini.
          </div>
        ) : (
          filteredNotifs.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.type === 'order') {
                  setIsTrackingModalOpen(true);
                } else if (notif.type === 'payment') {
                  setActiveTab('wallet');
                }
              }}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.isRead
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
                  : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>
                {notif.orderId && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-sky-400">
                    <Navigation className="w-3 h-3" />
                    <span>Lacak Pengiriman Pesanan &rarr;</span>
                  </div>
                )}
              </div>
              {!notif.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
