import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { 
  Receipt, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Navigation, 
  Download, 
  Star, 
  RotateCw, 
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const { orders, setActiveOrder, setIsTrackingModalOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [starRating, setStarRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'active') {
      return o.status !== 'completed' && o.status !== 'cancelled';
    }
    if (activeTab === 'completed') {
      return o.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return o.status === 'cancelled';
    }
    return true;
  });

  const handleDownloadInvoice = (order: Order) => {
    showToast(`Invoice #${order.orderNumber} sedang diunduh (PDF)...`);
  };

  const handleSaveReview = () => {
    showToast(`Ulasan bintang ${starRating} berhasil dikirim! Terima kasih.`);
    setReviewOrder(null);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header & Tabs */}
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
          Riwayat Pesanan AWD
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Pantau pesanan aktif & arsip transaksi pengiriman
        </p>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'active'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-sky-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Aktif ({orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'completed'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-sky-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Selesai
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'cancelled'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-sky-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Dibatalkan
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5]" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Tidak ada pesanan di kategori ini
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Pesanan kuliner, belanja mart, atau kirim barang AWD akan otomatis muncul di sini.
            </p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {order.orderNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">· {order.createdAt.slice(0, 10)}</span>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                  order.status === 'completed'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-sky-300'
                    : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>

              {/* Order Body Details */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {order.merchantName}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 space-y-0.5">
                    {order.items.slice(0, 2).map((it, idx) => (
                      <div key={idx}>
                        {it.quantity}x {it.name}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-[11px] text-slate-400">
                        +{order.items.length - 2} item lainnya...
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Belanja</span>
                  <span className="text-sm font-bold font-mono text-blue-600 dark:text-sky-400">
                    Rp{order.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedOrderDetails(order)}
                  className="text-xs text-slate-600 dark:text-slate-400 font-semibold hover:underline"
                >
                  Detail Nota
                </button>

                <div className="flex items-center gap-2">
                  {order.status !== 'completed' && order.status !== 'cancelled' ? (
                    <button
                      onClick={() => {
                        setActiveOrder(order);
                        setIsTrackingModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-500/25"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Lacak Live</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                        title="Unduh Invoice PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setReviewOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Beri Ulasan</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-blue-100 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Nota Pesanan AWD
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  {selectedOrderDetails.orderNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Toko / Merchant:</span>
                <span className="text-slate-600 dark:text-slate-400">{selectedOrderDetails.merchantName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Tujuan Pengiriman:</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {selectedOrderDetails.destinationAddress.recipientName} ({selectedOrderDetails.destinationAddress.phone})
                  <br />
                  {selectedOrderDetails.destinationAddress.streetAddress}, {selectedOrderDetails.destinationAddress.village}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Rincian Item:</span>
                {selectedOrderDetails.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-mono">Rp{(it.price * it.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-slate-500">
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span className="font-mono">Rp{selectedOrderDetails.deliveryFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Layanan</span>
                  <span className="font-mono">Rp{selectedOrderDetails.platformFee.toLocaleString('id-ID')}</span>
                </div>
                {selectedOrderDetails.voucherDiscount > 0 && (
                  <div className="flex justify-between text-blue-600 font-semibold">
                    <span>Diskon Kupon</span>
                    <span className="font-mono">-Rp{selectedOrderDetails.voucherDiscount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Bayar ({selectedOrderDetails.paymentMethod.toUpperCase()})</span>
                  <span className="text-blue-600 dark:text-sky-400 font-mono font-black">
                    Rp{selectedOrderDetails.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDownloadInvoice(selectedOrderDetails)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Struk / Invoice (PDF)</span>
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-blue-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Beri Ulasan & Nilai
              </h3>
              <button onClick={() => setReviewOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2 py-2">
              <span className="text-xs text-slate-500">Bagaimana pesanan Anda di {reviewOrder.merchantName}?</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-7 h-7 ${star <= starRating ? 'fill-amber-400' : 'text-slate-300 stroke-[1.5]'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Komentar / Masukan
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Makanannya sangat lezat, kurir AWD tepat waktu & ramah!"
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSaveReview}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all active:scale-95"
            >
              Kirim Ulasan & Dapatkan +10 Poin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
