import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VOUCHERS_LIST } from '../../data/mockData';
import { PaymentMethod } from '../../types';
import { 
  X, 
  MapPin, 
  Bike, 
  Wallet, 
  QrCode, 
  CreditCard, 
  Banknote, 
  Tag, 
  ShieldCheck, 
  Check, 
  Copy,
  Clock
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    cartMerchant, 
    selectedAddress, 
    addresses, 
    setSelectedAddress, 
    walletBalance, 
    createOrder, 
    showToast 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mitrapay');
  const [courierService, setCourierService] = useState<'instan' | 'sameday' | 'hemat'>('instan');
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string>('ARJAGRATIS');
  const [orderNotes, setOrderNotes] = useState('');
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [showQrisCode, setShowQrisCode] = useState(false);
  const [selectedBank, setSelectedBank] = useState<'BCA' | 'BRI' | 'Mandiri'>('BCA');

  if (!isCheckoutOpen) return null;

  const baseDelivery = cartMerchant?.deliveryFee || 6000;
  const courierMultiplier = courierService === 'instan' ? 1 : courierService === 'sameday' ? 0.8 : 0.6;
  const deliveryFee = Math.round(baseDelivery * courierMultiplier);
  const platformFee = 2000;

  const activeVoucher = VOUCHERS_LIST.find(v => v.code === selectedVoucherCode);
  const voucherDiscount = activeVoucher ? activeVoucher.discountAmount : 0;
  const grandTotal = Math.max(0, cartTotal + deliveryFee + platformFee - voucherDiscount);

  const handlePlaceOrder = () => {
    if (paymentMethod === 'mitrapay' && walletBalance < grandTotal) {
      showToast('Saldo MitraPay kurang. Silakan Top Up atau pilih metode lain seperti QRIS / COD.');
      return;
    }

    try {
      createOrder(paymentMethod, voucherDiscount, orderNotes);
    } catch (e) {
      // Error handled inside createOrder
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-blue-100 dark:border-slate-800 animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Konfirmasi & Pembayaran · AWD
            </h3>
            <span className="text-xs text-slate-500">
              {cartMerchant?.name} · {cart.reduce((s, i) => s + i.quantity, 0)} Item
            </span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Address Card */}
          <div className="bg-blue-50/40 dark:bg-slate-800/60 rounded-2xl p-4 border border-blue-100 dark:border-slate-700/70">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-blue-900 dark:text-sky-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Alamat Pengiriman
              </span>
              <button
                onClick={() => setIsChangingAddress(!isChangingAddress)}
                className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline"
              >
                {isChangingAddress ? 'Tutup' : 'Ganti Alamat'}
              </button>
            </div>

            <div className="text-xs">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{selectedAddress.recipientName} ({selectedAddress.label})</span>
                <span className="font-normal text-slate-400">· {selectedAddress.phone}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                {selectedAddress.streetAddress}, Desa {selectedAddress.village}, Kec. {selectedAddress.district}, {selectedAddress.city}
              </p>
              {selectedAddress.notes && (
                <p className="text-[11px] text-blue-600 dark:text-sky-400 italic mt-0.5">
                  Catatan: {selectedAddress.notes}
                </p>
              )}
            </div>

            {/* Address Switcher Accordion */}
            {isChangingAddress && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                {addresses.map(a => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setSelectedAddress(a);
                      setIsChangingAddress(false);
                      showToast(`Alamat diubah ke: ${a.label}`);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                      selectedAddress.id === a.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold">{a.label} - {a.recipientName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{a.streetAddress}, {a.village}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Courier Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
              <Bike className="w-4 h-4 text-blue-600" />
              Pilih Layanan Pengantaran Kurir AWD
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setCourierService('instan')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  courierService === 'instan'
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-slate-800 text-blue-950 dark:text-blue-200 font-bold ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div>AWD Instan</div>
                <div className="text-[10px] text-blue-600 dark:text-sky-400 font-normal">15-20 mnt</div>
                <div className="font-mono mt-1 font-bold">Rp{baseDelivery.toLocaleString('id-ID')}</div>
              </button>

              <button
                onClick={() => setCourierService('sameday')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  courierService === 'sameday'
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-slate-800 text-blue-950 dark:text-blue-200 font-bold ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div>Sameday</div>
                <div className="text-[10px] text-slate-400 font-normal">1-2 jam</div>
                <div className="font-mono mt-1 font-bold">Rp{Math.round(baseDelivery * 0.8).toLocaleString('id-ID')}</div>
              </button>

              <button
                onClick={() => setCourierService('hemat')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  courierService === 'hemat'
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-slate-800 text-blue-950 dark:text-blue-200 font-bold ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div>Hemat</div>
                <div className="text-[10px] text-slate-400 font-normal">Gabungan</div>
                <div className="font-mono mt-1 font-bold">Rp{Math.round(baseDelivery * 0.6).toLocaleString('id-ID')}</div>
              </button>
            </div>
          </div>

          {/* Voucher Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-blue-600" />
              Kupon & Diskon Promo
            </label>
            <div className="flex gap-2">
              <select
                value={selectedVoucherCode}
                onChange={(e) => setSelectedVoucherCode(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="">Tanpa Voucher</option>
                {VOUCHERS_LIST.map(v => (
                  <option key={v.code} value={v.code}>
                    {v.code} - {v.title} ({v.discount})
                  </option>
                ))}
              </select>
              {activeVoucher && (
                <span className="px-2.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 font-mono text-xs font-bold flex items-center shrink-0">
                  -Rp{activeVoucher.discountAmount.toLocaleString('id-ID')}
                </span>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Metode Pembayaran
            </label>

            <div className="space-y-2">
              {/* MitraPay Option */}
              <label
                onClick={() => setPaymentMethod('mitrapay')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'mitrapay'
                    ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-slate-800 text-blue-950 dark:text-blue-200 ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>MitraPay Wallet</span>
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-semibold px-1 rounded">Instan</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Saldo: Rp{walletBalance.toLocaleString('id-ID')}
                      {walletBalance < grandTotal && (
                        <span className="text-red-500 ml-1 font-semibold">(Kurang)</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'mitrapay' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'mitrapay' && <Check className="w-3 h-3" />}
                </div>
              </label>

              {/* QRIS Option */}
              <label
                onClick={() => {
                  setPaymentMethod('qris');
                  setShowQrisCode(true);
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'qris'
                    ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-slate-800 text-blue-950 dark:text-blue-200 ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">QRIS Nasional (Semua Bank & E-Wallet)</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      BCA, BRI, Mandiri, GoPay, OVO, ShopeePay, DANA
                    </div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'qris' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'qris' && <Check className="w-3 h-3" />}
                </div>
              </label>

              {/* Bank Transfer VA Option */}
              <label
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-slate-800 text-blue-950 dark:text-blue-200 ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Virtual Account (Otomatis)</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      BCA, BRI, Bank Mandiri
                    </div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'bank_transfer' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'bank_transfer' && <Check className="w-3 h-3" />}
                </div>
              </label>

              {/* COD Option */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-slate-800 text-blue-950 dark:text-blue-200 ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">COD (Bayar Tunai ke Kurir AWD)</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Bayar langsung saat barang tiba di rumah
                    </div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'cod' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'cod' && <Check className="w-3 h-3" />}
                </div>
              </label>
            </div>

            {/* QRIS Interactive Code Card */}
            {paymentMethod === 'qris' && showQrisCode && (
              <div className="mt-3 p-4 bg-slate-900 text-white rounded-2xl text-center space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold tracking-wider">QRIS STANDAR PEMBAYARAN NASIONAL</span>
                  <span className="text-sky-400 font-mono">14:59</span>
                </div>
                {/* SVG Simulated QRIS graphic */}
                <div className="w-44 h-44 mx-auto bg-white p-2.5 rounded-xl shadow-lg flex flex-col items-center justify-center">
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M10 10h30v30h-30z M15 15v20h20v-20z M20 20h10v10h-10z" />
                    <path d="M60 10h30v30h-30z M65 15v20h20v-20z M70 20h10v10h-10z" />
                    <path d="M10 60h30v30h-30z M15 65v20h20v-20z M20 70h10v10h-10z" />
                    <rect x="45" y="15" width="10" height="10" />
                    <rect x="45" y="30" width="5" height="15" />
                    <rect x="55" y="45" width="10" height="10" />
                    <rect x="15" y="45" width="10" height="10" />
                    <rect x="30" y="45" width="10" height="10" />
                    <rect x="45" y="60" width="15" height="10" />
                    <rect x="65" y="60" width="10" height="25" />
                    <rect x="80" y="70" width="10" height="15" />
                  </svg>
                </div>
                <div className="text-xs text-slate-300">
                  NMID: <span className="font-mono font-bold text-white">ID1020261948201</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Buka aplikasi mobile banking atau e-wallet Anda, pilih menu Scan QRIS, lalu arahkan ke kode di atas.
                </p>
              </div>
            )}

            {/* Bank Transfer VA Card */}
            {paymentMethod === 'bank_transfer' && (
              <div className="mt-3 p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2">
                  {(['BCA', 'BRI', 'Mandiri'] as const).map(b => (
                    <button
                      key={b}
                      onClick={() => setSelectedBank(b)}
                      className={`px-3 py-1 rounded-lg font-bold ${
                        selectedBank === b ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Nomor Virtual Account {selectedBank}:</span>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      8801 0812 3456 7890
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('8801081234567890');
                      showToast('Nomor VA berhasil disalin!');
                    }}
                    className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> Salin
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notes for Driver / Merchant */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Catatan Pengantaran Kurir AWD (Opsional)
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Contoh: Belokan dekat kantor pos Arjawinangun..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Price Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/70">
            <div className="flex justify-between">
              <span>Subtotal Menu</span>
              <span className="font-mono">Rp{cartTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim ({courierService.toUpperCase()})</span>
              <span className="font-mono">Rp{deliveryFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Layanan Aplikasi</span>
              <span className="font-mono">Rp{platformFee.toLocaleString('id-ID')}</span>
            </div>
            {voucherDiscount > 0 && (
              <div className="flex justify-between text-blue-600 font-semibold">
                <span>Diskon Kupon Promo</span>
                <span className="font-mono">-Rp{voucherDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>Total Pembayaran</span>
              <span className="text-blue-600 dark:text-sky-400 font-mono text-base font-black">
                Rp{grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <button
            onClick={handlePlaceOrder}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pesan Sekarang · Rp{grandTotal.toLocaleString('id-ID')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
