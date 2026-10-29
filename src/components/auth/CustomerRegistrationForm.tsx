import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  Navigation, 
  Home, 
  Briefcase, 
  Camera, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Store, 
  Search, 
  ShoppingBag, 
  Banknote, 
  Clock, 
  Star, 
  ChevronDown, 
  Upload,
  Radio,
  FileCheck2
} from 'lucide-react';
import { CustomerRegistrationData } from '../../types';

interface CustomerRegistrationFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const CustomerRegistrationForm: React.FC<CustomerRegistrationFormProps> = ({
  onSuccess,
  onSwitchToLogin
}) => {
  const { registerCustomer, showToast } = useApp();

  // Step tabs
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // SECTION 1: Data Pelanggan
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  // SECTION 2: Alamat Utama Pengantaran
  const [streetAddress, setStreetAddress] = useState('');
  const [village, setVillage] = useState('Jungjang');
  const [district, setDistrict] = useState('Arjawinangun');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState(-6.6432);
  const [longitude, setLongitude] = useState(108.4125);
  const [driverNotes, setDriverNotes] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // SECTION 3: Alamat Tambahan
  const [hasAdditionalAddress, setHasAdditionalAddress] = useState(false);
  const [additionalLabel, setAdditionalLabel] = useState<'Kantor' | 'Kost' | 'Lainnya'>('Kantor');
  const [addStreetAddress, setAddStreetAddress] = useState('');
  const [addVillage, setAddVillage] = useState('Jungjang');
  const [addDistrict, setAddDistrict] = useState('Arjawinangun');
  const [addLandmark, setAddLandmark] = useState('');

  // SECTION 4: Persetujuan
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Village and District Options for Arjawinangun and neighboring Cirebon areas
  const villagesInArjawinangun = [
    'Jungjang',
    'Jungjang Wetan',
    'Rawagatel',
    'Tegalgubug',
    'Tegalgubug Lor',
    'Karangsambung',
    'Bulak',
    'Geyongan',
    'Bayalangu Lor',
    'Bayalangu Kidul',
    'Sende'
  ];

  const districtOptions = [
    'Arjawinangun',
    'Ciwaringin',
    'Susukan',
    'Klangenan',
    'Panguragan',
    'Gegesik',
    'Gempol',
    'Palimanan',
    'Kedawung'
  ];

  // Preset Avatars
  const presetAvatars = [
    { label: 'Foodie Cirebon', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    { label: 'Pelanggan Setia', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { label: 'Wong Nangun', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' },
    { label: 'Warga Arja', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
  ];

  // OTP Simulation
  const handleSendOtp = () => {
    if (!phone || phone.length < 9) {
      setFormErrors(prev => ({ ...prev, phone: 'Nomor HP tidak valid. Masukkan nomor HP aktif.' }));
      showToast('Nomor HP tidak valid');
      return;
    }
    setIsOtpSent(true);
    setFormErrors(prev => {
      const copy = { ...prev };
      delete copy.phone;
      return copy;
    });
    showToast(`Kode OTP 4 digit telah dikirim ke WhatsApp / SMS ${phone}: [ 4921 ]`);
    setOtpCode('4921'); // prefill for easy test
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() === '4921' || otpCode.trim().length === 4) {
      setIsPhoneVerified(true);
      showToast('Nomor HP berhasil terverifikasi! Status Akun: AKTIF');
    } else {
      showToast('Kode OTP salah. Masukkan 4 digit OTP.');
    }
  };

  // GPS Pin Auto Detection Simulation
  const handleDetectGps = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(parseFloat(position.coords.latitude.toFixed(6)));
          setLongitude(parseFloat(position.coords.longitude.toFixed(6)));
          setIsDetectingGps(false);
          showToast('Titik GPS Anda berhasil dideteksi akurat');
        },
        () => {
          // Fallback to Arjawinangun Center coordinates
          setLatitude(-6.64321);
          setLongitude(108.41254);
          setIsDetectingGps(false);
          showToast('Menggunakan titik koordinat GPS Pusat Arjawinangun');
        },
        { timeout: 5000 }
      );
    } else {
      setLatitude(-6.64321);
      setLongitude(108.41254);
      setIsDetectingGps(false);
      showToast('Menggunakan titik koordinat GPS Arjawinangun');
    }
  };

  // Validation
  const validateStep1 = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) errors.fullName = 'Nama lengkap wajib diisi';
    if (!phone.trim()) errors.phone = 'Nomor HP aktif wajib diisi';
    if (!isPhoneVerified) errors.otp = 'Nomor HP wajib diverifikasi dengan OTP';
    if (password && password.length < 6) errors.password = 'Kata sandi minimal 6 karakter';
    if (password && password !== confirmPassword) errors.confirmPassword = 'Konfirmasi kata sandi tidak cocok';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!streetAddress.trim()) errors.streetAddress = 'Nama jalan / blok / no rumah wajib diisi';
    if (!village) errors.village = 'Desa / kelurahan wajib dipilih';
    if (!district) errors.district = 'Kecamatan wajib dipilih';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    } else {
      showToast('Harap lengkapi semua kolom wajib di Data Pelanggan');
    }
  };

  const handleNextToStep3 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    } else {
      showToast('Harap lengkapi Alamat Utama untuk pengantaran');
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedTerms) {
      showToast('Wajib menyetujui syarat & kebijakan privasi');
      return;
    }

    if (!validateStep1() || !validateStep2()) {
      showToast('Harap periksa kembali isian formulir yang belum lengkap');
      return;
    }

    const regData: CustomerRegistrationData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      password: password || undefined,
      avatarUrl: avatarUrl || undefined,
      phoneVerified: true,
      primaryAddress: {
        streetAddress: streetAddress.trim(),
        village,
        district,
        landmark: landmark.trim() || undefined,
        latitude,
        longitude,
        driverNotes: driverNotes.trim() || undefined,
      },
      additionalAddress: hasAdditionalAddress && addStreetAddress.trim() ? {
        label: additionalLabel,
        streetAddress: addStreetAddress.trim(),
        village: addVillage,
        district: addDistrict,
        landmark: addLandmark.trim() || undefined,
      } : undefined,
      agreedToTerms: true,
    };

    registerCustomer(regData);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="space-y-5">
      {/* Header Banner: Form Title & Explanation */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 rounded-2xl p-4 sm:p-5 text-white border border-blue-400/30 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-[10px] font-extrabold uppercase tracking-widest text-sky-300">
              <FileCheck2 className="w-3 h-3" /> FORM PENDAFTARAN APP PELANGGAN
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Data Pelanggan MitraArja · AWD
            </h2>
            <p className="text-xs text-blue-100 max-w-lg leading-relaxed">
              Khusus untuk pengguna yang ingin memesan makanan, sembako pasar, obat apotek, atau kirim barang dari warung lokal di Arjawinangun & sekitarnya.
            </p>
          </div>
          <div className="shrink-0 w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 shadow-md hidden sm:block">
            <img
              src="/assets/aistudio/Designer_b056b7f0.png"
              alt="AWD Logo"
              className="w-full h-full object-contain rounded-xl bg-white"
            />
          </div>
        </div>

        {/* Account Status Pill */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-blue-200">Status Akun:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
              isPhoneVerified 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
            }`}>
              {isPhoneVerified ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Aktif (HP Terverifikasi)</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Aktif setelah verifikasi nomor HP</span>
                </>
              )}
            </span>
          </div>

          <span className="text-[11px] text-sky-200 hidden xs:inline">
            Langkah {currentStep} dari 3
          </span>
        </div>
      </div>

      {/* Step Stepper Indicator */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`py-2 px-3 rounded-xl text-left border transition-all ${
            currentStep === 1
              ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/60 dark:to-slate-800 text-blue-900 dark:text-sky-300 font-bold shadow-xs'
              : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Langkah 1</div>
          <div className="text-xs truncate flex items-center gap-1">
            {isPhoneVerified && <Check className="w-3 h-3 text-blue-600" />}
            <span>1. Data Pribadi</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            if (validateStep1()) setCurrentStep(2);
          }}
          className={`py-2 px-3 rounded-xl text-left border transition-all ${
            currentStep === 2
              ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/60 dark:to-slate-800 text-blue-900 dark:text-sky-300 font-bold shadow-xs'
              : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Langkah 2</div>
          <div className="text-xs truncate flex items-center gap-1">
            {streetAddress && <Check className="w-3 h-3 text-blue-600" />}
            <span>2. Alamat & Peta</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            if (validateStep1() && validateStep2()) setCurrentStep(3);
          }}
          className={`py-2 px-3 rounded-xl text-left border transition-all ${
            currentStep === 3
              ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/60 dark:to-slate-800 text-blue-900 dark:text-sky-300 font-bold shadow-xs'
              : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Langkah 3</div>
          <div className="text-xs truncate">3. Selesai & Fitur</div>
        </button>
      </div>

      <form onSubmit={handleFinalSubmit} className="space-y-5 text-xs">
        {/* STEP 1: Data Pelanggan */}
        {currentStep === 1 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Data Pelanggan (Untuk Pemesanan Warung Lokal)</span>
              </h3>
              <span className="text-[11px] text-red-500 font-semibold">* Wajib diisi</span>
            </div>

            {/* Nama Lengkap (Wajib) */}
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Nama Lengkap <span className="text-red-500">* (Wajib)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (formErrors.fullName) {
                      setFormErrors(prev => {
                        const copy = { ...prev };
                        delete copy.fullName;
                        return copy;
                      });
                    }
                  }}
                  placeholder="Contoh: Budi Kurniawan"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white ${
                    formErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                  }`}
                />
              </div>
              {formErrors.fullName && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.fullName}
                </p>
              )}
            </div>

            {/* Nomor HP Aktif (Wajib · OTP) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Nomor HP Aktif <span className="text-red-500">* (Wajib · OTP)</span>
                </label>
                {isPhoneVerified && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs font-semibold text-slate-400">
                    +62
                  </span>
                  <input
                    type="tel"
                    disabled={isPhoneVerified}
                    value={phone.replace(/^0/, '').replace(/^\+62/, '')}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/[^0-9]/g, ''));
                      setIsPhoneVerified(false);
                      setIsOtpSent(false);
                    }}
                    placeholder="81234567890"
                    className="w-full pl-12 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                {!isPhoneVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold whitespace-nowrap shadow-xs"
                  >
                    {isOtpSent ? 'Kirim Ulang OTP' : 'Kirim OTP'}
                  </button>
                )}
              </div>
              {formErrors.phone && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                </p>
              )}

              {/* OTP Input Card */}
              {isOtpSent && !isPhoneVerified && (
                <div className="mt-3 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800 border border-blue-200 dark:border-blue-900/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Masukkan 4 Digit Kode OTP
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-sky-400 font-mono">
                      Simulasi OTP: 4921
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="4921"
                      className="w-32 px-3 py-2 text-center text-base tracking-widest font-mono font-black rounded-xl bg-white dark:bg-slate-900 border-2 border-blue-500 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white font-bold"
                    >
                      Verifikasi OTP Sekarang
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    * Verifikasi HP mengaktifkan status akun Anda secara instan dan mencegah penipuan order fiktif pada warung lokal.
                  </p>
                </div>
              )}
            </div>

            {/* Email (Opsional) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Email
                </label>
                <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: budi.kurniawan@gmail.com (opsional)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Digunakan untuk tanda terima struk PDF digital dan laporan pesanan.
              </p>
            </div>

            {/* Kata Sandi & Konfirmasi Kata Sandi (Wajib jika memakai login kata sandi) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Kata Sandi <span className="text-red-500">* (Wajib)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-[11px] text-red-500 mt-1">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Konfirmasi Kata Sandi <span className="text-red-500">* (Wajib)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password === confirmPassword && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                    <Check className="w-3 h-3" /> Kata sandi cocok
                  </p>
                )}
                {formErrors.confirmPassword && (
                  <p className="text-[11px] text-red-500 mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Foto Profil (Opsional) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Foto Profil
                </label>
                <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-blue-500/50 shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-7 h-7" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    {presetAvatars.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatarUrl(av.url);
                          showToast(`Foto avatar "${av.label}" dipilih`);
                        }}
                        className={`text-[10px] px-2 py-1 rounded-lg border font-semibold transition-colors ${
                          avatarUrl === av.url 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {av.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Foto membantu kurir mengenali pelanggan saat serah terima pesanan.
                  </span>
                </div>
              </div>
            </div>

            {/* Action Next Step */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleNextToStep2}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center gap-2"
              >
                <span>Lanjut: Isi Alamat Pengantaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Alamat Utama & Titik Peta GPS */}
        {currentStep === 2 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Alamat Utama (Wajib Sebelum Melakukan Pemesanan)</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Kurir mengantar langsung ke alamat ini sesuai rute tercepat
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                &larr; Kembali
              </button>
            </div>

            {/* Nama jalan / blok / nomor rumah (Wajib untuk pengantaran) */}
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Nama Jalan / Blok / Nomor Rumah <span className="text-red-500">* (Wajib)</span>
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => {
                  setStreetAddress(e.target.value);
                  if (formErrors.streetAddress) {
                    setFormErrors(prev => {
                      const copy = { ...prev };
                      delete copy.streetAddress;
                      return copy;
                    });
                  }
                }}
                placeholder="Contoh: Jl. Ki Buyut Rawagatel No. 42, Blok Wage, RT 03 / RW 02"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white ${
                  formErrors.streetAddress ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {formErrors.streetAddress && (
                <p className="text-[11px] text-red-500 mt-1">{formErrors.streetAddress}</p>
              )}
            </div>

            {/* Desa / Kelurahan & Kecamatan (Wajib) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Desa / Kelurahan <span className="text-red-500">* (Wajib)</span>
                </label>
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  {villagesInArjawinangun.map(v => (
                    <option key={v} value={v}>Desa {v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Kecamatan <span className="text-red-500">* (Wajib)</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  {districtOptions.map(d => (
                    <option key={d} value={d}>Kec. {d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patokan lokasi (Opsional, tetapi disarankan) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Patokan Lokasi
                </label>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                  Sangat Disarankan
                </span>
              </div>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Contoh: Sebelah warung bu siti, seberang masjid Al-Falah, pagar hitam"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            {/* Titik lokasi pada peta (GPS) (Wajib untuk pengantaran berbasis lokasi) */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Titik Lokasi pada Peta (GPS)</span>
                  <span className="text-red-500">* (Wajib Pengantaran Akurat)</span>
                </label>

                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={isDetectingGps}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                  <span>{isDetectingGps ? 'Mendeteksi Satelit...' : 'Deteksi GPS Saya Saat Ini'}</span>
                </button>
              </div>

              {/* Interactive Vector GPS Map Pin Picker */}
              <div className="relative h-48 w-full rounded-2xl bg-slate-950 overflow-hidden border border-blue-500/40 select-none shadow-inner">
                {/* Grid Overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-25 stroke-blue-500" width="100%" height="100%">
                  <defs>
                    <pattern id="reg-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#reg-grid)" />
                </svg>

                {/* Hyperlocal Roads Vector (Jl By Pass, Alun-alun, Ki Buyut) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                  <path d="M 20 160 L 160 130 L 260 150 L 380 120" stroke="#1e293b" strokeWidth="6" fill="none" />
                  <path d="M 120 20 L 120 180" stroke="#1e293b" strokeWidth="8" fill="none" />
                  <path d="M 30 70 Q 180 110, 370 60" stroke="#334155" strokeWidth="10" fill="none" />
                  <path d="M 30 70 Q 180 110, 370 60" stroke="#0f172a" strokeWidth="6" fill="none" />

                  {/* Landmarks */}
                  <text x="30" y="55" fill="#93c5fd" fontSize="9" fontWeight="bold">PASAR ARJAWINANGUN</text>
                  <text x="240" y="50" fill="#64748b" fontSize="8">Jl. By Pass Arja</text>
                  <text x="140" y="165" fill="#38bdf8" fontSize="9" fontWeight="bold">DESA {village.toUpperCase()}</text>
                  
                  {/* Pin Target Ripple */}
                  <circle cx="200" cy="100" r="28" fill="#38bdf8" opacity="0.15" className="animate-ping" />
                  <circle cx="200" cy="100" r="14" fill="#2563eb" opacity="0.3" />
                  <circle cx="200" cy="100" r="6" fill="#38bdf8" />
                </svg>

                {/* Center Pin Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative -mt-6 flex flex-col items-center">
                    <div className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px] shadow-md whitespace-nowrap mb-0.5">
                      Titik Rumah Anda
                    </div>
                    <MapPin className="w-8 h-8 text-red-500 fill-red-500 filter drop-shadow-md animate-bounce" />
                  </div>
                </div>

                {/* Floating GPS Coordinates Pill */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-500/40 text-white flex items-center justify-between text-[11px]">
                  <span className="font-mono text-sky-300">
                    GPS: {latitude.toFixed(5)}, {longitude.toFixed(5)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Kec. {district}, {village}
                  </span>
                </div>
              </div>
            </div>

            {/* Catatan untuk driver (Opsional) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Catatan untuk Driver
                </label>
                <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
              </div>
              <input
                type="text"
                value={driverNotes}
                onChange={(e) => setDriverNotes(e.target.value)}
                placeholder="Contoh: Titip di teras rumah jika bel tidak dijawab, jangan bunyikan klakson malam"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            {/* Alamat Tambahan (Opsional Toggle) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasAdditionalAddress}
                  onChange={(e) => setHasAdditionalAddress(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  + Tambahkan Alamat Kedua (Kantor / Kost / Lainnya)
                </span>
                <span className="text-[11px] text-slate-400 font-normal">(Opsional)</span>
              </label>

              {hasAdditionalAddress && (
                <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex gap-2">
                    {(['Kantor', 'Kost', 'Lainnya'] as const).map(l => (
                      <button
                        type="button"
                        key={l}
                        onClick={() => setAdditionalLabel(l)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          additionalLabel === l 
                            ? 'border-blue-600 bg-blue-600 text-white' 
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={addStreetAddress}
                      onChange={(e) => setAddStreetAddress(e.target.value)}
                      placeholder="Jalan / nama gedung / no ruangan kantor"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={addVillage}
                      onChange={(e) => setAddVillage(e.target.value)}
                      placeholder="Desa / Kelurahan"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={addLandmark}
                      onChange={(e) => setAddLandmark(e.target.value)}
                      placeholder="Patokan tambahan"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Buttons Back & Next */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-2.5 px-4 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-semibold"
              >
                &larr; Kembali
              </button>
              <button
                type="button"
                onClick={handleNextToStep3}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center gap-2"
              >
                <span>Lanjut: Tinjau & Aktivasi Akun</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Persetujuan Syarat & Fitur Tambahan Setelah Pendaftaran */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Summary Review Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Ringkasan Data Pendaftaran Pelanggan</span>
              </h3>

              <div className="p-3.5 rounded-2xl bg-blue-50/40 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Pelanggan:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor HP Aktif:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-sky-400">
                    +62 {phone.replace(/^0/, '')} (Terverifikasi OTP)
                  </span>
                </div>
                {email && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Alamat Pengantaran:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right max-w-xs truncate">
                    {streetAddress}, Desa {village}, Kec. {district}
                  </span>
                </div>
                {landmark && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patokan:</span>
                    <span className="text-slate-600 dark:text-slate-400 text-right">{landmark}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Titik Koordinat GPS:</span>
                  <span className="font-mono text-sky-600 dark:text-sky-400">
                    {latitude.toFixed(5)}, {longitude.toFixed(5)}
                  </span>
                </div>
              </div>
            </div>

            {/* Fitur Tambahan Setelah Pendaftaran (Visual Checklist) */}
            <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 rounded-3xl p-4 sm:p-5 text-white border border-blue-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  Fitur Tambahan Setelah Pendaftaran:
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-start gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                  <Store className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Melihat Daftar Merchant & Produk</span>
                    <span className="text-[11px] text-blue-200">Akses kuliner, pasar segar, apotek & toko UMKM lokal.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                  <Search className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Mencari Warung Lokal</span>
                    <span className="text-[11px] text-blue-200">Cari berdasarkan nama warung, menu makanan, kategori & jarak terdekat.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                  <ShoppingBag className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Keranjang & Pembuatan Pesanan</span>
                    <span className="text-[11px] text-blue-200">Masukkan produk dengan kustomisasi catatan khusus pesanan.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                  <Banknote className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Pilihan Pembayaran COD & Digital</span>
                    <span className="text-[11px] text-blue-200">Bayar di Tempat (COD), MitraPay, QRIS, atau Transfer Bank.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                  <Navigation className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Pantau Status Pesanan & GPS Driver</span>
                    <span className="text-[11px] text-blue-200">Pelacakan posisi kurir AWD secara live di peta Arjawinangun.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                  <Star className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Riwayat, Ulasan & Multi Alamat</span>
                    <span className="text-[11px] text-blue-200">Simpan banyak alamat dan beri rating bintang untuk kurir & warung.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Persetujuan syarat dan kebijakan privasi (Wajib) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-blue-200/80 dark:border-slate-800 shadow-xs">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 mt-0.5 shrink-0"
                />
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    Persetujuan Syarat & Kebijakan Privasi <span className="text-red-500">* (Wajib)</span>
                  </span>
                  Saya menyetujui <span className="text-blue-600 font-semibold underline">Syarat Ketentuan Pelanggan</span> dan <span className="text-blue-600 font-semibold underline">Kebijakan Privasi Perlindungan Data</span> MitraArja AWD. Saya menyatakan data nomor HP dan alamat yang diisi adalah benar untuk keperluan pengantaran pesanan.
                </div>
              </label>
            </div>

            {/* Submit Registration Button */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={!agreedTerms}
                className={`w-full py-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] ${
                  agreedTerms 
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white shadow-blue-600/30' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>DAFTAR SEKARANG & AKTIFKAN AKUN PELANGGAN AWD</span>
              </button>

              {onSwitchToLogin && (
                <div className="text-center pt-2">
                  <span className="text-slate-500 text-xs">
                    Sudah memiliki akun terdaftar?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Masuk ke Akun Anda
                    </button>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
