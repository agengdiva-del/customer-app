import React, { useState, useEffect } from 'react';
import { HERO_FOOD_IMAGE, GROCERY_IMAGE, COURIER_IMAGE } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { ChevronRight } from 'lucide-react';

export const BannerCarousel: React.FC = () => {
  const { setActiveService } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      image: HERO_FOOD_IMAGE,
      badge: 'KULINER KHAS CIREBON · AWD',
      title: 'Diskon Kilat 50% Nasi Jamblang & Empal Gentong',
      subtitle: 'Antaran hangat langsung dari dapur autentik Arjawinangun',
      cta: 'Pesan Makanan',
      service: 'food' as const,
    },
    {
      id: 2,
      image: GROCERY_IMAGE,
      badge: 'PASAR SEGAR ARJAWINANGUN',
      title: 'Belanja Sayur & Sembako Tanpa Antre',
      subtitle: 'Dipetik pagi dari petani lokal, diantar kilat 20 menit',
      cta: 'Belanja Pasar',
      service: 'grocery' as const,
    },
    {
      id: 3,
      image: COURIER_IMAGE,
      badge: 'AWD KURIR INSTAN',
      title: 'Kirim Dokumen & Paket Mulai Rp8.000',
      subtitle: 'Kurir independen Wong Nangun siap jemput di lokasimu',
      cta: 'Kirim Paket',
      service: 'courier' as const,
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-md border border-blue-100 dark:border-slate-800 bg-slate-900">
      <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center brightness-90"
            />
            {/* Dark Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-sky-300 mb-1">
                {banner.badge}
              </span>
              <h3 className="text-base sm:text-xl md:text-2xl font-bold leading-tight line-clamp-2 max-w-lg">
                {banner.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-1 max-w-md hidden xs:block">
                {banner.subtitle}
              </p>
              <div className="mt-2.5">
                <button
                  onClick={() => setActiveService(banner.service)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-95"
                >
                  <span>{banner.cta}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-2.5 right-4 z-20 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentSlide ? 'w-5 bg-sky-400' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
