import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  HeartPulse, 
  Package, 
  Smartphone, 
  ReceiptText, 
  Store 
} from 'lucide-react';
import { ServiceType } from '../../types';

export const ServiceGrid: React.FC = () => {
  const { setActiveService } = useApp();

  const services: { id: ServiceType; label: string; sub: string; icon: any; color: string; bg: string }[] = [
    {
      id: 'food',
      label: 'AWD Food',
      sub: 'Kuliner Arja',
      icon: UtensilsCrossed,
      color: 'text-blue-600 dark:text-sky-400',
      bg: 'bg-gradient-to-br from-blue-50 to-sky-100/70 dark:from-blue-950/40 dark:to-slate-800 border-blue-200/70 dark:border-blue-900/40',
    },
    {
      id: 'grocery',
      label: 'AWD Mart',
      sub: 'Sayur & Sembako',
      icon: ShoppingBag,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-gradient-to-br from-indigo-50 to-blue-100/70 dark:from-indigo-950/40 dark:to-slate-800 border-indigo-200/70 dark:border-indigo-900/40',
    },
    {
      id: 'pharmacy',
      label: 'AWD Health',
      sub: 'Obat & Resep',
      icon: HeartPulse,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-gradient-to-br from-cyan-50 to-blue-100/70 dark:from-cyan-950/40 dark:to-slate-800 border-cyan-200/70 dark:border-cyan-900/40',
    },
    {
      id: 'courier',
      label: 'AWD Kirim',
      sub: 'Antar Paket',
      icon: Package,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-gradient-to-br from-sky-50 to-indigo-100/70 dark:from-sky-950/40 dark:to-slate-800 border-sky-200/70 dark:border-sky-900/40',
    },
    {
      id: 'pulsa',
      label: 'AWD Pulsa',
      sub: 'Pulsa & Kuota',
      icon: Smartphone,
      color: 'text-blue-700 dark:text-blue-400',
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-100/70 dark:from-blue-950/40 dark:to-slate-800 border-blue-200/70 dark:border-blue-900/40',
    },
    {
      id: 'bills',
      label: 'Tagihan PPOB',
      sub: 'PLN, PDAM, BPJS',
      icon: ReceiptText,
      color: 'text-indigo-700 dark:text-indigo-300',
      bg: 'bg-gradient-to-br from-indigo-50 to-sky-100/70 dark:from-indigo-950/40 dark:to-slate-800 border-indigo-200/70 dark:border-indigo-900/40',
    },
    {
      id: 'umkm',
      label: 'Pasar UMKM',
      sub: 'Wong Nangun',
      icon: Store,
      color: 'text-sky-700 dark:text-sky-300',
      bg: 'bg-gradient-to-br from-sky-50 to-blue-100/70 dark:from-sky-950/40 dark:to-slate-800 border-sky-200/70 dark:border-sky-900/40',
    }
  ];

  return (
    <section>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 sm:gap-3">
        {services.map(svc => {
          const Icon = svc.icon;
          return (
            <button
              key={svc.id}
              onClick={() => setActiveService(svc.id)}
              className="group flex flex-col items-center text-center p-2 rounded-2xl transition-all duration-200 hover:-translate-y-1 active:scale-95"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all ${svc.bg}`}>
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${svc.color}`} />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 truncate w-full group-hover:text-blue-600 transition-colors">
                {svc.label}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 truncate w-full hidden xs:block">
                {svc.sub}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
