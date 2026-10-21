import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Address, 
  CartItem, 
  Order, 
  WalletTransaction, 
  NotificationItem, 
  ChatMessage, 
  ComplaintTicket, 
  ServiceType, 
  MenuItem, 
  Merchant 
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_ADDRESSES, 
  INITIAL_ACTIVE_ORDER, 
  INITIAL_WALLET_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_MERCHANTS, 
  INITIAL_DRIVER 
} from '../data/mockData';

interface AppContextType {
  // Theme & Layout
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isMobileFrame: boolean;
  toggleMobileFrame: () => void;
  
  // Navigation
  activeTab: 'home' | 'orders' | 'wallet' | 'notifications' | 'account';
  setActiveTab: (tab: 'home' | 'orders' | 'wallet' | 'notifications' | 'account') => void;
  activeService: ServiceType | null;
  setActiveService: (service: ServiceType | null) => void;
  selectedMerchant: Merchant | null;
  setSelectedMerchant: (merchant: Merchant | null) => void;

  // User & Auth
  user: User;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginUser: (method: 'whatsapp' | 'phone' | 'email' | 'google' | 'guest', credentials?: any) => void;
  logoutUser: () => void;
  submitKyc: (docType: 'ktp' | 'sim' | 'paspor', docNumber: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;

  // Addresses
  addresses: Address[];
  selectedAddress: Address;
  setSelectedAddress: (address: Address) => void;
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => void;
  deleteAddress: (id: string) => void;

  // Cart & Ordering
  cart: CartItem[];
  addToCart: (merchant: Merchant, item: MenuItem, quantity?: number, notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartMerchant: Merchant | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  createOrder: (paymentMethod: any, voucherDiscount: number, notes?: string) => Order;

  // Orders & Live Tracking
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  advanceOrderStatus: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;

  // Wallet
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  topUpWallet: (amount: number, method: string) => void;
  transferWallet: (amount: number, recipientPhone: string) => boolean;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, photoUrl?: string) => void;
  isChatModalOpen: boolean;
  setIsChatModalOpen: (open: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Complaints / Tickets
  tickets: ComplaintTicket[];
  createTicket: (category: any, title: string, description: string, orderId?: string) => void;

  // Modals & Tools
  isEnterpriseHubOpen: boolean;
  setIsEnterpriseHubOpen: (open: boolean) => void;
  isKycModalOpen: boolean;
  setIsKycModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & View mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('mitraarja_dark') === 'true';
  });
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mitraarja_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mitraarja_dark', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleMobileFrame = () => setIsMobileFrame(prev => !prev);

  // Nav state
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'wallet' | 'notifications' | 'account'>('home');
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  // User & Auth
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('mitraarja_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('mitraarja_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });
  const [selectedAddress, setSelectedAddress] = useState<Address>(addresses[0] || INITIAL_ADDRESSES[0]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mitraarja_orders');
    return saved ? JSON.parse(saved) : [INITIAL_ACTIVE_ORDER];
  });
  const [activeOrder, setActiveOrder] = useState<Order | null>(INITIAL_ACTIVE_ORDER);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);

  // Wallet
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('mitraarja_wallet_bal');
    return saved ? parseFloat(saved) : 285000;
  });
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('mitraarja_txs');
    return saved ? JSON.parse(saved) : INITIAL_WALLET_TRANSACTIONS;
  });

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      orderId: 'ord-arja-98421',
      senderType: 'driver',
      senderName: 'Kang Asep',
      text: 'Halo kak, pesanan Nasi Jamblang Mang Dul sudah diambil ya. Sekarang otw ke Jl. Ki Buyut Rawagatel.',
      timestamp: '08:16 WIB',
      isRead: true,
    },
    {
      id: 'msg-2',
      orderId: 'ord-arja-98421',
      senderType: 'customer',
      senderName: 'Budi Kurniawan',
      text: 'Siap kang, sambalnya jangan lupa dipisah ya.',
      timestamp: '08:17 WIB',
      isRead: true,
    },
    {
      id: 'msg-3',
      orderId: 'ord-arja-98421',
      senderType: 'driver',
      senderName: 'Kang Asep',
      text: 'Aman kak, sudah dibungkus pisah dari warungnya. 5 menit lagi sampai.',
      timestamp: '08:20 WIB',
      isRead: true,
    }
  ]);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(['mch-1', 'mch-4']);

  // Complaints / Tickets
  const [tickets, setTickets] = useState<ComplaintTicket[]>([
    {
      id: 'tkt-001',
      ticketNumber: 'TKT-ARJA-4921',
      category: 'Masalah Pesanan',
      title: 'Kekurangan sambal pada pesanan minggu lalu',
      description: 'Pesanan tiba cepat namun sambal terasi tertinggal di kedai.',
      status: 'resolved',
      createdAt: '15 Okt 2026',
      resolutionNote: 'Voucher kompensasi Rp10.000 telah ditambahkan ke akun Anda.',
    }
  ]);

  // Modals & UI
  const [isEnterpriseHubOpen, setIsEnterpriseHubOpen] = useState<boolean>(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast Helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('mitraarja_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mitraarja_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('mitraarja_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mitraarja_wallet_bal', walletBalance.toString());
    localStorage.setItem('mitraarja_txs', JSON.stringify(walletTransactions));
  }, [walletBalance, walletTransactions]);

  // Auth operations
  const loginUser = (method: 'whatsapp' | 'phone' | 'email' | 'google' | 'guest', credentials?: any) => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    if (method === 'guest') {
      setUser({
        ...INITIAL_USER,
        id: 'usr-guest',
        name: 'Tamu Arjawinangun',
        email: 'tamu@mitraarja.id',
        verificationStatus: 'unverified',
        loyaltyLevel: 'bronze',
        points: 0,
      });
      showToast('Masuk sebagai Tamu. Silakan verifikasi untuk transaksi penuh.');
    } else {
      if (credentials?.name) {
        setUser(prev => ({
          ...prev,
          name: credentials.name,
          phone: credentials.phone || prev.phone,
          email: credentials.email || prev.email,
        }));
      }
      showToast(`Berhasil masuk via ${method.toUpperCase()}!`);
    }
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    showToast('Anda telah keluar dari akun MitraArja.');
  };

  const submitKyc = (docType: 'ktp' | 'sim' | 'paspor', docNumber: string) => {
    setUser(prev => ({
      ...prev,
      kycDocType: docType,
      kycDocNumber: docNumber,
      verificationStatus: 'verified',
      points: prev.points + 50, // Bonus points for verified customer
    }));
    showToast('KYC Berhasil Terverifikasi! Bonus +50 Poin MitraArja');
    setIsKycModalOpen(false);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
    showToast('Profil Anda berhasil diperbarui');
  };

  // Address operations
  const addAddress = (newAddr: Omit<Address, 'id' | 'userId'>) => {
    const address: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      userId: user.id,
    };
    if (address.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(address));
      setSelectedAddress(address);
    } else {
      setAddresses(prev => [...prev, address]);
    }
    showToast('Alamat baru tersimpan');
  };

  const deleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      showToast('Minimal harus ada 1 alamat aktif');
      return;
    }
    const remaining = addresses.filter(a => a.id !== id);
    setAddresses(remaining);
    if (selectedAddress.id === id) {
      setSelectedAddress(remaining[0]);
    }
    showToast('Alamat dihapus');
  };

  // Cart operations
  const cartMerchant = cart.length > 0 
    ? INITIAL_MERCHANTS.find(m => m.id === cart[0].merchantId) || null 
    : null;

  const addToCart = (merchant: Merchant, item: MenuItem, quantity = 1, notes = '') => {
    // If cart has items from another merchant, ask or replace
    if (cart.length > 0 && cart[0].merchantId !== merchant.id) {
      if (confirm(`Ganti pesanan? Keranjang Anda berisi item dari "${cartMerchant?.name}". Ganti dengan item dari "${merchant.name}"?`)) {
        setCart([{
          id: `cart-${Date.now()}`,
          merchantId: merchant.id,
          merchantName: merchant.name,
          item,
          quantity,
          notes,
        }]);
        showToast(`Ditambahkan ke keranjang: ${item.name}`);
      }
      return;
    }

    setCart(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci => ci.item.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci);
      } else {
        return [...prev, {
          id: `cart-${Date.now()}`,
          merchantId: merchant.id,
          merchantName: merchant.name,
          item,
          quantity,
          notes,
        }];
      }
    });
    showToast(`1x ${item.name} masuk keranjang`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.item.id !== itemId));
    showToast('Item dihapus dari keranjang');
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(c => {
        if (c.item.id === itemId) {
          const newQty = c.quantity + delta;
          return newQty > 0 ? { ...c, quantity: newQty } : null;
        }
        return c;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);

  // Orders
  const createOrder = (paymentMethod: any, voucherDiscount = 0, notes = ''): Order => {
    const deliveryFee = cartMerchant?.deliveryFee || 6000;
    const platformFee = 2000;
    const totalAmount = Math.max(0, cartTotal + deliveryFee + platformFee - voucherDiscount);

    const newOrder: Order = {
      id: `ord-arja-${Date.now()}`,
      orderNumber: `MA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceType: cartMerchant?.type || 'food',
      merchantId: cartMerchant?.id,
      merchantName: cartMerchant?.name || 'MitraArja Super Store',
      merchantAddress: cartMerchant?.address || 'Arjawinangun, Cirebon',
      destinationAddress: selectedAddress,
      items: cart.map(c => ({
        id: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity,
        notes: c.notes,
      })),
      subtotal: cartTotal,
      deliveryFee,
      platformFee,
      voucherDiscount,
      totalAmount,
      status: 'merchant_accepted',
      paymentMethod,
      isPaid: paymentMethod === 'mitrapay' || paymentMethod === 'qris' || paymentMethod === 'bank_transfer',
      driver: INITIAL_DRIVER,
      etaMinutes: 20,
      createdAt: new Date().toISOString(),
      notes,
    };

    // If paid by MitraPay, deduct balance
    if (paymentMethod === 'mitrapay') {
      if (walletBalance < totalAmount) {
        showToast('Saldo MitraPay tidak mencukupi');
        throw new Error('Saldo tidak cukup');
      }
      setWalletBalance(prev => prev - totalAmount);
      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'payment',
        amount: -totalAmount,
        title: `Pembayaran ${newOrder.merchantName}`,
        description: `Order #${newOrder.orderNumber}`,
        date: 'Baru saja',
        status: 'success',
        referenceId: `REF-${Date.now()}`,
      };
      setWalletTransactions(prev => [newTx, ...prev]);
    }

    // Award loyalty points: 1 point per Rp 10.000
    const earnedPoints = Math.floor(totalAmount / 10000);
    if (earnedPoints > 0) {
      setUser(prev => ({ ...prev, points: prev.points + earnedPoints }));
    }

    // Update notifications
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'order',
      title: 'Pesanan Berhasil Dibuat!',
      message: `Pesanan #${newOrder.orderNumber} di ${newOrder.merchantName} sedang disiapkan merchant.`,
      timestamp: 'Baru saja',
      isRead: false,
      orderId: newOrder.id,
    };
    setNotifications(prev => [newNotif, ...prev]);

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsTrackingModalOpen(true);
    showToast(`Pesanan #${newOrder.orderNumber} berhasil dibuat!`);

    return newOrder;
  };

  const advanceOrderStatus = (orderId: string) => {
    const statuses: Order['status'][] = [
      'pending',
      'merchant_accepted',
      'driver_assigned',
      'preparing',
      'picked_up',
      'on_delivery',
      'delivered',
      'completed'
    ];

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const currentIndex = statuses.indexOf(o.status);
        if (currentIndex < statuses.length - 1) {
          const nextStatus = statuses[currentIndex + 1];
          const updated = { ...o, status: nextStatus };
          if (activeOrder?.id === orderId) {
            setActiveOrder(updated);
          }
          showToast(`Status Order: ${nextStatus.replace('_', ' ').toUpperCase()}`);
          return updated;
        }
      }
      return o;
    }));
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    if (activeOrder?.id === orderId) {
      setActiveOrder(null);
    }
    showToast('Pesanan telah dibatalkan');
  };

  // Wallet operations
  const topUpWallet = (amount: number, method: string) => {
    setWalletBalance(prev => prev + amount);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'topup',
      amount,
      title: `Top Up Saldo via ${method}`,
      description: `Metode ${method} - Berhasil`,
      date: 'Baru saja',
      status: 'success',
      referenceId: `TOPUP-${Date.now()}`,
    };
    setWalletTransactions(prev => [newTx, ...prev]);
    showToast(`Top Up Rp${amount.toLocaleString('id-ID')} Berhasil!`);
  };

  const transferWallet = (amount: number, recipientPhone: string): boolean => {
    if (walletBalance < amount) {
      showToast('Saldo tidak mencukupi');
      return false;
    }
    setWalletBalance(prev => prev - amount);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'transfer',
      amount: -amount,
      title: `Transfer ke ${recipientPhone}`,
      description: `Transfer sesama MitraPay ke ${recipientPhone}`,
      date: 'Baru saja',
      status: 'success',
      referenceId: `TRF-${Date.now()}`,
    };
    setWalletTransactions(prev => [newTx, ...prev]);
    showToast(`Transfer Rp${amount.toLocaleString('id-ID')} ke ${recipientPhone} Berhasil!`);
    return true;
  };

  // Chat
  const sendChatMessage = (text: string, photoUrl?: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      orderId: activeOrder?.id || 'ord-arja-98421',
      senderType: 'customer',
      senderName: user.name,
      text,
      imageUrl: photoUrl,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      isRead: true,
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Simulated driver auto-response after 1.5s
    setTimeout(() => {
      const driverReplies = [
        'Siap kak, terima kasih informasinya!',
        'Oke kak, saya sudah dekat pertigaan Rawagatel ya.',
        'Baik kak, langsung saya laksanakan.',
        'Sip kak, hati-hati di rumah ya, sebentar lagi sampai.'
      ];
      const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];
      const driverMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        orderId: activeOrder?.id || 'ord-arja-98421',
        senderType: 'driver',
        senderName: INITIAL_DRIVER.name,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        isRead: false,
      };
      setChatMessages(prev => [...prev, driverMsg]);
      showToast(`Pesan baru dari ${INITIAL_DRIVER.name}: "${randomReply.slice(0, 30)}..."`);
    }, 1800);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('Semua notifikasi ditandai dibaca');
  };

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  // Favorites
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Dihapus dari favorit');
        return prev.filter(item => item !== id);
      } else {
        showToast('Ditambahkan ke favorit');
        return [...prev, id];
      }
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  // Complaints
  const createTicket = (category: any, title: string, description: string, orderId?: string) => {
    const newTicket: ComplaintTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-ARJA-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId,
      category,
      title,
      description,
      status: 'open',
      createdAt: 'Baru saja',
    };
    setTickets(prev => [newTicket, ...prev]);
    showToast(`Tiket aduan #${newTicket.ticketNumber} telah dibuat. Tim kami akan merespons max 2 jam.`);
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        isMobileFrame,
        toggleMobileFrame,
        activeTab,
        setActiveTab,
        activeService,
        setActiveService,
        selectedMerchant,
        setSelectedMerchant,
        user,
        isLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginUser,
        logoutUser,
        submitKyc,
        updateUserProfile,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        deleteAddress,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartMerchant,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        createOrder,
        orders,
        activeOrder,
        setActiveOrder,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        advanceOrderStatus,
        cancelOrder,
        walletBalance,
        walletTransactions,
        topUpWallet,
        transferWallet,
        chatMessages,
        sendChatMessage,
        isChatModalOpen,
        setIsChatModalOpen,
        notifications,
        unreadNotifCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        favorites,
        toggleFavorite,
        isFavorite,
        tickets,
        createTicket,
        isEnterpriseHubOpen,
        setIsEnterpriseHubOpen,
        isKycModalOpen,
        setIsKycModalOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
