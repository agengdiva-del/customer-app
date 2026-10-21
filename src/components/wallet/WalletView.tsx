import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  ArrowUpRight, 
  Send, 
  QrCode, 
  Sparkles, 
  CreditCard, 
  Clock, 
  ArrowDownLeft, 
  CheckCircle2, 
  X,
  ChevronRight,
  ShieldCheck,
  Gift
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const { 
    walletBalance, 
    walletTransactions, 
    topUpWallet, 
    transferWallet, 
    user, 
    showToast 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'in' | 'out'>('all');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(50000);
  const [topUpChannel, setTopUpChannel] = useState('BCA Virtual Account');
  const [transferPhone, setTransferPhone] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(20000);

  const filteredTransactions = walletTransactions.filter(tx => {
    if (activeFilter === 'in') return tx.amount > 0;
    if (activeFilter === 'out') return tx.amount < 0;
    return true;
  });

  const handleConfirmTopUp = () => {
    topUpWallet(topUpAmount, topUpChannel);
    setIsTopUpOpen(false);
  };

  const handleConfirmTransfer = () => {
    if (!transferPhone) {
      showToast('Masukkan nomor tujuan penerima');
      return;
    }
    const success = transferWallet(transferAmount, transferPhone);
    if (success) {
      setIsTransferOpen(false);
      setTransferPhone('');
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Wallet Card Header in Rich Blue Gradient */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-sky-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden border border-blue-400/30">
        {/* Background ambient pattern */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-sky-300/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-sm shadow-inner">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base block">MitraPay AWD</span>
              <span className="text-[10px] text-blue-100 block -mt-0.5">Dompet Digital Resmi Arjawinangun</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-mono">{user.points} Poin</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-blue-100 font-medium">Saldo Utama Aktif</span>
          <div className="text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-tight tabular-nums">
            Rp{walletBalance.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Quick Actions Strip */}
        <div className="grid grid-cols-3 gap-2.5 mt-6 pt-4 border-t border-white/20">
          <button
            onClick={() => setIsTopUpOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 transition-all active:scale-95 text-center"
          >
            <ArrowUpRight className="w-5 h-5 text-sky-200" />
            <span className="text-xs font-bold mt-1">Top Up</span>
          </button>

          <button
            onClick={() => setIsTransferOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 transition-all active:scale-95 text-center"
          >
            <Send className="w-5 h-5 text-sky-200" />
            <span className="text-xs font-bold mt-1">Transfer</span>
          </button>

          <button
            onClick={() => showToast('Scan QRIS Merchant MitraArja & AWD')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 transition-all active:scale-95 text-center"
          >
            <QrCode className="w-5 h-5 text-sky-200" />
            <span className="text-xs font-bold mt-1">Bayar QR</span>
          </button>
        </div>
      </div>

      {/* Loyalty & Rewards Perks */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-blue-100 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Program Reward MitraLoyal</span>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 font-bold px-2 py-0.5 rounded-full">
                Tier {user.loyaltyLevel.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Tiap transaksi Rp10.000 = 1 Poin. Tukar dengan voucher ongkir & cashback.
            </p>
          </div>
        </div>
        <button
          onClick={() => showToast('Katalog penukaran reward poin')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold shrink-0"
        >
          Tukar Poin
        </button>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Riwayat Transaksi MitraPay
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveFilter('in')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                activeFilter === 'in' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setActiveFilter('out')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                activeFilter === 'out' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Keluar
            </button>
          </div>
        </div>

        {/* List of Transactions */}
        <div className="space-y-2.5">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Belum ada riwayat transaksi pada filter ini.
            </div>
          ) : (
            filteredTransactions.map(tx => {
              const isPositive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 hover:bg-blue-50/30 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isPositive
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {tx.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{tx.date}</span>
                        <span>·</span>
                        <span className="font-mono text-[10px]">{tx.referenceId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-bold text-xs sm:text-sm tabular-nums ${
                        isPositive ? 'text-blue-600 dark:text-sky-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isPositive ? '+' : ''}Rp{Math.abs(tx.amount).toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-sky-400 font-semibold block">Berhasil</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Top Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-blue-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Top Up Saldo MitraPay
              </h3>
              <button onClick={() => setIsTopUpOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Nominal Buttons */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                Pilih Nominal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[20000, 50000, 100000, 200000, 500000, 1000000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold font-mono transition-all ${
                      topUpAmount === amt
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Rp{(amt / 1000).toFixed(0)}rb
                  </button>
                ))}
              </div>
            </div>

            {/* Channel Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                Metode Pembayaran Top Up
              </label>
              <select
                value={topUpChannel}
                onChange={(e) => setTopUpChannel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option>BCA Virtual Account (Otomatis)</option>
                <option>BRI Virtual Account</option>
                <option>Mandiri Virtual Account</option>
                <option>QRIS Instan (Semua Dompet)</option>
                <option>Alfamart / Indomaret Arjawinangun</option>
              </select>
            </div>

            <button
              onClick={handleConfirmTopUp}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all active:scale-95"
            >
              Konfirmasi Top Up Rp{topUpAmount.toLocaleString('id-ID')}
            </button>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-blue-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Transfer Sesama MitraPay
              </h3>
              <button onClick={() => setIsTransferOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                No. HP Penerima (Terdaftar MitraArja / AWD)
              </label>
              <input
                type="tel"
                value={transferPhone}
                onChange={(e) => setTransferPhone(e.target.value)}
                placeholder="Contoh: 081299887766"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Jumlah Transfer (Rp)
              </label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleConfirmTransfer}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all active:scale-95"
            >
              Kirim Saldo Rp{transferAmount.toLocaleString('id-ID')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
