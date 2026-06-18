-- 1. Tabloları temizleme (CASCADE komutları SQLite'ta desteklenmez, sıralama gözetilerek sildik)
DROP TABLE IF EXISTS booking_services;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS extra_services;
DROP TABLE IF EXISTS villa_tiered_prices;
DROP TABLE IF EXISTS villa_slogans;
DROP TABLE IF EXISTS villa_amenities;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS amenity_categories;
DROP TABLE IF EXISTS villa_images;
DROP TABLE IF EXISTS villas;
DROP TABLE IF EXISTS users;

-- 2. KULLANICILAR TABLOSU
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tc_no TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'host', 'admin')),
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. VİLLALAR / BUNGALOVLAR TABLOSU
CREATE TABLE villas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('all', 'bungalow', 'villa', 'mansion', 'summer_house', 'apartment', 'chalet', 'farmhouse', 'boat')),
    title TEXT NOT NULL,
    region TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    bedrooms INTEGER NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
    bathrooms INTEGER NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
    price_per_night REAL NOT NULL CHECK (price_per_night >= 0),
    description TEXT NOT NULL,
    badge TEXT,
    whatsapp_message TEXT,
    rating REAL DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    host_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    featured_categories TEXT,
    min_nights INTEGER NOT NULL DEFAULT 1 CHECK (min_nights >= 1),
    pre_payment_rate INTEGER DEFAULT 0 CHECK (pre_payment_rate >= 0 AND pre_payment_rate <= 100),
    
    is_boat INTEGER DEFAULT 0,
    boat_type TEXT,
    boat_skipper TEXT,
    boat_concept TEXT,
    boat_port TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. VİLLA GÖRSELLERİ TABLOSU
CREATE TABLE villa_images (
    id TEXT PRIMARY KEY,
    villa_id TEXT NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'dis' CHECK (category IN ('vitrin', 'dis', 'ic', 'hizmet')),
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. DONANIM / ÖZELLİK KATEGORİSİ TABLOSU
CREATE TABLE amenity_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- 6. DONANIMLAR/İMKANLAR TABLOSU
CREATE TABLE amenities (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES amenity_categories(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    icon TEXT NOT NULL
);

-- 7. VİLLA - DONANIM JUNCTION
CREATE TABLE villa_amenities (
    villa_id TEXT NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    amenity_id TEXT NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (villa_id, amenity_id)
);

-- 8. VİLLA SLOGANLARI TABLOSU
CREATE TABLE villa_slogans (
    villa_id TEXT NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    slogan_id TEXT NOT NULL,
    PRIMARY KEY (villa_id, slogan_id)
);

-- 9. DÖNEMSEL KADEMELİ FİYATLAR TABLOSU
CREATE TABLE villa_tiered_prices (
    id TEXT PRIMARY KEY,
    villa_id TEXT NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    price REAL NOT NULL CHECK (price >= 0),
    CONSTRAINT chk_tiered_dates CHECK (start_date <= end_date)
);

-- 10. EKSTRA HİZMETLER TABLOSU
CREATE TABLE extra_services (
    id TEXT PRIMARY KEY,
    villa_id TEXT REFERENCES villas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price REAL NOT NULL CHECK (price >= 0),
    type TEXT NOT NULL CHECK (type IN ('per_person_daily', 'per_person_flat', 'flat'))
);

-- 11. KAMPANYA VE PROMOSYON KODLARI TABLOSU
CREATE TABLE campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value REAL NOT NULL CHECK (discount_value >= 0),
    target_villa_id TEXT REFERENCES villas(id) ON DELETE CASCADE,
    is_active INTEGER NOT NULL DEFAULT 1,
    start_date TEXT,
    end_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. REZERVASYONLAR TABLOSU
CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    villa_id TEXT NOT NULL REFERENCES villas(id) ON DELETE RESTRICT,
    guest_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    guests_count INTEGER NOT NULL CHECK (guests_count > 0),
    total_days INTEGER NOT NULL CHECK (total_days > 0),
    total_price REAL NOT NULL CHECK (total_price >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_booking_dates CHECK (check_in < check_out)
);

-- 13. REZERVASYONA SEÇİLEN EKSTRA HİZMETLER TABLOSU
CREATE TABLE booking_services (
    booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL REFERENCES extra_services(id) ON DELETE RESTRICT,
    unit_price REAL NOT NULL CHECK (unit_price >= 0),
    PRIMARY KEY (booking_id, service_id)
);

-- İNDEKSLER
CREATE INDEX idx_villas_region ON villas(region);
CREATE INDEX idx_villas_type ON villas(type);
CREATE INDEX idx_villa_images_villa ON villa_images(villa_id);
CREATE INDEX idx_villa_tiered_prices_dates ON villa_tiered_prices(villa_id, start_date, end_date);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_campaigns_code ON campaigns(code) WHERE is_active = 1;
