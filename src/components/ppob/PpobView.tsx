import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Smartphone, 
  Zap, 
  Droplet, 
  Shield, 
  Wifi, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Star,
  Copy
} from 'lucide-react';

export const PpobView: React.FC = () => {
  const { setActiveService, walletBalance, topUpWallet, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'pulsa' | 'data' | 'pln' | 'pdam' | 'bpjs' | 'ewallet'>('pulsa');
  const [phoneNumber, setPhoneNumber] = useState('081234567890');
  const [selectedDenom, setSelectedDenom] = useState<number | null>(25000);
  const [meterNumber, setMeterNumber] = useState('3209 8812 4410');
  const [pdamNumber, setPdamNumber] = useState('1084 9281 002');
  const [lastToken, setLastToken] = useState<string | null>(null);

  const pulsaDenoms = [
    { nominal: 10000, price: 11000, desc: 'Masa aktif +7 hari' },
    { nominal: 25000, price: 26000, desc: 'Masa aktif +30 hari' },
    { nominal: 50000, price: 50500, desc: 'Promo hemat diskon Rp500' },
    { nominal: 100000, price: 99000, desc: 'Paling laris (Hemat Rp1.000)' },
  ];

  const dataPackages = [
    { name: 'Internet Max 10 GB', price: 38000, validity: '30 Hari', quota: '10 GB Utama 24 Jam' },
    { name: 'GigaMax 25 GB', price: 65000, validity: '30 Hari', quota: '25 GB + Disney+ Hotstar' },
    { name: 'Super Nonton 50 GB', price: 110000, validity: '30 Hari', quota: '50 GB All Network' },
  ];

  const plnDenoms = [
    { nominal: 20000, admin: 1500, total: 21500 },
    { nominal: 50000, admin: 1500, total: 51500 },
    { nominal: 100000, admin: 1500, total: 101500 },
    { nominal: 200000, admin: 1500, total: 201500 },
  ];

  const handleBuyPulsa = () => {
    if (!selectedDenom) return;
    if (walletBalance < selectedDenom) {
      showToast('Saldo MitraPay Anda tidak cukup');
      return;
    }
    topUpWallet(-selectedDenom, 'MitraPulsa Telkomsel');
    showToast(`Pulsa Rp${selectedDenom.toLocaleString('id-ID')} berhasil dikirim ke ${phoneNumber}!`);
  };

  const handleBuyPlnToken = () => {
    if (walletBalance < 21500) {
      showToast('Saldo MitraPay Anda tidak cukup');
      return;
    }
    const generatedToken = `${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}`;
    setLastToken(generatedToken);
    topUpWallet(-21500, 'Token Listrik PLN');
    showToast('Pembelian Token PLN 20k Sukses! Masukkan 20 digit ke meteran.');
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveService(null)}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>AWD Pulsa & Tagihan PPOB</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Isi pulsa, kuota, token PLN, PDAM Tirta Jati Cirebon & BPJS 24 Jam
          </p>
        </div>
      </div>

      {/* Service Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <button
          onClick={() => setActiveTab('pulsa')}
          className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
            activeTab === 'pulsa'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Smartphone className="w-5 h-5" />
          <span className="text-[11px] font-bold">Pulsa HP</span>
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
            activeTab === 'data'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Wifi className="w-5 h-5" />
          <span className="text-[11px] font-bold">Paket Data</span>
        </button>

        <button
          onClick={() => setActiveTab('pln')}
          className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
            activeTab === 'pln'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[11px] font-bold">Listrik PLN</span>
        </button>

        <button
          onClick={() => setActiveTab('pdam')}
          className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
            activeTab === 'pdam'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Droplet className="w-5 h-5" />
          <span className="text-[11px] font-bold">PDAM Cirebon</span>
        </button>

        <button
          onClick={() => setActiveTab('bpjs')}
          className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
            activeTab === 'bpjs'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[11px] font-bold">BPJS</span>
        </button>

        <button
          onClick={() => setActiveTab('ewallet')}
          className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
            activeTab === 'ewallet'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[11px] font-bold">E-Wallet</span>
        </button>
      </div>

      {/* Pulsa / Data Tab Content */}
      {(activeTab === 'pulsa' || activeTab === 'data') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Nomor Handphone</span>
              <span className="text-blue-600 dark:text-sky-400 flex items-center gap-1 cursor-pointer font-bold">
                <Star className="w-3.5 h-3.5" /> Nomor Favorit
              </span>
            </div>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-600">
                Telkomsel
              </span>
            </div>
          </div>

          {activeTab === 'pulsa' ? (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Pilih Nominal Pulsa
              </label>
              <div className="grid grid-cols-2 gap-3">
                {pulsaDenoms.map(d => (
                  <button
                    key={d.nominal}
                    onClick={() => setSelectedDenom(d.nominal)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedDenom === d.nominal
                        ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-slate-800 text-blue-900 dark:text-blue-300 ring-2 ring-blue-500/30 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-sm font-bold font-mono">
                      Rp{d.nominal.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                      Harga: Rp{d.price.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">{d.desc}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleBuyPulsa}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all active:scale-95"
              >
                Beli Pulsa Sekarang via MitraPay
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Pilih Paket Internet
              </label>
              <div className="space-y-2.5">
                {dataPackages.map(pkg => (
                  <div
                    key={pkg.name}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-blue-500 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {pkg.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{pkg.quota} · {pkg.validity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs sm:text-sm font-mono text-blue-600 dark:text-sky-400">
                        Rp{pkg.price.toLocaleString('id-ID')}
                      </div>
                      <button
                        onClick={() => {
                          topUpWallet(-pkg.price, `Paket ${pkg.name}`);
                          showToast(`Paket data ${pkg.name} berhasil diaktifkan!`);
                        }}
                        className="mt-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs"
                      >
                        Beli
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PLN Tab Content */}
      {activeTab === 'pln' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Nomor Meter / ID Pelanggan PLN
            </label>
            <input
              type="text"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white"
            />
            <span className="text-[11px] text-blue-600 dark:text-sky-400 mt-1 block font-medium">
              ✓ Pelanggan Terdaftar: BUDI KURNIAWAN (R1M / 1300 VA)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {plnDenoms.map(d => (
              <div
                key={d.nominal}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors"
              >
                <div className="text-sm font-bold font-mono">
                  Token Rp{d.nominal.toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-slate-500">Total: Rp{d.total.toLocaleString('id-ID')}</div>
                <button
                  onClick={handleBuyPlnToken}
                  className="mt-2 w-full py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xs"
                >
                  Beli Token
                </button>
              </div>
            ))}
          </div>

          {lastToken && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 text-center space-y-1">
              <span className="text-xs text-blue-800 dark:text-sky-300 font-bold block">
                KODE TOKEN LISTRIK ANDA (20 DIGIT):
              </span>
              <div className="text-base sm:text-lg font-mono font-extrabold text-slate-900 dark:text-white tracking-widest flex items-center justify-center gap-2">
                <span>{lastToken}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(lastToken);
                    showToast('Kode token berhasil disalin!');
                  }}
                  className="p-1 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500">Segera masukkan kode di atas pada meteran PLN rumah Anda.</p>
            </div>
          )}
        </div>
      )}

      {/* PDAM Tab Content */}
      {activeTab === 'pdam' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Wilayah PDAM
            </label>
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-xs text-slate-800 dark:text-slate-200">
              PDAM Tirta Jati - Kabupaten Cirebon (Cabang Arjawinangun)
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Nomor Sambungan / Pelanggan PDAM
            </label>
            <input
              type="text"
              value={pdamNumber}
              onChange={(e) => setPdamNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-slate-900 dark:text-white">
              <span>Nama: Budi Kurniawan</span>
              <span className="text-blue-600 font-mono">Oktober 2026</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Pemakaian Air: 18 m³</span>
              <span className="font-mono">Rp54.000</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Biaya Administrasi</span>
              <span className="font-mono">Rp2.500</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-blue-200 dark:border-blue-900">
              <span>Total Tagihan</span>
              <span className="font-mono text-blue-600 dark:text-sky-400 font-black">Rp56.500</span>
            </div>
          </div>

          <button
            onClick={() => {
              topUpWallet(-56500, 'Tagihan PDAM Tirta Jati');
              showToast('Tagihan PDAM Tirta Jati Rp56.500 LUNAS!');
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            Bayar Tagihan PDAM Sekarang (Rp56.500)
          </button>
        </div>
      )}

      {/* BPJS & E-Wallet info */}
      {(activeTab === 'bpjs' || activeTab === 'ewallet') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 text-center border border-blue-100 dark:border-slate-800 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-blue-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {activeTab === 'bpjs' ? 'Iuran BPJS Kesehatan Otomatis' : 'Top Up GoPay, OVO, DANA & ShopeePay'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Layanan PPOB resmi terhubung langsung ke biller nasional dengan biaya admin terendah se-Kabupaten Cirebon.
          </p>
          <button
            onClick={() => showToast('Fitur siap digunakan')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-sm"
          >
            Lanjutkan Proses
          </button>
        </div>
      )}
    </div>
  );
};
