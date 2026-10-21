import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Phone, 
  MessageCircle, 
  Navigation, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Store, 
  Bike, 
  User, 
  ShieldAlert,
  ArrowRight,
  RotateCw
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrderTrackingModal: React.FC = () => {
  const { 
    isTrackingModalOpen, 
    setIsTrackingModalOpen, 
    activeOrder, 
    advanceOrderStatus, 
    setIsChatModalOpen, 
    showToast 
  } = useApp();

  const [driverProgress, setDriverProgress] = useState(65); // 0 to 100% on route

  useEffect(() => {
    if (!isTrackingModalOpen || !activeOrder) return;
    const interval = setInterval(() => {
      setDriverProgress(prev => {
        if (prev >= 95) return 20; // loop simulation
        return prev + 5;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isTrackingModalOpen, activeOrder]);

  if (!isTrackingModalOpen || !activeOrder) return null;

  const statuses: { id: OrderStatus; label: string; desc: string }[] = [
    { id: 'pending', label: 'Menunggu Konfirmasi', desc: 'Pesanan dikirim ke merchant' },
    { id: 'merchant_accepted', label: 'Pesanan Diterima', desc: 'Merchant menerima order' },
    { id: 'driver_assigned', label: 'Driver AWD Ditugaskan', desc: 'Kurir menuju lokasi toko' },
    { id: 'preparing', label: 'Sedang Disiapkan', desc: 'Makanan dimasak / barang dikemas' },
    { id: 'picked_up', label: 'Pesanan Diambil', desc: 'Kurir AWD mengambil pesanan' },
    { id: 'on_delivery', label: 'Dalam Perjalanan', desc: 'Kurir AWD menuju rumahmu' },
    { id: 'delivered', label: 'Tiba di Tujuan', desc: 'Kurir sampai di alamat tujuan' },
    { id: 'completed', label: 'Selesai', desc: 'Pesanan telah diterima customer' },
  ];

  const currentStatusIndex = statuses.findIndex(s => s.id === activeOrder.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col border border-blue-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Live Tracking AWD</span>
                <span className="text-[10px] text-sky-500 font-extrabold uppercase bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                  Arjawinangun
                </span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                Order #{activeOrder.orderNumber}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsTrackingModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Interactive SVG Radar Route Map (Arjawinangun Hyperlocal Vector Map) with Blue Gradients */}
          <div className="relative h-56 sm:h-64 w-full bg-slate-950 overflow-hidden select-none">
            {/* Grid Lines Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20 stroke-blue-500" width="100%" height="100%">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Hyperlocal Roads in Arjawinangun (Stylized GPS Vectors) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 220" preserveAspectRatio="none">
              {/* Secondary Roads */}
              <path d="M 20 180 L 120 160 L 260 190 L 380 170" stroke="#1e293b" strokeWidth="4" fill="none" />
              <path d="M 120 20 L 120 200" stroke="#1e293b" strokeWidth="5" fill="none" />
              
              {/* Main Arterial Road (Jl. By Pass Arjawinangun) */}
              <path d="M 30 80 Q 150 120, 240 70 T 370 90" stroke="#0f172a" strokeWidth="12" fill="none" />
              <path d="M 30 80 Q 150 120, 240 70 T 370 90" stroke="#334155" strokeWidth="8" fill="none" />

              {/* Delivery Route Path in Bright Blue */}
              <path
                id="deliveryPath"
                d="M 60 80 L 130 95 L 210 135 L 310 110 L 340 140"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeDasharray="6 4"
                fill="none"
              />

              {/* Landmarks text */}
              <text x="50" y="65" fill="#93c5fd" fontSize="9" fontWeight="bold">WARUNG MANG DUL</text>
              <text x="140" y="150" fill="#64748b" fontSize="8">Jl. By Pass Arja</text>
              <text x="280" y="160" fill="#38bdf8" fontSize="9" fontWeight="bold">RUMAH (RAWAGATEL)</text>

              {/* Merchant Origin Marker */}
              <circle cx="60" cy="80" r="7" fill="#ef4444" />
              <circle cx="60" cy="80" r="14" fill="#ef4444" opacity="0.2" />

              {/* Destination Customer Marker */}
              <circle cx="340" cy="140" r="8" fill="#38bdf8" />
              <circle cx="340" cy="140" r="16" fill="#38bdf8" opacity="0.25" />

              {/* Animated Moving Driver Pin (Blue) */}
              <g transform={`translate(${60 + (driverProgress / 100) * 280}, ${80 + Math.sin(driverProgress / 15) * 30 + (driverProgress / 100) * 50})`}>
                <circle cx="0" cy="0" r="13" fill="#2563eb" className="animate-pulse" />
                <circle cx="0" cy="0" r="6" fill="#38bdf8" />
              </g>
            </svg>

            {/* Floating Live Telemetry Badge */}
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-500/40 text-white text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span className="font-mono text-sky-300 font-bold">GPS AWD Live</span>
              <span className="text-slate-400">· Speed: 32 km/h</span>
            </div>

            {/* ETA Overlay Pill */}
            <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-blue-800 text-white text-right">
              <div className="text-[10px] text-blue-200 font-medium uppercase">Estimasi Tiba</div>
              <div className="text-base sm:text-lg font-bold font-mono text-sky-400">
                ~{activeOrder.etaMinutes} Menit
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-5">
            {/* Driver Profile Card */}
            {activeOrder.driver && (
              <div className="bg-blue-50/40 dark:bg-slate-800/60 rounded-3xl p-4 border border-blue-100 dark:border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeOrder.driver.avatarUrl}
                      alt={activeOrder.driver.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-sm"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-bold px-1.5 rounded-full shadow">
                      ★ {activeOrder.driver.rating}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{activeOrder.driver.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({activeOrder.driver.totalTrips} trip)</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {activeOrder.driver.vehicleModel} · <strong className="text-slate-800 dark:text-slate-200">{activeOrder.driver.vehiclePlate}</strong>
                    </p>
                    <span className="text-[10px] text-blue-600 dark:text-sky-400 font-bold">
                      Kurir Resmi AWD (Arjawinangun Delivery)
                    </span>
                  </div>
                </div>

                {/* Driver Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsChatModalOpen(true);
                      showToast('Membuka chat dengan kurir...');
                    }}
                    className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white shadow-md shadow-blue-500/25 transition-transform active:scale-95"
                    title="Chat Driver"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Menghubungi ${activeOrder.driver?.name} (${activeOrder.driver?.phone})...`);
                    }}
                    className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white shadow-sm transition-transform active:scale-95"
                    title="Telepon Driver"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Status Progression */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status Pengantaran Terkini
                </h4>
                {/* Manual Advance Button for Reviewers / Evaluation */}
                <button
                  onClick={() => advanceOrderStatus(activeOrder.id)}
                  className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Simulasikan Status Selanjutnya</span>
                </button>
              </div>

              <div className="relative border-l-2 border-blue-500/30 ml-4 pl-4 space-y-4 text-xs">
                {statuses.map((s, index) => {
                  const isDone = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <div key={s.id} className="relative">
                      {/* Node circle */}
                      <span className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-500 ring-4 ring-blue-500/25'
                          : isDone
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                      }`} />

                      <div className="leading-tight">
                        <div className={`font-bold ${isCurrent ? 'text-blue-600 dark:text-sky-400 text-sm' : isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                          {s.label}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {s.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Rincian Barang yang Diantar:
              </span>
              {activeOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-mono tabular-nums">Rp{(it.price * it.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                <span>Total Biaya ({activeOrder.paymentMethod.toUpperCase()})</span>
                <span className="font-mono text-blue-600 dark:text-sky-400 font-black">
                  Rp{activeOrder.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
