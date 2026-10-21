import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_MERCHANTS, PHARMACY_IMAGE } from '../../data/mockData';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  ShieldCheck, 
  Plus, 
  AlertCircle, 
  Check, 
  X,
  Camera
} from 'lucide-react';
import { MenuItem } from '../../types';

export const PharmacyView: React.FC = () => {
  const { setActiveService, addToCart, showToast } = useApp();
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState('Budi Kurniawan');
  const [isVerifying, setIsVerifying] = useState(false);

  const pharmacyMerchant = INITIAL_MERCHANTS.find(m => m.type === 'pharmacy') || INITIAL_MERCHANTS[4];

  const handleSimulateUpload = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setPrescriptionFile('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80');
      setIsVerifying(false);
      showToast('Foto resep berhasil diunggah! Terdeteksi dr. Sp.A Cirebon.');
    }, 1200);
  };

  const handleConfirmPrescription = () => {
    if (!prescriptionFile) {
      showToast('Silakan unggah foto resep terlebih dahulu');
      return;
    }
    const rxItem = pharmacyMerchant.menu.find(m => m.needsPrescription) || pharmacyMerchant.menu[3];
    addToCart(pharmacyMerchant, rxItem, 1, `Resep Terverifikasi untuk Pasien: ${patientName}, Dokter: ${doctorName || 'dr. Sp.A'}`);
    setIsPrescriptionModalOpen(false);
    showToast('Obat resep telah ditambahkan ke keranjang');
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
            <span>AWD Health · Apotek Resmi</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Apotek Sehat Mandiri Arjawinangun (SIA/SIPA Resmi Kemenkes)
          </p>
        </div>
      </div>

      {/* Prescription Upload Callout Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-800 rounded-3xl p-4 sm:p-5 text-white shadow-lg border border-blue-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                TEBUS RESEP DOKTER · AWD
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
            </div>
            <h3 className="text-base sm:text-lg font-bold mt-1">
              Punya Resep dari Rumah Sakit / Klinik Arjawinangun?
            </h3>
            <p className="text-xs text-blue-100 mt-0.5 max-w-md">
              Unggah foto resep asli. Apoteker kami akan meninjau dosis dan menyiapkan obat bergaransi asli BPOM, diantar kurir AWD.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPrescriptionModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs sm:text-sm hover:bg-blue-50 transition-colors shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95"
        >
          <Upload className="w-4 h-4 text-blue-600" />
          <span>Upload Resep Dokter</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <span className="font-bold text-slate-900 dark:text-white block text-sm">100% Asli</span>
          <span className="text-[10px]">Langsung dari distributor resmi</span>
        </div>
        <div className="border-x border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-900 dark:text-white block text-sm">Apoteker Standby</span>
          <span className="text-[10px]">Konsultasi gratis via chat</span>
        </div>
        <div>
          <span className="font-bold text-slate-900 dark:text-white block text-sm">Privasi Terjaga</span>
          <span className="text-[10px]">Kemasan aman tanpa label isi</span>
        </div>
      </div>

      {/* Pharmacy Products Grid */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Obat Bebas, Vitamin & Suplemen Populer
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {pharmacyMerchant.menu.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
            >
              <div>
                <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {item.needsPrescription && (
                    <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow">
                      Wajib Resep
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-blue-600 dark:text-sky-400 font-bold block">
                  {item.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                  {item.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  Rp{item.price.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={() => {
                    if (item.needsPrescription) {
                      setIsPrescriptionModalOpen(true);
                    } else {
                      addToCart(pharmacyMerchant, item, 1);
                    }
                  }}
                  className={`p-1.5 px-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all ${
                    item.needsPrescription 
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden xs:inline">
                    {item.needsPrescription ? 'Resep' : 'Beli'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prescription Upload Modal */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-blue-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Unggah Resep Dokter
                </h3>
              </div>
              <button
                onClick={() => setIsPrescriptionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 p-3 rounded-xl flex items-start gap-2 text-xs text-blue-800 dark:text-blue-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Pastikan nama dokter, SIP, nama pasien, tanggal resep, dan tanda tangan dokter terlihat jelas tanpa terpotong.
              </span>
            </div>

            {/* Simulated File Upload Area */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors">
              {prescriptionFile ? (
                <div className="space-y-3">
                  <div className="relative w-36 h-36 mx-auto rounded-xl overflow-hidden border shadow">
                    <img src={prescriptionFile} alt="Resep" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPrescriptionFile(null)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600">
                    <Check className="w-4 h-4" />
                    <span>Foto Resep Siap Diverifikasi Apoteker</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 mx-auto flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">Klik untuk ambil foto</span> atau pilih file
                  </div>
                  <p className="text-[10px] text-slate-400">JPG, PNG, atau PDF maks 10MB</p>
                  <button
                    onClick={handleSimulateUpload}
                    disabled={isVerifying}
                    className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    {isVerifying ? 'Memindai Resep...' : 'Pilih Foto Resep (Simulasi)'}
                  </button>
                </div>
              )}
            </div>

            {/* Patient & Doctor Name Input */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Pasien
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Dokter / RS
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="dr. Anita Sp.A / RSUD"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                onClick={handleConfirmPrescription}
                disabled={!prescriptionFile}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Kirim Resep ke Apotek & Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
