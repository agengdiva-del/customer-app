import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Database, 
  Code2, 
  Copy, 
  Download, 
  Check, 
  Layers, 
  FolderTree, 
  Server,
  Terminal,
  ExternalLink
} from 'lucide-react';

export const EnterpriseHubModal: React.FC = () => {
  const { isEnterpriseHubOpen, setIsEnterpriseHubOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'schema' | 'flutter' | 'architecture'>('schema');
  const [copied, setCopied] = useState(false);

  if (!isEnterpriseHubOpen) return null;

  const flutterArchitectureTree = `mitraarja_customer_app/
├── lib/
│   ├── core/
│   │   ├── constants/
│   │   │   ├── api_endpoints.dart
│   │   │   ├── app_colors.dart        # Primary #16A34A, Secondary #F97316
│   │   │   └── app_theme.dart         # Material 3 Light/Dark Theme
│   │   ├── network/
│   │   │   ├── supabase_client.dart   # Realtime Supabase Auth & DB
│   │   │   └── dio_interceptor.dart
│   │   ├── services/
│   │   │   ├── fcm_notification_service.dart # Firebase Cloud Messaging
│   │   │   ├── geolocation_service.dart      # Google Maps & Places
│   │   │   └── midtrans_payment_service.dart # Midtrans & QRIS SDK
│   │   └── utils/
│   │       ├── currency_formatter.dart # IDR Currency (Rp)
│   │       └── validators.dart
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/repositories/auth_repository_impl.dart
│   │   │   ├── domain/entities/user_entity.dart
│   │   │   └── presentation/bloc/auth_bloc.dart
│   │   ├── home/
│   │   │   ├── presentation/pages/home_page.dart
│   │   │   └── presentation/widgets/banner_carousel.dart
│   │   ├── food_delivery/
│   │   │   ├── presentation/pages/restaurant_detail_page.dart
│   │   │   └── presentation/bloc/food_bloc.dart
│   │   ├── grocery/
│   │   ├── courier/
│   │   │   └── presentation/pages/mitra_kirim_page.dart
│   │   ├── ppob/
│   │   │   └── presentation/pages/pulsa_bills_page.dart
│   │   ├── tracking/
│   │   │   ├── presentation/pages/realtime_tracking_page.dart
│   │   │   └── presentation/widgets/google_map_driver_marker.dart
│   │   ├── wallet/
│   │   │   └── presentation/pages/mitrapay_wallet_page.dart
│   │   └── chat/
│   │       └── presentation/pages/driver_chat_page.dart
│   └── main.dart
├── test/
├── pubspec.yaml
└── supabase/
    └── migrations/
        └── 20261020000000_mitraarja_complete_schema.sql`;

  const sampleDartCode = `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

// MitraArja Clean Architecture Order Tracking BLoC
class OrderTrackingBloc extends Bloc<OrderTrackingEvent, OrderTrackingState> {
  final SupabaseClient supabase;

  OrderTrackingBloc({required this.supabase}) : super(OrderTrackingInitial()) {
    on<SubscribeOrderLocation>(_onSubscribeLocation);
  }

  void _onSubscribeLocation(SubscribeOrderLocation event, Emitter<OrderTrackingState> emit) async {
    emit(OrderTrackingLoading());
    
    // Realtime Supabase Channel for Driver Telemetry in Arjawinangun
    final channel = supabase.channel('tracking:\${event.orderId}')
      .onPostgresChanges(
        event: PostgresChangeEvent.all,
        schema: 'public',
        table: 'delivery_tracking',
        filter: PostgresChangeFilter(
          type: PostgresChangeFilterType.eq,
          column: 'order_id',
          value: event.orderId,
        ),
        callback: (payload) {
          final lat = payload.newRecord['current_lat'] as double;
          final lng = payload.newRecord['current_lng'] as double;
          emit(DriverPositionUpdated(latitude: lat, longitude: lng));
        },
      )
      .subscribe();
  }
}`;

  const sqlSample = `-- 24 Core PostgreSQL Tables for MitraArja Hyperlocal Engine
-- (users, customers, customer_addresses, orders, order_items, carts, payments, wallets, 
--  wallet_transactions, transactions, reviews, complaints, notifications, favorites, 
--  coupons, vouchers, promotions, support_tickets, referrals, merchant_followers, 
--  search_history, delivery_tracking, chat_rooms, messages)

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id),
    driver_id UUID REFERENCES public.drivers(id),
    service_type VARCHAR(30) NOT NULL,
    destination_address_id UUID REFERENCES public.customer_addresses(id),
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    platform_fee NUMERIC(12, 2) NOT NULL DEFAULT 2000,
    voucher_discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending', 'merchant_accepted', 'driver_assigned', 'preparing',
        'picked_up', 'on_delivery', 'delivered', 'completed', 'cancelled'
    )),
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('mitrapay', 'qris', 'bank_transfer', 'cod', 'ewallet')),
    is_paid BOOLEAN DEFAULT false,
    eta_minutes INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Real-time delivery tracking telemetry table
CREATE TABLE IF NOT EXISTS public.delivery_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES public.drivers(id) NOT NULL,
    current_lat NUMERIC(10, 7) NOT NULL,
    current_lng NUMERIC(10, 7) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Teks berhasil disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const element = document.createElement('a');
    const file = new Blob([sqlSample], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'mitraarja_supabase_schema.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('File mitraarja_supabase_schema.sql berhasil diunduh!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 text-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-800 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-blue-700 via-sky-500 to-indigo-600 shadow-md shrink-0">
              <img
                src="/assets/aistudio/Designer_b056b7f0.png"
                alt="AWD Logo"
                className="w-full h-full object-contain rounded-xl bg-white"
              />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                MitraArja Enterprise Architecture & Supabase Hub
              </h3>
              <p className="text-xs text-sky-400 font-semibold">
                AWD · Arjawinangun Delivery by Wong Nangun
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEnterpriseHubOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-5 pt-3 border-b border-slate-800 flex items-center gap-4 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === 'schema'
                ? 'border-blue-500 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Schema (SQL)</span>
          </button>

          <button
            onClick={() => setActiveTab('flutter')}
            className={`pb-3 flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === 'flutter'
                ? 'border-blue-500 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Flutter Folder Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === 'architecture'
                ? 'border-blue-500 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Dart BLoC Sample</span>
          </button>
        </div>

        {/* Code Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-300 space-y-4">
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Total 24 Tabel Terdefinisi (PostGIS, UUID, RLS, Foreign Keys)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(sqlSample)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 font-sans font-semibold text-xs transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin SQL'}</span>
                  </button>
                  <button
                    onClick={handleDownloadSql}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white flex items-center gap-1.5 font-sans font-semibold text-xs transition-colors shadow-md shadow-blue-500/25"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .sql</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-x-auto leading-relaxed text-[11px] text-sky-300 font-mono">
                {sqlSample}
              </pre>
            </div>
          )}

          {activeTab === 'flutter' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Clean Architecture Standard (Core, Features, BLoC, Repositories)
                </span>
                <button
                  onClick={() => handleCopy(flutterArchitectureTree)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 font-sans font-semibold text-xs"
                >
                  <Copy className="w-3.5 h-3.5" /> Salin Struktur
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-x-auto leading-relaxed text-[11px] text-blue-300 font-mono">
                {flutterArchitectureTree}
              </pre>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Flutter BLoC & Supabase Realtime Telemetry Implementation
                </span>
                <button
                  onClick={() => handleCopy(sampleDartCode)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 font-sans font-semibold text-xs"
                >
                  <Copy className="w-3.5 h-3.5" /> Salin Dart Code
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-x-auto leading-relaxed text-[11px] text-amber-300 font-mono">
                {sampleDartCode}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Target Platform: Arjawinangun, Cirebon & Nationwide Expansion</span>
          <button
            onClick={() => setIsEnterpriseHubOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
          >
            Tutup Console
          </button>
        </div>
      </div>
    </div>
  );
};
