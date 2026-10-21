import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Camera, Check, UploadCloud, AlertCircle } from 'lucide-react';

export const KycModal: React.FC = () => {
  const { isKycModalOpen, setIsKycModalOpen, submitKyc, user } = useApp();
  const [docType, setDocType] = useState<'ktp' | 'sim' | 'paspor'>('ktp');
  const [nikNumber, setNikNumber] = useState(user.kycDocNumber || '3209142805950002');
  const [ktpPhoto, setKtpPhoto] = useState<string | null>(
    user.verificationStatus === 'verified' ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400' : null
  );
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(
    user.verificationStatus === 'verified' ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' : null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isKycModalOpen) return null;

  const handleSimulateKtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setKtpPhoto('https://images.unsplash.com/photo-1544717305-2782549b5136?w=400');
      setIsProcessing(false);
    }, 1000);
  };

  const handleSimulateSelfie = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setSelfiePhoto('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400');
      setIsProcessing(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitKyc(docType, nikNumber);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-blue-100 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl p-0.5 bg-gradient-to-tr from-blue-700 via-sky-500 to-indigo-600 shadow-sm shrink-0">
              <img
                src="/assets/aistudio/Designer_b056b7f0.png"
                alt="AWD Logo"
                className="w-full h-full object-contain rounded-lg bg-white"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Verifikasi Identitas Resmi (KYC)</span>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </h3>
              <span className="text-[11px] text-slate-500">
                AWD · Arjawinangun Delivery
              </span>
            </div>
          </div>
          <button onClick={() => setIsKycModalOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-slate-800 p-3.5 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 text-blue-900 dark:text-sky-300">
            <span className="font-bold block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Keuntungan Verifikasi Akun AWD:
            </span>
            <ul className="list-disc list-inside mt-1.5 space-y-0.5 text-[11px] text-blue-800 dark:text-blue-200">
              <li>Batas saldo MitraPay meningkat hingga Rp20.000.000</li>
              <li>Dapat melakukan transfer uang ke rekening bank mana pun</li>
              <li>Bonus langsung +50 Poin MitraLoyal</li>
            </ul>
          </div>

          {/* Doc Type Selector */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Jenis Dokumen Identitas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['ktp', 'sim', 'paspor'] as const).map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setDocType(type)}
                  className={`py-2 rounded-xl uppercase font-bold text-center border transition-all ${
                    docType === type
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/50 dark:to-slate-800 text-blue-700 dark:text-sky-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Document Number */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Nomor NIK KTP (16 Digit)
            </label>
            <input
              type="text"
              value={nikNumber}
              onChange={(e) => setNikNumber(e.target.value)}
              placeholder="3209xxxxxxxxxxxx"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-900 dark:text-white"
            />
          </div>

          {/* Photos Upload Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* KTP Photo */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-center space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                1. Foto Fisik KTP Asli
              </span>
              {ktpPhoto ? (
                <div className="relative rounded-xl overflow-hidden h-24 border">
                  <img src={ktpPhoto} alt="KTP" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded p-0.5 text-[10px]">
                    ✓ Siap
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSimulateKtp}
                  className="w-full h-24 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px]">Ambil Foto KTP</span>
                </button>
              )}
            </div>

            {/* Selfie Photo */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-center space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                2. Selfie Bersama KTP
              </span>
              {selfiePhoto ? (
                <div className="relative rounded-xl overflow-hidden h-24 border">
                  <img src={selfiePhoto} alt="Selfie" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded p-0.5 text-[10px]">
                    ✓ Siap
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSimulateSelfie}
                  className="w-full h-24 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px]">Ambil Selfie</span>
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all active:scale-95"
          >
            {isProcessing ? 'Memproses Verifikasi AI...' : 'Kirim Verifikasi KYC Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
};
