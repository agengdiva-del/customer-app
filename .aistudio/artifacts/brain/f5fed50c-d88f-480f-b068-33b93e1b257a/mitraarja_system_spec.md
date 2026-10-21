# MitraArja - Hyperlocal Super-App Specification & Architecture

**MitraArja** is a hyperlocal marketplace and delivery platform designed for **Arjawinangun, Kabupaten Cirebon**, and engineered for seamless nationwide expansion. The platform acts as a marketplace facilitator connecting customers, local merchants (UMKM), and independent delivery drivers.

---

## 1. Tech Stack & Architecture

- **Primary Colors**: Brand Green (`#16A34A`), Warm Orange (`#F97316`), Material Design 3 Dark & Light theme
- **Frontend App**: Flutter & Dart (Clean Architecture: Core, Data, Domain, Presentation with BLoC)
- **Web Applet**: React 19 + TypeScript + Tailwind CSS (Vite, Responsive + Mobile Simulator Frame)
- **Backend & Database**: Supabase & PostgreSQL with Row Level Security (RLS) & PostGIS geo-indexing
- **Authentication**: Supabase Auth (WhatsApp OTP, Phone OTP, Email/Password, Google OAuth, Guest Mode)
- **Maps & Telemetry**: Google Maps Platform, Places API, Directions API & Realtime GPS Telemetry
- **Payments**: Midtrans, Xendit, QRIS Nasional, MitraPay In-App Wallet, Bank Virtual Accounts (BCA, BRI, Mandiri), and COD (Cash on Delivery)
- **Notifications**: Firebase Cloud Messaging (FCM) & Realtime In-App Push Updates

---

## 2. 24 Database Tables (Supabase PostgreSQL)

Located at `/src/data/supabase_schema.sql` (and accessible via the in-app **Supabase & Flutter** button):

1. `users` - Core credentials, auth id, phone, email, roles (`customer`, `driver`, `merchant`, `admin`).
2. `customers` - Customer profile, loyalty tier, referral code, KYC status.
3. `customer_addresses` - Multi-address support with Village (Desa), District (Kecamatan), lat/long coordinates, map pins.
4. `merchants` - Stores and eateries in Arjawinangun, verified badges, rating, commissions.
5. `drivers` - Independent courier telemetry, rating, vehicle license plates.
6. `orders` - Order lifecycle, subtotal, delivery fee, platform fee (Rp1.500–Rp2.500), voucher discounts.
7. `order_items` - Item names, unit prices, quantity, customized instructions.
8. `carts` - Customer shopping cart persistence.
9. `payments` - Gateway transactions, QRIS settlement, payment verification.
10. `wallets` - MitraPay wallet balance, security PIN hash, lock status.
11. `wallet_transactions` - Top-up, payments, P2P transfers, cashbacks.
12. `transactions` - Financial commission audits (platform fee, merchant cut, driver cut).
13. `reviews` - 1-5 star ratings, comments, and merchant replies.
14. `complaints` - Customer dispute tickets with tracking status (`open`, `processing`, `resolved`, `closed`).
15. `notifications` - In-app notification center (orders, promos, wallet alerts).
16. `favorites` - Saved stores, favorite dishes, and preferred drivers.
17. `coupons` - Promotional codes.
18. `vouchers` - Discounts (e.g. `ARJAGRATIS`, `DISJUMBO15`, `MITRAPAYHEMAT`).
19. `promotions` - Carousel banners and flash sale marketing.
20. `support_tickets` - Customer care tickets.
21. `referrals` - Referral tracking (100 Poin reward per successful friend signup).
22. `merchant_followers` - Store follower notifications.
23. `search_history` - Search queries and autocomplete caching.
24. `delivery_tracking` - Live driver GPS coordinates, bearing, and speed.
25. `chat_rooms` & `messages` - Realtime chat between Customer, Merchant, and Driver.

---

## 3. Implemented Customer App Features

### 🛍️ Hyperlocal Super-App Services
- **MitraFood**: Authentic Cirebon culinary delights (Nasi Jamblang Mang Dul Daun Jati, Empal Gentong H. Apud, Sate Kambing Muda, Bakso Podomoro Arja, Martabak Bangka).
- **MitraMart**: Fresh vegetables, fruits, shallots, red chilies, and sembako from Pasar Darurat Jungjang Arjawinangun. Includes instant 20-min delivery vs. scheduled morning delivery slots.
- **MitraHealth**: Apotek Sehat Mandiri Arjawinangun with OTC medicines, vitamins, and digital Doctor Prescription Upload.
- **MitraKirim**: Instant on-demand courier package delivery with automatic weight & distance tariff calculator (Tarif dasar Rp8.000 + Rp2.500/km) and restricted items safety checks.
- **MitraPulsa & PPOB**: Mobile credit (Telkomsel, Indosat, XL), PLN Token Listrik with 20-digit token generator, PDAM Tirta Jati Kab. Cirebon, and BPJS.

### 💳 MitraPay & Payments
- Live wallet balance display with 1-click Top Up (BCA, BRI, Mandiri VA, QRIS, Indomaret/Alfamart), P2P Transfers, and Transaction History.
- QRIS interactive scanner & code generation.
- COD (Cash On Delivery) and Bank Virtual Account support.

### 📍 Realtime GPS Order Tracking & In-App Chat
- Hyperlocal vector route map across Arjawinangun (Jl. By Pass, Jl. Fatahillah, Jl. Ki Buyut Rawagatel).
- Moving driver motorcycle icon with live speed and ETA calculation.
- Driver information card (Kang Asep Sunarya, Honda BeAT Plat E 4567 AW, 4.9 rating).
- Realtime bidirectional chat with quick responses ("Saya sudah di depan pagar ya", "Sambal dipisah ya").

### 🏆 Loyalty, KYC & Security
- **MitraLoyal**: Bronze, Silver, Gold, Platinum tier progress (Rp10.000 = 1 Point).
- **Referral Program**: Unique code `ARJAJUARA` with 100 points reward.
- **KYC Verification**: Physical KTP upload & selfie verification with instant status upgrade.
- **Security & Safety**: Two-factor authentication (2FA) toggle, active device session monitoring, and ticket complaints system.
- **View Modes**: Full responsive desktop layout or toggleable Smartphone Frame simulator.
