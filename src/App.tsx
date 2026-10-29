import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { HomeView } from './components/home/HomeView';
import { FoodDeliveryView } from './components/food/FoodDeliveryView';
import { RestaurantDetailModal } from './components/food/RestaurantDetailModal';
import { GroceryView } from './components/grocery/GroceryView';
import { PharmacyView } from './components/pharmacy/PharmacyView';
import { CourierView } from './components/courier/CourierView';
import { PpobView } from './components/ppob/PpobView';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { OrderTrackingModal } from './components/tracking/OrderTrackingModal';
import { ChatModal } from './components/chat/ChatModal';
import { WalletView } from './components/wallet/WalletView';
import { OrderHistoryView } from './components/orders/OrderHistoryView';
import { NotificationCenterView } from './components/notifications/NotificationCenterView';
import { AccountView } from './components/account/AccountView';
import { KycModal } from './components/kyc/KycModal';
import { AuthModal } from './components/auth/AuthModal';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    activeService, 
    selectedMerchant, 
    setSelectedMerchant, 
    isMobileFrame 
  } = useApp();

  const renderActiveScreen = () => {
    // If a specific service category is active
    if (activeService === 'food' || activeService === 'umkm') {
      return <FoodDeliveryView />;
    }
    if (activeService === 'grocery') {
      return <GroceryView />;
    }
    if (activeService === 'pharmacy') {
      return <PharmacyView />;
    }
    if (activeService === 'courier') {
      return <CourierView />;
    }
    if (activeService === 'pulsa' || activeService === 'bills') {
      return <PpobView />;
    }

    // Default to main bottom navigation tabs
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'orders':
        return <OrderHistoryView />;
      case 'wallet':
        return <WalletView />;
      case 'notifications':
        return <NotificationCenterView />;
      case 'account':
        return <AccountView />;
      default:
        return <HomeView />;
    }
  };

  const appCore = (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        {renderActiveScreen()}
      </main>

      <BottomNav />

      {/* Global Modals & Drawers */}
      {selectedMerchant && (
        <RestaurantDetailModal
          merchant={selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
        />
      )}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <ChatModal />
      <KycModal />
      <AuthModal />
      <Toast />
    </div>
  );

  if (isMobileFrame) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-2 sm:p-6 select-none overflow-hidden">
        {/* Smartphone Hardware Frame Mockup */}
        <div className="relative w-full max-w-[420px] h-[890px] bg-slate-950 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 border-4 border-slate-700/80 flex flex-col overflow-hidden">
          {/* Status Bar */}
          <div className="h-6 w-full px-6 flex items-center justify-between text-white text-[11px] font-semibold shrink-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
            <span>09:41</span>
            {/* Dynamic Island Pill */}
            <div className="w-20 h-4 bg-black rounded-full" />
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen Body */}
          <div className="flex-1 w-full overflow-y-auto no-scrollbar rounded-b-[38px] relative bg-slate-50 dark:bg-slate-950">
            {appCore}
          </div>

          {/* iOS / Android Home Indicator Bar */}
          <div className="w-32 h-1 bg-white/30 rounded-full mx-auto my-1.5 shrink-0" />
        </div>
      </div>
    );
  }

  return appCore;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
