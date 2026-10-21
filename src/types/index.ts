export type ServiceType = 
  | 'food' 
  | 'grocery' 
  | 'pharmacy' 
  | 'courier' 
  | 'pulsa' 
  | 'bills' 
  | 'umkm';

export type VerificationStatus = 'unverified' | 'partially_verified' | 'verified';

export type OrderStatus = 
  | 'pending' 
  | 'merchant_accepted' 
  | 'driver_assigned' 
  | 'preparing' 
  | 'picked_up' 
  | 'on_delivery' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled';

export type PaymentMethod = 'mitrapay' | 'qris' | 'bank_transfer' | 'cod' | 'ewallet';

export type LoyaltyLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  verificationStatus: VerificationStatus;
  kycDocType?: 'ktp' | 'sim' | 'paspor';
  kycDocNumber?: string;
  kycDocImage?: string;
  kycSelfieImage?: string;
  loyaltyLevel: LoyaltyLevel;
  points: number;
  referralCode: string;
  referralCount: number;
  twoFactorEnabled: boolean;
  isBlocked?: boolean;
  blockReason?: string;
}

export interface Address {
  id: string;
  userId: string;
  label: 'Rumah' | 'Kantor' | 'Kost' | 'Lainnya';
  recipientName: string;
  phone: string;
  streetAddress: string;
  village: string; // Kelurahan / Desa (e.g., Jungjang, Tegalgubug)
  district: string; // Kecamatan (Arjawinangun)
  city: string; // Cirebon
  province: string; // Jawa Barat
  postalCode: string;
  latitude: number;
  longitude: number;
  notes?: string;
  isDefault: boolean;
}

export interface MenuItem {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  isPopular?: boolean;
  needsPrescription?: boolean;
}

export interface Merchant {
  id: string;
  name: string;
  tagline: string;
  type: ServiceType;
  category: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  deliveryTimeMin: number;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  bannerUrl: string;
  logoUrl: string;
  address: string;
  isVerified: boolean;
  menu: MenuItem[];
}

export interface CartItem {
  id: string;
  merchantId: string;
  merchantName: string;
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleModel: string;
  vehiclePlate: string;
  rating: number;
  totalTrips: number;
  avatarUrl: string;
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  serviceType: ServiceType;
  merchantId?: string;
  merchantName: string;
  merchantAddress?: string;
  destinationAddress: Address;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  voucherDiscount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  driver?: Driver;
  etaMinutes: number;
  createdAt: string;
  notes?: string;
  // Courier specific fields
  packageDetails?: {
    category: string;
    description: string;
    weightKg: number;
    senderName: string;
    senderPhone: string;
  };
}

export interface WalletTransaction {
  id: string;
  type: 'topup' | 'payment' | 'transfer' | 'refund' | 'cashback';
  amount: number;
  title: string;
  description: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
  referenceId: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderType: 'customer' | 'driver' | 'merchant';
  senderName: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  isRead: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'order' | 'promo' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  orderId?: string;
}

export interface ComplaintTicket {
  id: string;
  ticketNumber: string;
  orderId?: string;
  category: 'Masalah Pesanan' | 'Kendala Pengantaran' | 'Kendala Pembayaran' | 'Permintaan Refund' | 'Akun' | 'Lainnya';
  title: string;
  description: string;
  status: 'open' | 'processing' | 'resolved' | 'closed';
  createdAt: string;
  resolutionNote?: string;
}

export interface Review {
  id: string;
  orderId: string;
  merchantId?: string;
  merchantRating: number;
  merchantComment: string;
  driverRating: number;
  driverComment: string;
  createdAt: string;
}
