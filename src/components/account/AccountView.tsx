import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Award, 
  Users, 
  Lock, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Copy, 
  Plus, 
  Trash2, 
  Check, 
  X,
  Sparkles,
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import { Address } from '../../types';

export const AccountView: React.FC = () => {
  const { 
    user, 
    addresses, 
    addAddress, 
    deleteAddress, 
    setIsKycModalOpen, 
    logoutUser, 
    tickets, 
    createTicket, 
    updateUserProfile,
    showToast 
  } = useApp();

  // Address modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState<'Rumah' | 'Kantor' | 'Kost' | 'Lainnya'>('Rumah');
  const [newRecipient, setNewRecipient] = useState(user.name);
  const [newPhone, setNewPhone] = useState(user.phone);
  const [newStreet, setNewStreet] = useState('');
  const [newVillage, setNewVillage] = useState('Jungjang');
  const [newNotes, setNewNotes] = useState('');

  // Complaint modal state
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState<any>('Masalah Pesanan');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');

  // Security state
  const [is2FaEnabled, setIs2FaEnabled] = useState(user.twoFactorEnabled);

  const handleToggle2Fa = () => {
    const nextState = !is2FaEnabled;
    setIs2FaEnabled(nextState);
    updateUserProfile({ twoFactorEnabled: nextState });
    showToast(`Autentikasi Dua Faktor (2FA) ${nextState ? 'Diaktifkan' : 'Dinonaktifkan'}`);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet) {
      showToast('Masukkan alamat jalan lengkap');
      return;
    }
    addAddress({
      label: newLabel,
      recipientName: newRecipient,
      phone: newPhone,
      streetAddress: newStreet,
      village: newVillage,
      district: 'Arjawinangun',
      city: 'Kabupaten Cirebon',
      province: 'Jawa Barat',
      postalCode: '45162',
      latitude: -6.6432,
      longitude: 108.4125,
      notes: newNotes,
      isDefault: false,
    });
    setIsAddressModalOpen(false);
    setNewStreet('');
  };

  const handleFileComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle || !complaintDesc) {
      showToast('Harap lengkapi judul dan deskripsi aduan');
      return;
    }
    createTicket(complaintCategory, complaintTitle, complaintDesc);
    setIsComplaintModalOpen(false);
    setComplaintTitle('');
    setComplaintDesc('');
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-blue-100 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
            />
            {user.verificationStatus === 'verified' && (
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-1 shadow" title="Akun Terverifikasi">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{user.name}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {user.phone} · {user.email}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                user.verificationStatus === 'verified'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-sky-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {user.verificationStatus === 'verified' ? '✓ Terverifikasi KYC' : 'Belum Verifikasi'}
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                Tier {user.loyaltyLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsKycModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl border border-blue-600 text-blue-600 dark:text-sky-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/40 shrink-0 transition-colors"
        >
          {user.verificationStatus === 'verified' ? 'Detail KYC' : 'Verifikasi'}
        </button>
      </div>

      {/* Loyalty & Points Progress with Blue Gradient */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-5 shadow-lg border border-blue-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">MitraLoyal Level: {user.loyaltyLevel.toUpperCase()}</span>
          </div>
          <span className="font-mono text-xs text-sky-300 font-bold">
            {user.points} / 1.000 Poin Menuju Gold
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 h-full w-[48%]" />
        </div>
        <p className="text-[11px] text-blue-200">
          Belanja Rp10.000 per transaksi di MitraArja / AWD = dapat 1 Poin. Naikkan ke Gold untuk gratis ongkir seumur hidup!
        </p>
      </div>

      {/* Referral Program Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Ajak Teman & Dapatkan 100 Poin
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-medium">{user.referralCount} Teman Bergabung</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Bagikan kode referal unik Anda kepada keluarga dan teman di Arjawinangun untuk menikmati bonus kupon AWD.
        </p>
        <div className="flex items-center gap-2 bg-blue-50/50 dark:bg-slate-800 p-3 rounded-2xl border border-blue-100 dark:border-slate-700">
          <span className="text-xs text-slate-500 font-bold">KODE REFERAL:</span>
          <span className="font-mono font-black text-sm text-blue-600 dark:text-sky-400 tracking-wider">
            {user.referralCode}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(user.referralCode);
              showToast('Kode referal berhasil disalin!');
            }}
            className="ml-auto text-xs font-bold text-blue-600 dark:text-sky-400 hover:text-blue-700 flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Salin
          </button>
        </div>
      </div>

      {/* Address Management Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Daftar Alamat Tersimpan</span>
          </h4>
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Alamat
          </button>
        </div>

        <div className="space-y-2">
          {addresses.map(addr => (
            <div
              key={addr.id}
              className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 font-semibold px-2 py-0.5 rounded-full">
                      Utama
                    </span>
                  )}
                </div>
                <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                  {addr.streetAddress}, Desa {addr.village}, Kec. {addr.district}
                </div>
                <div className="text-slate-400 text-[10px] mt-0.5">
                  Penerima: {addr.recipientName} ({addr.phone})
                </div>
              </div>
              <button
                onClick={() => deleteAddress(addr.id)}
                className="text-slate-400 hover:text-red-500 p-1"
                title="Hapus Alamat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security & 2FA */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600" />
          <span>Keamanan & Autentikasi Akun</span>
        </h4>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Autentikasi Dua Faktor (2FA)
              </span>
              <span className="text-slate-500 text-[11px]">
                Kode OTP via WhatsApp setiap kali login dari perangkat baru
              </span>
            </div>
            <button
              onClick={handleToggle2Fa}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                is2FaEnabled ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  is2FaEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Perangkat Aktif
              </span>
              <span className="text-slate-500 text-[11px]">
                Chrome di Linux / Android (Arjawinangun) · Sesi Aktif
              </span>
            </div>
            <button
              onClick={() => showToast('Semua perangkat lain telah dikeluarkan')}
              className="text-xs text-red-500 font-semibold hover:underline"
            >
              Logout Semua
            </button>
          </div>
        </div>
      </div>

      {/* Help & Complaints Support Tickets */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Pusat Bantuan & Komplain AWD
            </h4>
          </div>
          <button
            onClick={() => setIsComplaintModalOpen(true)}
            className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline"
          >
            + Buat Pengaduan
          </button>
        </div>

        <div className="space-y-2">
          {tickets.map(tkt => (
            <div
              key={tkt.id}
              className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">
                  {tkt.title}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                  tkt.status === 'resolved'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-sky-300'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {tkt.status}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">{tkt.description}</p>
              {tkt.resolutionNote && (
                <div className="mt-1 text-[11px] text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl">
                  Solusi CS: {tkt.resolutionNote}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account Rules Notice */}
      <div className="p-4 rounded-3xl bg-blue-50/50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs space-y-1 border border-blue-100/60 dark:border-slate-800">
        <span className="font-bold text-slate-900 dark:text-white block">
          Peraturan Marketplace AWD · Arjawinangun Delivery
        </span>
        <p className="text-[11px] leading-relaxed">
          AWD (By Wong Nangun) adalah platform penghubung hiperlokal terpercaya. Komisi driver 10%, biaya platform Rp1.500 - Rp2.500 per transaksi untuk pemeliharaan server, pemetaan GPS & asuransi perlindungan konsumen.
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={logoutUser}
        className="w-full py-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Keluar dari Akun</span>
      </button>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-blue-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tambah Alamat Baru
              </h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Label Alamat</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Rumah', 'Kantor', 'Kost', 'Lainnya'] as const).map(l => (
                    <button
                      type="button"
                      key={l}
                      onClick={() => setNewLabel(l)}
                      className={`py-1.5 rounded-xl border font-bold ${
                        newLabel === l 
                          ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700' 
                          : 'border-slate-200'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Desa / Kelurahan (Kec. Arjawinangun)</label>
                <select
                  value={newVillage}
                  onChange={(e) => setNewVillage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option>Jungjang</option>
                  <option>Jungjang Wetan</option>
                  <option>Rawagatel</option>
                  <option>Tegalgubug</option>
                  <option>Tegalgubug Lor</option>
                  <option>Karangsambung</option>
                  <option>Bulak</option>
                  <option>Geyongan</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Nama Jalan & No. Rumah / RT / RW</label>
                <input
                  type="text"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Contoh: Jl. Ki Buyut No. 12, RT 02 / RW 01"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Patokan / Catatan Kurir</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Contoh: Sebelah warung bu siti, pagar hitam"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30"
              >
                Simpan Alamat
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-blue-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Buat Aduan / Pengajuan Komplain
              </h3>
              <button onClick={() => setIsComplaintModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFileComplaint} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Kategori Masalah</label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option>Masalah Pesanan</option>
                  <option>Kendala Pengantaran</option>
                  <option>Kendala Pembayaran</option>
                  <option>Permintaan Refund</option>
                  <option>Akun</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Judul Kendala</label>
                <input
                  type="text"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  placeholder="Contoh: Pesanan tertukar / salah menu"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Penjelasan Detail</label>
                <textarea
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder="Ceritakan kejadiannya secara rinci untuk investigasi tim CS AWD..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30"
              >
                Kirim Aduan ke CS AWD
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
