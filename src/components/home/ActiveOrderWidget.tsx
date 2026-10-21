import React from 'react';
import { useApp } from '../../context/AppContext';
import { Navigation, MessageCircle, Clock, ChevronRight } from 'lucide-react';

export const ActiveOrderWidget: React.FC = () => {
  const { activeOrder, setIsTrackingModalOpen, setIsChatModalOpen } = useApp();

  if (!activeOrder || activeOrder.status === 'completed' || activeOrder.status === 'cancelled') {
    return null;
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'merchant_accepted': return 'Restoran menerima pesanan';
      case 'driver_assigned': return 'Driver AWD ditugaskan';
      case 'preparing': return 'Sedang dimasak / disiapkan';
      case 'picked_up': return 'Pesanan sudah diambil kurir AWD';
      case 'on_delivery': return 'Kurir AWD dalam perjalanan ke lokasimu';
      case 'delivered': return 'Pesanan tiba di tujuan';
      default: return 'Pesanan sedang diproses';
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-4 sm:p-5 shadow-xl border border-blue-500/40 overflow-hidden relative">
      {/* Decorative pulse glow */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
            PENGANTARAN AKTIF · AWD
          </span>
          <span className="text-xs text-slate-300 font-mono">
            {activeOrder.orderNumber}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
          <Clock className="w-3.5 h-3.5" />
          <span>ETA ~{activeOrder.etaMinutes} mnt</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
            {activeOrder.merchantName}
          </h4>
          <p className="text-xs text-sky-200 mt-0.5 font-medium flex items-center gap-1.5">
            <span>{getStatusText(activeOrder.status)}</span>
          </p>
          {activeOrder.driver && (
            <p className="text-[11px] text-slate-300 mt-1">
              Kurir AWD: <span className="text-white font-bold">{activeOrder.driver.name}</span> ({activeOrder.driver.vehiclePlate})
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsChatModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/10"
          >
            <MessageCircle className="w-3.5 h-3.5 text-sky-300" />
            <span>Chat Kurir</span>
          </button>
          <button
            onClick={() => setIsTrackingModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition-all active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Lacak Live Map</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
