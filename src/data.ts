export interface ExtraService {
  id: string;
  name: string;
  price: number;
  type: 'per_person_daily' | 'per_person_flat' | 'flat';
}

export interface Villa {
  id: string;
  name: string;
  type: 'all' | 'bungalow' | 'villa' | 'mansion' | 'summer_house' | 'apartment' | 'chalet' | 'farmhouse' | 'boat';
  title: string;
  region: 'İstanbul' | 'Bursa' | 'Balıkesir' | 'Yalova' | 'Sakarya' | 'Kocaeli' | 'Tekirdağ' | 'Çanakkale' | 'Kırklareli' | 'Edirne';
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  pricePerNight: number;
  features: string[]; // heated_pool, jacuzzi, fireplace, lake_view, pet_friendly, garden, barbeque, wifi
  images: string[];
  description: string;
  badge?: string;
  whatsappMessage: string;
  rating: number;
  reviewCount: number;
  hostName: string;
  hostAvatar: string;
  minNights: number;
  extraServices: ExtraService[];
  slogans?: string[];      // Host-selected custom slogans (max 4)
  catFeatures?: string[];  // Host-selected rich categorized amenities
  prePaymentRate?: number; // Advance installment rate requested by host (0 - 40)
  isBoat?: boolean;        // If flagged as custom boat
  boatDetails?: {
    boatType?: string;     // e.g. "Yelkenli", "Katamaran", "Motoryat", "Gulet"
    skipper?: string;      // e.g. "Kaptanlı", "Kaptansız (Ehliyet Gerekli)"
    concept?: string;      // e.g. "Haftalık Seyir", "Günlük Koy Gezisi"
    port?: string;         // e.g. "Bodrum Marina", "Marmaris Limanı"
  };
  classifiedImages?: Array<{ id: string; url: string; name: string; category: 'vitrin' | 'dis' | 'ic' | 'hizmet' }>;
  kademeliFiyatlar?: TieredPrice[];
}

export interface TieredPrice {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  price: number;
}

export function getVillaPricePerNightForDisplay(villa: Villa, checkIn?: string, checkOut?: string): number {
  if (checkIn && checkOut) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = outDate.getTime() - inDate.getTime();
    if (diff > 0) {
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      let total = 0;
      for (let i = 0; i < days; i++) {
        const nightDate = new Date(inDate.getTime());
        nightDate.setDate(inDate.getDate() + i);
        const yyyy = nightDate.getFullYear();
        const mm = String(nightDate.getMonth() + 1).padStart(2, "0");
        const dd = String(nightDate.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;
        let activePrice = villa.pricePerNight;
        if (villa.kademeliFiyatlar && villa.kademeliFiyatlar.length > 0) {
          const matchingTier = villa.kademeliFiyatlar.find(
            (tier) => dateStr >= tier.startDate && dateStr <= tier.endDate
          );
          if (matchingTier) {
            activePrice = matchingTier.price;
          }
        }
        total += activePrice;
      }
      return Math.round(total / days);
    }
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;
  
  if (villa.kademeliFiyatlar && villa.kademeliFiyatlar.length > 0) {
    const matchingTier = villa.kademeliFiyatlar.find(
      (tier) => dateStr >= tier.startDate && dateStr <= tier.endDate
    );
    if (matchingTier) {
      return matchingTier.price;
    }
  }

  return villa.pricePerNight;
}

export interface SloganItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export const VILLA_TYPES_MAP: Record<string, { label: string; icon: string }> = {
  all: { label: 'Tüm Konut Tipleri', icon: '🏘️' },
  villa: { label: 'Lüks Villa', icon: '🏡' },
  bungalow: { label: 'Bungalov', icon: '🏠' },
  mansion: { label: 'Müstakil Ev', icon: '🏰' },
  summer_house: { label: 'Yazlık', icon: '🏖️' },
  apartment: { label: 'Daire', icon: '🏢' },
  chalet: { label: 'Dağ Evi', icon: '🍇' },
  farmhouse: { label: 'Çiftlik Evi', icon: '🐄' },
  boat: { label: 'Tekne / Yat', icon: '⛵' }
};

export const AVAILABLE_SLOGANS: SloganItem[] = [
  { id: 'entry', title: 'Hızlı ve kolay giriş deneyimi', desc: 'Misafirlerimiz giriş sürecini kusursuz ve hızlı olarak değerlendirdi.', icon: '🗝️' },
  { id: 'outdoor', title: 'İzole bahçe ve açık havuz keyfi', desc: 'Özel havuz, şezlonglar, mangal alanı ve geniş çim bahçe tamamen size aittir.', icon: '🏊‍♂️' },
  { id: 'peaceful', title: 'Doğa içinde huzurlu ve sessiz', desc: 'Şehir gürültüsünden uzak, kuş sesleri ve doğayla baş başa bir tatil vadediyor.', icon: '🕊️' },
  { id: 'top5', title: 'En yüksek memnuniyet oranı (%5)', desc: 'İletişim, konfor ve temizlik puanıyla platformun en başarılı mülkleri arasındadır.', icon: '🏆' },
  { id: 'heated_pool', title: 'Isıtmalı havuz kalitesi', desc: 'Özel ısıtmalı havuz sistemiyle soğuk mevsimlerde de yüzme keyfini dilediğiniz gibi sürebilirsiniz.', icon: '♨️' },
  { id: 'clean', title: 'Steril ve hijyen garantisi', desc: 'Her misafir değişimi öncesi profesyonel ekiplerce detaylıca dezenfekte edilmektedir.', icon: '🧹' },
  { id: 'patio', title: 'Harika teras ve manzara açısı', desc: 'Enfes gün batımı ve doğa manzarasını keyifli geniş terasımızda seyredebilirsiniz.', icon: '🌅' },
  { id: 'barbecue', title: 'Zengin barbekü ve mangal alanı', desc: 'Bahçede özel ızgara donanımları ile aileniz veya grubunuzla ziyafet yaşayabilirsiniz.', icon: '🍖' }
];

export interface AmenityItem {
  id: string;
  label: string;
  icon: string;
}

export interface AmenityCategory {
  category: string;
  items: AmenityItem[];
}

export const CATEGORIZED_AMENITIES: AmenityCategory[] = [
  {
    category: 'Muhteşem manzaralar',
    items: [
      { id: 'view_mountain', label: 'Dağ manzarası', icon: '⛰️' },
      { id: 'view_city', label: 'Şehir silüeti manzarası', icon: '🏙️' },
      { id: 'view_lake', label: 'Göl manzarası', icon: '🌅' },
      { id: 'view_garden', label: 'Bahçe manzarası', icon: '🏡' }
    ]
  },
  {
    category: 'Banyo',
    items: [
      { id: 'bath_hairdryer', label: 'Saç kurutma makinesi', icon: '💨' },
      { id: 'bath_cleaning', label: 'Temizlik ürünleri', icon: '🧼' },
      { id: 'bath_shampoo', label: 'Şampuan', icon: '🧴' },
      { id: 'bath_conditioner', label: 'Saç kremi', icon: '🧴' },
      { id: 'bath_soap', label: 'Vücut sabunu', icon: '🧼' },
      { id: 'bath_hotwater', label: 'Sıcak su', icon: '♨️' },
      { id: 'bath_showergel', label: 'Duş jeli', icon: '🧴' }
    ]
  },
  {
    category: 'Yatak odası ve çamaşırlar',
    items: [
      { id: 'bed_washer', label: 'Konutta çamaşır makinesi (Ücretsiz)', icon: '🧺' },
      { id: 'bed_essentials', label: 'Temel malzeme (Havlular, nevresimler, sabun ve tuvalet kağıdı)', icon: '🧻' },
      { id: 'bed_hangers', label: 'Elbise askıları', icon: '🧥' },
      { id: 'bed_sheets', label: 'Yatak çarşafları', icon: '🛏️' },
      { id: 'bed_cotton', label: 'Pamuk nevresimler', icon: '🛏️' },
      { id: 'bed_extra', label: 'Fazladan yastık ve battaniye', icon: '🛌' },
      { id: 'bed_blackout', label: 'Işık geçirmez stor perdeler', icon: '🕶️' },
      { id: 'bed_iron', label: 'Ütü', icon: '🔌' },
      { id: 'bed_rack', label: 'Çamaşır asma yeri', icon: '👚' },
      { id: 'bed_net', label: 'Sineklik', icon: '🦟' },
      { id: 'bed_closet', label: 'Giysi saklamak için alan: giysi dolabı ve şifonyer', icon: '👗' }
    ]
  },
  {
    category: 'Eğlence',
    items: [
      { id: 'ent_ethernet', label: 'Ethernet bağlantısı', icon: '🔌' },
      { id: 'ent_hdtv', label: 'HDTV ve Disney+, Netflix', icon: '📺' },
      { id: 'ent_books', label: 'Kitaplar ve okunacak şeyler', icon: '📚' },
      { id: 'ent_skate', label: 'Kaykay rampası', icon: '🛹' }
    ]
  },
  {
    category: 'Aile',
    items: [
      { id: 'fam_crib', label: 'Beşik (Standart 130 cm uzunluğunda x 71 cm genişliğinde)', icon: '👶' },
      { id: 'fam_travel', label: 'Park yatak/seyahat beşiği - istek üzerine temin edilebilir', icon: '🛄' },
      { id: 'fam_curtain', label: 'Çarşaf dâhil, işık geçirmez stor perdeler', icon: '🕶️' },
      { id: 'fam_guard', label: 'Şömine siperliği', icon: '🔥' },
      { id: 'fam_table', label: 'Sehpa köşelerinde koruyucu', icon: '🛡️' }
    ]
  },
  {
    category: 'Isıtma ve soğutma',
    items: [
      { id: 'temp_ac', label: 'Klima', icon: '❄️' },
      { id: 'temp_fireplace', label: 'İç mekânda şömine', icon: '🔥' },
      { id: 'temp_ceiling', label: 'Tavan pervanesi', icon: '🌀' },
      { id: 'temp_portable', label: 'Taşınabilir vantilatör', icon: '🌀' },
      { id: 'temp_central', label: 'Merkezî ısıtma', icon: '♨️' }
    ]
  },
  {
    category: 'Ev güvenliği',
    items: [
      { id: 'safe_outcameras', label: 'Mülkün dış mekânında güvenlik kameraları', icon: '📹' },
      { id: 'safe_parkcameras', label: 'Otopark kamera bulunmaktadır', icon: '📹' },
      { id: 'safe_smoke', label: 'Duman dedektörü', icon: '🔔' },
      { id: 'safe_co', label: 'Karbonmonoksit alarmı', icon: '🔔' },
      { id: 'safe_ext', label: 'Yangın söndürücü', icon: '🧯' },
      { id: 'safe_firstaid', label: 'İlk yardım çantası', icon: '🏥' }
    ]
  },
  {
    category: 'İnternet ve ofis',
    items: [
      { id: 'net_wifi', label: 'Wifi', icon: '📶' },
      { id: 'net_work', label: 'Özel çalışma alanı', icon: '💻' },
      { id: 'net_mobile', label: 'Mobil wifi', icon: '📶' }
    ]
  },
  {
    category: 'Mutfak ve yemek',
    items: [
      { id: 'kit_kitchen', label: 'Mutfak (Misafirlerin kendi yemeklerini pişirebileceği alan)', icon: '🍳' },
      { id: 'kit_fridge', label: 'Buzdolabı', icon: '🧊' },
      { id: 'kit_micro', label: 'Mikrodalga fırın', icon: '📟' },
      { id: 'kit_basics', label: 'Yemek pişirmek için temel malzemeler (Tencere ve tava, yağ, tuz, biber)', icon: '🍳' },
      { id: 'kit_dinnerware', label: 'Yemek ve çatal bıçak takımı (Kâseler, yemek çubukları, tabaklar, fincanlar vb.)', icon: '🍽️' },
      { id: 'kit_minifridge', label: 'Mini buzdolabı', icon: '🧊' },
      { id: 'kit_freezer', label: 'Dondurucu', icon: '🧊' },
      { id: 'kit_dish', label: 'Bulaşık makinesi', icon: '🧼' },
      { id: 'kit_stove', label: 'Ocak', icon: '🔥' },
      { id: 'kit_oven', label: 'Fırın', icon: '♨️' },
      { id: 'kit_kettle', label: 'Su ısıtıcısı', icon: '🫖' },
      { id: 'kit_coffee', label: 'Kahve makinesi', icon: '☕' },
      { id: 'kit_toaster', label: 'Ekmek kızartma makinesi', icon: '🍞' },
      { id: 'kit_tray', label: 'Fırın tepsisi', icon: '🥮' },
      { id: 'kit_blender', label: 'Karıştırıcı', icon: '🌀' },
      { id: 'kit_rice', label: 'Pilav yapma makinesi', icon: '🍚' },
      { id: 'kit_trash', label: 'Çöp sıkıştırıcısı', icon: '🗑️' },
      { id: 'kit_bbq_util', label: 'Mangal malzemeleri (Mangal, kömür vb.)', icon: '🪵' },
      { id: 'kit_table', label: 'Yemek masası', icon: '🪑' },
      { id: 'kit_coffee_beans', label: 'Kahve', icon: '☕' },
      { id: 'kit_bread', label: 'Ekmek makinesi', icon: '🍞' }
    ]
  },
  {
    category: 'Konum özellikleri',
    items: [
      { id: 'loc_lake', label: 'Göle erişim (Misafirler bir yoldan veya rıhtımdan geçerek göle gidebilir)', icon: '🌊' },
      { id: 'loc_entrance', label: 'Özel giriş (Ayrı bir cadde veya bina girişi)', icon: '🚪' },
      { id: 'loc_laundry', label: 'Yakınlarda çamaşırhane', icon: '🧺' },
      { id: 'loc_resort', label: 'Tatil köyü erişimi (Misafirler yakındaki tatil köyünün tesislerini kullanabilir)', icon: '🏖️' }
    ]
  },
  {
    category: 'Dış mekân',
    items: [
      { id: 'out_balcony', label: 'Veranda veya balkon', icon: '🪵' },
      { id: 'out_backyard', label: 'Özel arka bahçe - Tamamen çitle çevrili', icon: '🌳' },
      { id: 'out_lawn', label: 'Mekânda, genellikle çimle kaplı olan açık alan', icon: '🌿' },
      { id: 'out_fireplace', label: 'Bahçe şöminesi', icon: '🔥' },
      { id: 'out_furniture', label: 'Bahçe mobilyaları', icon: '🪑' },
      { id: 'out_hammock', label: 'Hamak', icon: '🛌' },
      { id: 'out_dining', label: 'Açık havada yemek alanı', icon: '🍽️' },
      { id: 'out_kitchen', label: 'Özel açık hava mutfağı', icon: '🍳' },
      { id: 'out_barbeque', label: 'Barbekü', icon: '🍖' },
      { id: 'out_beach_util', label: 'Plaj için gerekli eşyalar (Plaj havluları, şemsiye, plaj battaniyesi)', icon: '🏖️' },
      { id: 'out_beds', label: 'Şezlonglar', icon: '🪑' }
    ]
  },
  {
    category: 'Otopark ve imkânlar',
    items: [
      { id: 'park_free_prem', label: 'Mülk içinde ücretsiz otopark', icon: '🚗' },
      { id: 'park_free_street', label: 'Sokakta ücretsiz otopark', icon: '🚗' },
      { id: 'park_pool', label: 'Özel açık havuz - tüm yıl kullanılabilir, 24 saat açık, ısıtmalı', icon: '🏊‍♂️' },
      { id: 'park_jacuzzi', label: 'Özel jakuzi - tüm yıl kullanılabilir, 24 saat açık', icon: '🛁' },
      { id: 'park_paid_off', label: 'Bina dışında ücretli park yeri', icon: '🅿️' },
      { id: 'park_paid_on', label: 'Mülkte ücretli otopark', icon: '🅿️' }
    ]
  },
  {
    category: 'Hizmetler',
    items: [
      { id: 'srv_pet', label: 'Evcil hayvan kabul edilir (Rehber hayvanlara her zaman izin verilir)', icon: '🐶' },
      { id: 'srv_luggage', label: 'Bavul bırakmaya izin veriliyor (Erken gelen veya geç ayrılan misafirler için)', icon: '🧳' },
      { id: 'srv_breakfast', label: 'Kahvaltı (Kahvaltı sunulur)', icon: '🥞' },
      { id: 'srv_smoking', label: 'Sigara içilebilir', icon: '🚬' },
      { id: 'srv_longterm', label: 'Uzun süreli konaklamalara izin veriliyor (28 gün veya daha uzun süreli konaklamalara izin verilir)', icon: '📅' },
      { id: 'srv_self', label: 'Kendi kendine giriş (Kilitli kutu)', icon: '🔑' },
      { id: 'srv_cleaning', label: 'Konaklama sırasında temizlik yapılabilir', icon: '🧹' },
      { id: 'srv_greet', label: 'İlan sahibi sizi karşılar', icon: '👋' }
    ]
  }
];

export function getVillaSlug(name: string, region: string): string {
  const text = `${name}-${region}`;
  const map: Record<string, string> = {
    'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'I': 'I', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U'
  };
  let cleaned = text.split('').map(char => map[char] || char).join('');
  cleaned = cleaned.replace(/[^a-zA-Z0-9\s\-_()]/g, '');
  cleaned = cleaned.replace(/[\s\-_()]+/g, '-');
  cleaned = cleaned.replace(/^-+|-+$/g, '');
  return `/${cleaned}/`.toLowerCase();
}

export const REGIONS_MAP: Record<string, { name: string; icon: string }> = {
  'Hepsi': { name: 'Tüm Şehirler', icon: '🌍' },
  'İstanbul': { name: 'İstanbul', icon: '🏛️' },
  'Bursa': { name: 'Bursa', icon: '🏔️' },
  'Balıkesir': { name: 'Balıkesir', icon: '🏖️' },
  'Yalova': { name: 'Yalova', icon: '🌊' },
  'Sakarya': { name: 'Sakarya', icon: '🌲' },
  'Kocaeli': { name: 'Kocaeli', icon: '🏭' },
  'Tekirdağ': { name: 'Tekirdağ', icon: '🍇' },
  'Çanakkale': { name: 'Çanakkale', icon: '⚓' },
  'Kırklareli': { name: 'Kırklareli', icon: '🌳' },
  'Edirne': { name: 'Edirne', icon: '🕌' }
};

export const REGIONS = [
  'Hepsi',
  'İstanbul',
  'Bursa',
  'Balıkesir',
  'Yalova',
  'Sakarya',
  'Kocaeli',
  'Tekirdağ',
  'Çanakkale',
  'Kırklareli',
  'Edirne'
] as const;

export const ALL_EXTRA_SERVICES: ExtraService[] = [
  { id: 'breakfast', name: 'Zengin Serpme Köy Kahvaltısı', price: 400, type: 'per_person_daily' },
  { id: 'dinner', name: 'Akşam Yemeği Izgara Menüsü', price: 800, type: 'per_person_daily' },
  { id: 'nature_tour', name: 'Rehberli Doğa ve Orman Yürüyüşü', price: 750, type: 'per_person_flat' },
  { id: 'boat_tour', name: 'Göl/Deniz Özel Yat Gezisi (1 Saat)', price: 4500, type: 'flat' }
];

export const VILLA_DATA: Villa[] = [
  {
    id: 'sapanca-dome',
    name: 'Sapanca Glass Dome',
    type: 'bungalow',
    title: 'Isıtmalı Havuzlu Lüks Glamping Dome',
    region: 'Sakarya',
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 5200,
    features: ['heated_pool', 'jacuzzi', 'fireplace', 'lake_view', 'garden', 'barbeque', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1629812456605-4a044aa38fbc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Doğa manzarasına hakim, yemyeşil özel bahçe içerisinde konumlanmış lüks cam kubbe (dome) bungalovumuz. Özel ısıtmalı havuz, jakuzi, şömine sobası ve açık hava barbekü alanı ile çiftler için rüya gibi bir balayı ve baş başa tatil imkanı sunmaktadır.',
    badge: 'Popüler & Balayı',
    whatsappMessage: 'Merhaba! Web sitenizden Sapanca Glass Dome için bilgi/rezervasyon talep etmek istiyorum.',
    rating: 4.96,
    reviewCount: 42,
    hostName: 'Seda Hanım',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    minNights: 2,
    extraServices: [
      { id: 'breakfast', name: 'Zengin Serpme Köy Kahvaltısı', price: 450, type: 'per_person_daily' }
    ],
    slogans: ['entry', 'outdoor', 'peaceful']
  },
  {
    id: 'kirkpinar-nest',
    name: 'Kırkpınar Family Villa',
    type: 'villa',
    title: 'Geniş Aileler İçin Müstakil Havuzlu Lüks Villa',
    region: 'Sakarya',
    capacity: 8,
    bedrooms: 4,
    bathrooms: 3,
    pricePerNight: 12500,
    features: ['heated_pool', 'fireplace', 'garden', 'barbeque', 'wifi', 'pet_friendly'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Doğayla iç içe, 4 yatak odalı ve 8 kişi kapasiteli ultra lüks müstakil villa. Isıtmalı geniş yüzme havuzu, çocuk oyun alanı, geniş barbekü verandası ve tam donanımlı mutfağı ile kalabalık aileler veya arkadaş grupları için mükemmel bir korunaklı tatil seçeneğidir.',
    badge: 'Lüks & Müstakil',
    whatsappMessage: 'Merhaba! Web sitenizden Kırkpınar Family Villa için bilgi/rezervasyon talep etmek istiyorum.',
    rating: 4.88,
    reviewCount: 29,
    hostName: 'Meliha Demir',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    minNights: 4,
    extraServices: [
      { id: 'breakfast', name: 'VIP Kahvaltı Servisi', price: 400, type: 'per_person_daily' }
    ],
    slogans: ['outdoor', 'top5', 'clean']
  },
  {
    id: 'bosphorus-princess-cat',
    name: 'Princess Azure Katamaran',
    type: 'boat',
    title: 'Boğaz sularında Kaptanlı Ultra Lüks Katamaran Deneyimi',
    region: 'İstanbul',
    capacity: 12,
    bedrooms: 3,
    bathrooms: 2,
    pricePerNight: 18500,
    features: ['wifi', 'jacuzzi', 'lake_view'],
    images: [
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'İstanbul sularında tamamen izole bir tatil arzulayanlar için tasarlanmış, profesyonel mürettebatlı ve kaptanlı katamaran. Jakuzi, geniş kıç güverte, flybridge ve su sporları ekipmanları mevcuttur.',
    badge: 'Yüzer Havuz & VIP',
    whatsappMessage: 'Merhaba! Web sitenizden Princess Azure Katamaran için rezervasyon sormak istiyorum.',
    rating: 5.0,
    reviewCount: 16,
    hostName: 'Hakan Kaptan',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    minNights: 1,
    extraServices: [
      { id: 'dinner', name: 'Yat Aşçısı Akşam Yemeği Menüsü', price: 1500, type: 'per_person_daily' }
    ],
    slogans: ['entry', 'top5', 'patio'],
    isBoat: true,
    boatDetails: {
      boatType: 'Katamaran',
      skipper: 'Kaptanlı & Mürettebatlı',
      concept: 'Haftalık/Günlük Özel Seyir',
      port: 'Kuruçeşme Marinası, İstanbul'
    }
  },
  {
    id: 'bursa-snowy-chalet',
    name: 'Uludağ Snowy Chalet',
    type: 'chalet',
    title: 'Şömineli ve Jakuzili Lüks Dağ Evi',
    region: 'Bursa',
    capacity: 6,
    bedrooms: 3,
    bathrooms: 2,
    pricePerNight: 9500,
    features: ['fireplace', 'jacuzzi', 'garden', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Uludağ eteklerinde, bembeyaz çam ormanlarıyla çevrili rustik taş ve ahşap mimariye sahip dağ evimiz. Şömine başında sıcak çayınızı yudumlarken kış masalını yaşayabilirsiniz.',
    badge: 'Kış Seçimi',
    whatsappMessage: 'Merhaba! Web sitenizden Uludağ Snowy Chalet için bilgi ve rezervasyon talep ediyorum.',
    rating: 4.93,
    reviewCount: 22,
    hostName: 'Yavuz Akman',
    hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    minNights: 2,
    extraServices: [],
    slogans: ['peaceful', 'heated_pool', 'barbecue']
  },
  {
    id: 'kalkan-conservative-1',
    name: 'Villa Alesta Kalkan',
    type: 'villa',
    title: 'Muhafazakar Aileler İçin Korunaklı Özel Havuzlu Lüks Villa',
    region: 'Balıkesir',
    capacity: 6,
    bedrooms: 3,
    bathrooms: 3,
    pricePerNight: 13900,
    features: ['heated_pool', 'jacuzzi', 'garden', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Dışarıdan tamamen korunaklı, havuzu görünmeyen muhafazakar konsept lüks villamız. Akdeniz esintisiyle geniş güneşlenme alanı ve konforlu bahçesiyle ailenizle huzurlu bir izole tatil sunmaktadır.',
    badge: 'Muhafazakar & Korunaklı',
    whatsappMessage: 'Merhaba! Web sitenizden Villa Alesta Kalkan için bilgi almak istiyorum.',
    rating: 4.95,
    reviewCount: 38,
    hostName: 'Mustafa Bey',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    minNights: 3,
    extraServices: [],
    slogans: ['outdoor', 'peaceful', 'clean']
  },
  {
    id: 'sapanca-honeymoon-bungalow',
    name: 'Sapanca Love Bungalov',
    type: 'bungalow',
    title: 'Özel Havuzlu & Şömineli Balayı Bungalovu',
    region: 'Sakarya',
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 4800,
    features: ['heated_pool', 'jacuzzi', 'fireplace', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Yeni evli çiftlerimiz için her detayı özenle düşünülmüş, romantik balayı konsepti. Isıtmalı havuz, şömine soba ve çift kişilik jakuzi ayrıcalığıyla doğanın tam ortasında aşk dolu anlar.',
    badge: 'Hemen Kiralık & Balayı',
    whatsappMessage: 'Merhaba! Web sitenizden Sapanca Love Bungalov için bilgi almak istiyorum.',
    rating: 4.99,
    reviewCount: 54,
    hostName: 'Esra Hanım',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    minNights: 2,
    extraServices: [],
    slogans: ['peaceful', 'heated_pool']
  },
  {
    id: 'bodrum-sunset-apartment',
    name: 'Bodrum Marina Sunset Daire',
    type: 'apartment',
    title: 'Şehir Merkezinde Deniz Manzaralı Lüks Daire',
    region: 'İstanbul',
    capacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    pricePerNight: 6500,
    features: ['wifi', 'lake_view'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Merkezi konumda, tüm sahil şeridine ve marinaya hakim harika bir teras dairesi. Modern tasarımı ile konforlu ve bağımsız bir konaklama alternatifi sunmaktadır.',
    badge: 'Kentsel & Konfor',
    whatsappMessage: 'Merhaba! Bodrum Marina Sunset Daire için bilgi alabilir miyim?',
    rating: 4.85,
    reviewCount: 19,
    hostName: 'Kamil Can',
    hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    minNights: 2,
    extraServices: [],
    slogans: ['patio', 'entry']
  },
  {
    id: 'fethiye-conservative-family',
    name: 'Villa Hilal Fethiye',
    type: 'villa',
    title: 'Muhafazakar Ailelere Özel Korunaklı Isıtmalı Havuzlu Villa',
    region: 'Sakarya',
    capacity: 8,
    bedrooms: 4,
    bathrooms: 4,
    pricePerNight: 14500,
    features: ['heated_pool', 'jacuzzi', 'garden', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Muhafazakar aile yapılarına tam uygun, her yönden kapalı gizli havuz verandası olan ultra lüks tatil villası. Bahçesinde çocuk parkı ve keyifli bir barbekü alanı barındırır. Ön onay gerektirmeyen anında rezervasyon imkanı bulunur.',
    badge: 'Anında Onay & Muhafazakar',
    whatsappMessage: 'Merhaba! Villa Hilal Fethiye için anında onaylı kiralama detaylarını sormak istiyorum.',
    rating: 4.92,
    reviewCount: 31,
    hostName: 'Salih Yıldırım',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    minNights: 3,
    extraServices: [],
    slogans: ['outdoor', 'clean', 'barbecue']
  },
  {
    id: 'sapanca-vip-bungalow',
    name: 'Sapanca Deluxe Loft',
    type: 'bungalow',
    title: 'Ön Onay Beklemeden Anında Kiralık Jakuzili Isıtmalı Havuzlu Bungalov',
    region: 'Sakarya',
    capacity: 4,
    bedrooms: 2,
    bathrooms: 2,
    pricePerNight: 5500,
    features: ['heated_pool', 'jacuzzi', 'fireplace', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1629812456605-4a044aa38fbc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Beklemeksizin anında onaylanan, lüks iç mimarisi ve Isıtmalı özel cam havuz alanı ile Sapanca’nın en popüler loft tasarımlı bungalov evlerinden biri.',
    badge: 'Anında Rezervasyon & Hemen',
    whatsappMessage: 'Merhaba! Sapanca Deluxe Loft bungalovu anında kiralamak istiyorum.',
    rating: 4.97,
    reviewCount: 47,
    hostName: 'Canan Hanım',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    minNights: 1,
    extraServices: [],
    slogans: ['entry', 'outdoor', 'top5']
  },
  {
    id: 'antalya-honeymoon-villa',
    name: 'Villa Swan Balayı',
    type: 'villa',
    title: 'Kalkan Koyu Manzaralı Şık Balayı Villası',
    region: 'Balıkesir',
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 9800,
    features: ['heated_pool', 'jacuzzi', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Nefes kesici deniz manzarasına karşı, jakuzili, korunaklı açık sonsuzluk havuzuna sahip harika balayı villası. Balayı çiftlerine özel ikram sepeti dâhildir.',
    badge: 'Anında Onay & Balayı',
    whatsappMessage: 'Merhaba! Villa Swan Balayı için rezervasyon sormak istiyorum.',
    rating: 4.98,
    reviewCount: 23,
    hostName: 'Arzu Demir',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    minNights: 3,
    extraServices: [],
    slogans: ['outdoor', 'patio']
  },
  {
    id: 'izole-conservative-dome',
    name: 'Korunaklı Doğa Dome',
    type: 'bungalow',
    title: 'Muhafazakar Uygun Isıtmalı Havuzlu Havuzu Görünmeyen Dome',
    region: 'Sakarya',
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 5100,
    features: ['heated_pool', 'jacuzzi', 'fireplace', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1629812456605-4a044aa38fbc?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Ağaçlarla çevrelenmiş, dış gözlerden tamamen ırak dizayn edilmiş muhafazakar tasarım cam kubbe bungalov. Dışarıdan görünmeyen korunaklı sıcak havuz alanında huzurlu bir inziva.',
    badge: 'Muhafazakar & Hemen Kiralık',
    whatsappMessage: 'Merhaba! Korunaklı Doğa Dome için sormak istiyorum.',
    rating: 4.94,
    reviewCount: 15,
    hostName: 'Ömer Kaya',
    hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    minNights: 2,
    extraServices: [],
    slogans: ['peaceful', 'heated_pool']
  }
];

export const GENERAL_FAQ = [
  {
    question: 'Isıtmalı havuzlar kışın kaç derece oluyor? Ek ücret var mı?',
    answer: 'Isıtmalı havuzlarımız kış ayları boyunca 28°C - 32°C aralığında sabit tutulur. Havuz ısıtma bedeli tüm kış dönemi fiyatlarımıza tamamen DAHİLDİR, hiçbir ek ücret talep edilmez.'
  },
  {
    question: 'Giriş ve çıkış saatleri nedir?',
    answer: 'Tesislerimize standart giriş saati 14:00, çıkış saati ise en geç 11:00’dir. Aradaki zaman diliminde havuz ve villa hijyeni için detaylı temizlik operasyonu yürütülmektedir.'
  },
  {
    question: 'Evcil hayvan kabul ediyor musunuz?',
    answer: 'Açıklamalarında "Evcil Hayvan Dostu" (Pet Friendly) etiketi bulunan villalarımız ve bungalovlarımız belirli kurallar ve temizlik protokolleri çerçevesinde sevimli dostlarımızı seve seve misafir edebilmektedir.'
  },
  {
    question: 'Bungalovlarda kahvaltı seçeneği bulunuyor mu?',
    answer: 'Bazı bungalovlarımızda çift kişilik serpme kahvaltı fiyata dahildir veya ek ücret karşılığında özel servis edilmektedir. Rezervasyon talebiniz sırasında "Kahvaltı Dahil" talebi oluşturabilirsiniz.'
  },
  {
    question: 'Ulaşım nasıl sağlanmaktadır? Araba şart mı?',
    answer: 'Bölgedeki konaklamalarımızın çoğu ilçe merkezine veya ana yola yakındır ancak doğa konseptini korumak adına hafif yokuşlu ormanlık yollarda bulunabilirler. Özel aracınız ile gelmeniz veya taksi kullanmanız konforunuz açısından önerilir.'
  }
];

export const AGENCY_DETAILS = {
  phone: '+90 541 246 54 29',
  whatsapp: '+905412465429',
  email: 'info@villabungalovtatil.com.tr',
  address: 'Ofis Merkezi İstanbul - Hizmet Tüm Türkiye ve civarı..',
  workingHours: 'Her Gün: 09:00 - 22:00'
};
