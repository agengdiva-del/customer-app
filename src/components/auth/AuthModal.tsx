import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MessageSquare, 
  Phone, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  LogIn
} from 'lucide-react';
import { CustomerRegistrationForm } from './CustomerRegistrationForm';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginUser, 
    authInitialMode,
    showToast 
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [phone, setPhone] = useState('081234567890');
  const [email, setEmail] = useState('budi.kurniawan@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('4921');

  useEffect(() => {
    if (isAuthModalOpen) {
      setAuthMode(authInitialMode || 'login');
      setOtpStep(false);
    }
  }, [isAuthModalOpen, authInitialMode]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpStep && (loginMethod === 'whatsapp' || loginMethod === 'phone')) {
      setOtpStep(true);
      showToast(`Kode OTP 4 digit telah dikirim ke nomor ${phone}: [4921]`);
      return;
    }

    loginUser(loginMethod, {
      name: 'Budi Kurniawan',
      phone,
      email,
    });
    setOtpStep(false);
  };

  const handleGoogleLogin = () => {
    loginUser('google', {
      name: 'Budi Kurniawan',
      email: 'budi.kurniawan@gmail.com',
      phone: '081234567890',
    });
  };

  const handleGuestLogin = () => {
    loginUser('guest');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className={`bg-white dark:bg-slate-900 w-full rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-blue-100 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto transition-all ${
        authMode === 'register' ? 'max-w-2xl' : 'max-w-md'
      }`}>
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl p-0.5 bg-gradient-to-tr from-blue-700 via-sky-500 to-indigo-600 shadow-md shrink-0">
              <img
                src="/assets/aistudio/Designer_b056b7f0.png"
                alt="AWD Logo"
                className="w-full h-full object-contain rounded-xl bg-white"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-slate-900 dark:text-white">
                  Mitra<span className="text-blue-600">Arja</span> AWD
                </span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 font-bold px-2 py-0.5 rounded-full">
                  Pelanggan
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                Arjawinangun Delivery · By Wong Nangun
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsAuthModalOpen(false)} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Masuk vs Daftar Akun Pelanggan */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              authMode === 'login'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Akun</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              authMode === 'register'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Pelanggan Baru</span>
          </button>
        </div>

        {/* REGISTER MODE: Comprehensive Customer Registration Form */}
        {authMode === 'register' ? (
          <CustomerRegistrationForm
            onSuccess={() => setIsAuthModalOpen(false)}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        ) : (
          /* LOGIN MODE: Quick Login with WhatsApp / Phone OTP / Email */
          <div className="space-y-4">
            {/* Login Method Tabs */}
            {!otpStep && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setLoginMethod('whatsapp')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    loginMethod === 'whatsapp'
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/50 dark:to-slate-800 text-blue-700 dark:text-sky-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    loginMethod === 'phone'
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/50 dark:to-slate-800 text-blue-700 dark:text-sky-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>SMS OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    loginMethod === 'email'
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/50 dark:to-slate-800 text-blue-700 dark:text-sky-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              {(loginMethod === 'whatsapp' || loginMethod === 'phone') && !otpStep && (
                <div>
                  <label className="font-semibold block mb-1">Nomor WhatsApp / HP Terdaftar</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400">+62</span>
                    <input
                      type="tel"
                      value={phone.replace(/^0/, '')}
                      onChange={(e) => setPhone(`0${e.target.value}`)}
                      placeholder="8123456789"
                      className="w-full pl-12 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {loginMethod === 'email' && (
                <>
                  <div>
                    <label className="font-semibold block mb-1">Alamat Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Kata Sandi</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {otpStep && (
                <div className="space-y-2 text-center py-2">
                  <span className="text-slate-500 block">
                    Masukkan 4 Digit Kode OTP yang dikirim ke {phone}
                  </span>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-32 mx-auto text-center font-mono font-bold text-xl tracking-widest px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-blue-500 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="text-[11px] text-slate-400 hover:underline block mx-auto"
                  >
                    Ganti Nomor HP
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all active:scale-95"
              >
                {otpStep ? 'Verifikasi & Masuk' : 'Lanjut Masuk ke MitraArja'}
              </button>
            </form>

            {/* 3rd Party Logins */}
            {!otpStep && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Masuk dengan Akun Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium"
                >
                  Mode Tamu (Jelajahi tanpa login)
                </button>
              </div>
            )}

            <div className="text-center text-xs text-slate-500 pt-1">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-blue-600 font-bold hover:underline"
              >
                Buka Formulir Pendaftaran Pelanggan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
