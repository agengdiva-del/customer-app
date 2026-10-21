-- =========================================================
-- MITRAARJA HYPERLOCAL MARKETPLACE & DELIVERY PLATFORM
-- Production-Ready Supabase PostgreSQL Database Schema
-- Target: Arjawinangun, Cirebon & Nationwide Expansion
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. USERS TABLE (Auth integration)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supabase_auth_id UUID UNIQUE,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'driver', 'merchant', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CUSTOMERS TABLE (Profile & KYC)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    verification_status VARCHAR(30) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'partially_verified', 'verified')),
    kyc_id_type VARCHAR(20) CHECK (kyc_id_type IN ('ktp', 'sim', 'paspor')),
    kyc_id_number VARCHAR(50),
    kyc_id_photo_url TEXT,
    kyc_selfie_url TEXT,
    loyalty_level VARCHAR(20) DEFAULT 'bronze' CHECK (loyalty_level IN ('bronze', 'silver', 'gold', 'platinum')),
    loyalty_points INTEGER DEFAULT 0,
    referral_code VARCHAR(20) UNIQUE,
    referred_by_code VARCHAR(20),
    account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'warning', 'suspended', 'blocked')),
    block_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CUSTOMER_ADDRESSES TABLE (Multi-address support)
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    label VARCHAR(50) NOT NULL, -- e.g., 'Rumah', 'Kantor', 'Kost'
    recipient_name VARCHAR(150) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    street_address TEXT NOT NULL,
    village VARCHAR(100) NOT NULL, -- Kelurahan / Desa (e.g. Jungjang, Tegalgubug)
    district VARCHAR(100) NOT NULL, -- Kecamatan (e.g. Arjawinangun)
    city VARCHAR(100) NOT NULL DEFAULT 'Cirebon',
    province VARCHAR(100) NOT NULL DEFAULT 'Jawa Barat',
    postal_code VARCHAR(10),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    notes TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MERCHANTS TABLE
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    tagline VARCHAR(255),
    service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('food', 'grocery', 'pharmacy', 'courier', 'pulsa', 'bills', 'umkm')),
    category VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    is_open BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    total_reviews INTEGER DEFAULT 0,
    banner_url TEXT,
    logo_url TEXT,
    commission_rate NUMERIC(5, 2) DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(30) DEFAULT 'motorcycle',
    vehicle_model VARCHAR(100),
    vehicle_plate VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    total_trips INTEGER DEFAULT 0,
    current_lat NUMERIC(10, 7),
    current_lng NUMERIC(10, 7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDERS TABLE
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
    notes TEXT,
    eta_minutes INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(12, 2) NOT NULL,
    item_notes TEXT
);

-- 8. CARTS TABLE
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id),
    product_id VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    special_notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) NOT NULL,
    payment_gateway VARCHAR(30) DEFAULT 'midtrans', -- 'midtrans', 'xendit', 'qris'
    payment_method VARCHAR(30) NOT NULL,
    transaction_id VARCHAR(100),
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'settlement', 'expire', 'cancel', 'failed')),
    raw_response JSONB,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. WALLETS TABLE (MitraPay)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE UNIQUE NOT NULL,
    balance NUMERIC(14, 2) DEFAULT 0.00 NOT NULL CHECK (balance >= 0),
    pin_hash VARCHAR(255),
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. WALLET_TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('topup', 'payment', 'transfer', 'refund', 'cashback')),
    amount NUMERIC(12, 2) NOT NULL,
    description TEXT NOT NULL,
    reference_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. TRANSACTIONS TABLE (Audit log)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id),
    customer_id UUID REFERENCES public.customers(id),
    merchant_id UUID REFERENCES public.merchants(id),
    driver_id UUID REFERENCES public.drivers(id),
    gross_amount NUMERIC(12, 2) NOT NULL,
    platform_cut NUMERIC(12, 2) NOT NULL,
    merchant_cut NUMERIC(12, 2) NOT NULL,
    driver_cut NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id),
    driver_id UUID REFERENCES public.drivers(id),
    merchant_rating SMALLINT CHECK (merchant_rating BETWEEN 1 AND 5),
    merchant_review TEXT,
    driver_rating SMALLINT CHECK (driver_rating BETWEEN 1 AND 5),
    driver_review TEXT,
    photos TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. COMPLAINTS TABLE (Support & Dispute)
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_code VARCHAR(30) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) NOT NULL,
    order_id UUID REFERENCES public.orders(id),
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open', 'processing', 'resolved', 'closed')),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('merchant', 'product', 'driver')),
    entity_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(customer_id, entity_type, entity_id)
);

-- 17. COUPONS & 18. VOUCHERS TABLE
CREATE TABLE IF NOT EXISTS public.vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(12, 2) NOT NULL,
    min_order_amount NUMERIC(12, 2) DEFAULT 0,
    max_discount NUMERIC(12, 2),
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    quota INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT true
);

-- 19. PROMOTIONS TABLE
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    banner_url TEXT NOT NULL,
    title VARCHAR(150) NOT NULL,
    subtitle TEXT,
    target_service VARCHAR(30),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 20. SUPPORT_TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 21. REFERRALS TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES public.customers(id) NOT NULL,
    referee_id UUID REFERENCES public.customers(id) NOT NULL UNIQUE,
    reward_points INTEGER DEFAULT 100,
    is_rewarded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 22. MERCHANT_FOLLOWERS TABLE
CREATE TABLE IF NOT EXISTS public.merchant_followers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(customer_id, merchant_id)
);

-- 23. SEARCH_HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    query TEXT NOT NULL,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 24. DELIVERY_TRACKING TABLE (Real-time telemetry)
CREATE TABLE IF NOT EXISTS public.delivery_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES public.drivers(id) NOT NULL,
    current_lat NUMERIC(10, 7) NOT NULL,
    current_lng NUMERIC(10, 7) NOT NULL,
    bearing NUMERIC(5, 2),
    speed_kmh NUMERIC(5, 2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 25. CHAT_ROOMS & 26. MESSAGES TABLE (Real-time in-app communication)
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) NOT NULL,
    counterpart_type VARCHAR(20) NOT NULL CHECK (counterpart_type IN ('driver', 'merchant')),
    counterpart_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'driver', 'merchant')),
    sender_id UUID NOT NULL,
    message_text TEXT NOT NULL,
    photo_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR HYPERLOCAL QUERIES
CREATE INDEX IF NOT EXISTS idx_merchants_service ON public.merchants(service_type);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_order ON public.delivery_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_room ON public.messages(chat_room_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own profile"
    ON public.customers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Customers can view their own orders"
    ON public.orders FOR SELECT
    USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

CREATE POLICY "Customers can view their own wallet"
    ON public.wallets FOR SELECT
    USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));
