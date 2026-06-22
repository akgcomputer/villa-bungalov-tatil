export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'host' | 'subhost';
  status: 'active' | 'suspended';
  createdAt: string;
}

export const MOCK_USERS: User[] = [
  { id: 'usr_1', name: 'Sistem Yöneticisi', email: 'admin@villabungalov.com', phone: '+90 555 000 0000', role: 'admin', status: 'active', createdAt: new Date().toISOString() },
  { id: 'usr_2', name: 'Ahmet Yılmaz', email: 'ahmet@example.com', phone: '+90 532 111 2233', role: 'host', status: 'active', createdAt: new Date().toISOString() },
  { id: 'usr_3', name: 'Ayşe Kaya', email: 'ayse@example.com', phone: '+90 544 333 4455', role: 'subhost', status: 'active', createdAt: new Date().toISOString() },
];

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
  region: string;
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
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'pending_edit';
  pendingChanges?: Partial<Villa>;
  featuredCategories?: string[]; // 'balayi', 'muhafazakar'
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
  'Hepsi': { name: 'Tüm Şehirler', icon: '🌍' }
};

export const REGIONS = [
  'Hepsi',
  'İstanbul',
  'Antalya',
  'İzmir',
  'Balıkesir',
  'Aydın',
  'Muğla',
  'Bursa',
  'Kocaeli',
  'Ankara',
  'Tekirdağ',
  'Sakarya',
  'Çanakkale',
  'Edirne',
  'Kırklareli',
  'Yalova',
  'Bilecik',
  'Manisa',
  'Denizli',
  'Afyonkarahisar',
  'Kütahya',
  'Uşak',
  'Konya',
  'Şanlıurfa',
  'Gaziantep',
  'Diyarbakır',
  'Kayseri',
  'Samsun',
  'Van',
  'Malatya',
  'Erzurum',
  'Adana',
  'Mersin',
  'Hatay',
  'Kahramanmaraş',
  'Osmaniye',
  'Isparta',
  'Burdur',
  'Sivas',
  'Adıyaman',
  'Tokat',
  'Elazığ',
  'Zonguldak',
  'Batman',
  'Çorum',
  'Giresun',
  'Düzce',
  'Kastamonu',
  'Rize',
  'Amasya',
  'Bolu',
  'Karabük',
  'Sinop',
  'Bartın',
  'Artvin',
  'Gümüşhane',
  'Bayburt',
  'Ağrı',
  'Muş',
  'Bitlis',
  'Bingöl',
  'Hakkâri',
  'Kars',
  'Erzincan',
  'Iğdır',
  'Ardahan',
  'Tunceli',
  'Aksaray',
  'Yozgat',
  'Niğde',
  'Nevşehir',
  'Kırıkkale',
  'Karaman',
  'Kırşehir',
  'Çankırı'
] as const;

export const ALL_EXTRA_SERVICES: ExtraService[] = [
  { id: 'breakfast', name: 'Zengin Serpme Köy Kahvaltısı', price: 400, type: 'per_person_daily' },
  { id: 'dinner', name: 'Akşam Yemeği Izgara Menüsü', price: 800, type: 'per_person_daily' },
  { id: 'nature_tour', name: 'Rehberli Doğa ve Orman Yürüyüşü', price: 750, type: 'per_person_flat' },
  { id: 'boat_tour', name: 'Göl/Deniz Özel Yat Gezisi (1 Saat)', price: 4500, type: 'flat' }
];

export const VILLA_DATA: Villa[] = [
  {
  "id": "Isitmali-havuzlu-Seyr-i-Sapanca-Bungalov",
  "name": "Isitmali havuzlu Seyr i Sapanca Bungalov",
  "type": "bungalow",
  "title": "Isıtmalı havuzlu Seyr-i Sapanca Bungalov",
  "region": "Sakarya",
  "capacity": 5,
  "bedrooms": 2,
  "bathrooms": 1.5,
  "pricePerNight": 12999,
  "features": [
    "kitchen",
    "wifi",
    "air_conditioning",
    "jacuzzi",
    "heated_pool",
    "garden"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/4aff47cf-01a0-4f3b-ae05-2f70678ef2c8.jpg",
    "https://a0.muscache.com/im/pictures/airflow/Hosting-53294572/original/664f66c0-127b-43ad-a69a-9766b52a91b9.jpg",
    "https://a0.muscache.com/im/pictures/airflow/Hosting-53294572/original/903c5e3f-a183-4d28-8ca2-067c19ff052e.jpg",
    "https://a0.muscache.com/im/pictures/airflow/Hosting-53294572/original/0d657f27-0af3-44a6-8ebd-cfcfbec921bb.jpg",
    "https://a0.muscache.com/im/pictures/airflow/Hosting-53294572/original/5fc885cd-6208-4bdd-a7f0-598ff14b77ab.jpg",
    "https://a0.muscache.com/im/pictures/airflow/Hosting-53294572/original/88016d9a-3d66-4406-8647-7b4c57866afc.jpg",
    "https://a0.muscache.com/im/pictures/airflow/Hosting-53294572/original/cfd371e8-303f-48e9-b5f3-bcfeb54949a1.jpg",
    "https://a0.muscache.com/im/pictures/airflow/Hosting-53294572/original/6adad803-29df-4480-acc7-6459b50c4f11.jpg"
  ],
  "description": "Eşsiz bir manzaraya karşı! Müstakil bahçeli ve sıcak havuz deneyimine ne dersiniz?",
  "whatsappMessage": "Merhaba! Web sitenizden Isıtmalı havuzlu Seyr-i Sapanca Bungalov için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.85,
  "reviewCount": 235,
  "hostName": "Muhammet Mustafa",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Marrakech-Bungalow-Sapanca-1-Sicak-Havuzlu",
  "name": "Marrakech Bungalow Sapanca 1 Sicak Havuzlu",
  "type": "bungalow",
  "title": "Marrakech Bungalow Sapanca 1 ( Sıcak havuzlu )",
  "region": "Sakarya",
  "capacity": 5,
  "bedrooms": 2,
  "bathrooms": 1,
  "pricePerNight": 17777,
  "features": [
    "kitchen",
    "wifi",
    "air_conditioning",
    "heated_pool",
    "fireplace",
    "lake_view",
    "garden",
    "barbeque"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/da4e69c6-afb7-4aab-a9f3-1ecba20f7eb9.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/2ee185fc-3e2d-4e90-b5cd-fbcd100b7a88.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/98ac9c71-2d1a-4482-996a-f6a00c4065bd.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/a884dcd6-a7d0-434a-9919-dcdf16f34648.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/a35ba63f-33e8-4698-b6da-6608955d7b61.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/199b8029-d674-44e2-bf91-d69b04b0db7e.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/9b84acb5-33e6-4904-9842-e3d632afabd7.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/c6a6f0dc-b875-4de0-afe6-3cbb6e84740d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/b07c5202-f96a-4869-97a6-e985c2b20a2c.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/72db8c64-649a-4505-a8ce-c1a1ae7f6fb0.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/8287abcc-3be6-4c59-8c64-c451d088c307.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/55bf3a54-1690-4e0c-9e79-94d4556dc8d5.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/baeb587c-b1c5-49a5-ba59-b1b874defc0b.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1370566358449439617/original/e5e12aad-b6d0-4031-809e-de9fae3e40d9.jpeg"
  ],
  "description": "Bu benzersiz ve romantik kaçamağa bayılacaksınız. Bungalowumuz 2+1 konsepttir, Göl manzaralı, hem iç mekan hem de dış mekandan şöminelidir, bahçemizde ateş çukuru ve barbekü mevcuttur.",
  "whatsappMessage": "Merhaba! Web sitenizden Marrakech Bungalow Sapanca 1 ( Sıcak havuzlu ) için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.61,
  "reviewCount": 41,
  "hostName": "Kadir",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Yesil-Ev-Kartepe",
  "name": "Yesil Ev Kartepe",
  "type": "mansion",
  "title": "Bu tatil bir yeşil evde",
  "region": "Kocaeli",
  "capacity": 4,
  "bedrooms": 2,
  "bathrooms": 1,
  "pricePerNight": 12800,
  "features": [
    "kitchen",
    "wifi",
    "air_conditioning",
    "garden"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/miso/Hosting-42986869/original/52b57701-f479-48b3-833b-52f1392c00ec.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-42986869/original/ef6fe9ef-1f22-4426-bf43-5b5e782089a6.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-42986869/original/ed0f666c-43b8-48c7-bc68-c50c65ac8c4b.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-42986869/original/ab43fc6a-b631-4528-aebf-f29739abc426.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/ae12d9e2-669c-40e4-9a35-db1e9241081d.jpg?im_w=1200",
    "https://a0.muscache.com/im/pictures/3c7023cc-b514-4e5f-b54d-5e95a844aec2.jpg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-42986869/original/1855a186-7300-47c9-9ac3-84d6cf46fbbf.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/85cce267-beb5-4a05-943a-35e8b4d1daae.jpg?im_w=1200",
    "https://a0.muscache.com/im/pictures/e93650c4-b868-415c-b430-cbb122865554.jpg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-42986869/original/56569002-46de-4dc9-8f7d-310bf27aa436.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-42986869/original/e93ca0f1-31e1-4ce4-9965-477452397723.jpeg?im_w=720"
  ],
  "description": "Sizi yorucu fazlalıklardan arınmaya bekliyoruz, biz öyle yaptık. Bahçemize misafirimizin mutluluğundan başka bir şey girmesin diye tüm yorucu fazlalıkları dışarıda bıraktık, sade ve şık, sadece size.",
  "whatsappMessage": "Merhaba! Web sitenizden Bu tatil bir yeşil evde için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.71,
  "reviewCount": 159,
  "hostName": "Güçlü",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Mehmetbey-Bungovilla-Sicak-Havuz-Villa",
  "name": "Mehmetbey Bungovilla Sicak Havuz Villa",
  "type": "villa",
  "title": "Mehmetbey Bungovilla Sıcak Havuzlu Villa",
  "region": "Sakarya",
  "capacity": 8,
  "bedrooms": 3,
  "bathrooms": 3,
  "pricePerNight": 16500,
  "features": [
    "kitchen",
    "wifi",
    "air_conditioning",
    "heated_pool"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/afa2d168-5466-4284-884d-1a9dc318ac28.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/b29f5560-11c2-4a42-bb68-113aee22f8a7.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/0d0f98bb-fde2-488f-83b2-34507fa3470b.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/8a5fd9ce-48e9-40dc-992e-586e745fb13a.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/06c6b32e-2e21-4a30-aeae-b40857185191.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/d7a7fc0f-c08e-432c-9b85-6541b849dd12.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/4e4511cf-5607-4873-995f-c428816350b6.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/e46c7db2-3cab-49de-9bd0-cc7ee3c8d86d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/19aaa3ba-e522-46b1-96a5-b4867a7d1472.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/12b2776a-3156-44fb-85ed-58d77f095889.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/d09d3f57-8b30-4de7-aae0-5a960dfb0363.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/de6bf49e-45e7-4c0d-9b6c-794ba083bbab.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/a67aef59-4670-4f24-8e7a-55421a04be7e.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/16a4b0d2-7481-4c5c-b446-76d53dcca7ca.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287029860339631695/original/78961230-ddd5-4177-895d-6cdd16d15c22.jpeg"
  ],
  "description": "Mehmetbey Bungovilla Sıcak Havuz (Villa 1) - Sapanca'da lüks ve konforlu bir tatil için ideal.",
  "whatsappMessage": "Merhaba! Web sitenizden Mehmetbey Bungovilla Sıcak Havuzlu Villa için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.95,
  "reviewCount": 35,
  "hostName": "Mehmetbey",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Sapanca-Inci-Suit",
  "name": "Sapanca Inci Suit",
  "type": "mansion",
  "title": "Sapanca İnci Suit",
  "region": "Sakarya",
  "capacity": 6,
  "bedrooms": 2,
  "bathrooms": 2,
  "pricePerNight": 18500,
  "features": [
    "kitchen",
    "wifi",
    "air_conditioning",
    "heated_pool"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/05c27df5-e8ac-4122-8f38-323bab53b9cc.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1090327771603895228/original/b09b5f8e-13a6-449d-8abb-2009a7fd8e28.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/47bb2d5a-5ad0-498b-b833-863a6cdc81d3.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/d2ad39c2-5a3b-4e82-8e62-11fc58f03760.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/5dce2bc0-ae30-4cc5-b3f6-ff848f3e04da.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/e9eab04c-951b-437e-9983-a9e22a820e7c.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1090327771603895228/original/c0ef8960-b574-41ea-88ea-9a34e367662a.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/2bf4b695-3f66-41d9-950b-1fe6d16e66a1.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/708d7bb6-b5a3-4018-bd79-d5bfc088ec5c.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/d9e66dab-2231-4083-a393-d6f502f2c95c.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA5MDMyNzc3MTYwMzg5NTIyOA==/original/ea6c19d6-8352-4252-a9ec-fd51a892ff7d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA5MDMyNzc3MTYwMzg5NTIyOA==/original/e65db914-5c2d-41ab-951d-958abd16c319.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA5MDMyNzc3MTYwMzg5NTIyOA==/original/ff3a5af5-87f8-40fd-9651-e706cc497870.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA5MDMyNzc3MTYwMzg5NTIyOA==/original/c40f987f-5a70-4c47-8426-e7a166b9028f.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA5MDMyNzc3MTYwMzg5NTIyOA==/original/3ca7c8d3-0b2c-4357-9532-1a4ca5100119.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA5MDMyNzc3MTYwMzg5NTIyOA%3D%3D/original/49b09cc1-8cd5-425b-b2ea-9021cb3d6b2c.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/f4a3ea77-f5b8-4cde-81e2-5d4bcc727f97.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/045fa710-7e59-48c5-96c7-38e98fc39a0e.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA5MDMyNzc3MTYwMzg5NTIyOA%3D%3D/original/55e7a291-7254-421a-bbb4-87c5f80ca71c.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/3b0a6652-679b-4620-9c5e-1aa099489c36.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA5MDMyNzc3MTYwMzg5NTIyOA==/original/6b90bd1c-a49e-4f44-a447-9dd0345bbfe4.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/07bb7699-8297-43ec-b643-f70539165fc7.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/cc8878ca-7cc0-450c-9f51-fa4a2e03ff9e.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1090327771603895228/original/c116e1b2-2db4-4db6-8775-fcfd6fb7d80c.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA5MDMyNzc3MTYwMzg5NTIyOA==/original/e9aff1c4-775f-40fe-9c9d-0b3c371cea34.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA5MDMyNzc3MTYwMzg5NTIyOA==/original/9c73b4d8-e550-46a6-b91c-d9ad50a8b035.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA5MDMyNzc3MTYwMzg5NTIyOA==/original/835ef6dd-cd91-48e3-ac23-ba92152e5dba.jpeg"
  ],
  "description": "Sapanca İnci Suit - Havuzlu, şirin ve konforlu bir küçük ev. Sapanca'nın güzel manzaralı bölgesinde, huzurlu bir tatil için ideal.",
  "whatsappMessage": "Merhaba! Web sitenizden Sapanca İnci Suit için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.97,
  "reviewCount": 28,
  "hostName": "İnci",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Villa-jeshile-Korunakli-sicak-havuz",
  "name": "Villa jeshile Korunakli sicak havuz",
  "type": "villa",
  "title": "Villa jeshile Korunaklı sıcak havuz",
  "region": "Sakarya",
  "capacity": 8,
  "bedrooms": 4,
  "bathrooms": 3,
  "pricePerNight": 17200,
  "features": [
    "kitchen",
    "wifi",
    "air_conditioning",
    "heated_pool",
    "garden"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/45df6520-51a3-43b9-8ae7-ffbc689aabf5.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/beb90452-54de-4f62-83a3-b3f2002abc81.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/43a7e3b6-ffae-49d0-ae6c-1952b539959d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/ca217deb-63cf-4e34-ab52-651e7a3dd1e6.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/f66babc4-87c6-425c-a7c5-6fd8979cabed.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/428aa93d-017a-4954-9c67-394d6f288916.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/4d5de759-8592-4d7c-92ef-2d9b228d4c2a.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/f8744a44-1b03-4aa8-9159-0311eedae789.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/54463090-9b5b-4742-b223-ae97b365d2b6.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/a1766104-8958-4505-a5c0-0ce7cebe5a0e.png",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/42e9cd5e-699e-491c-ac16-e406253de001.png",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/eef1ca48-3820-4a99-ac77-fc5607352c63.png",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/d152127e-89a3-4cff-8aec-a1ec164e56a3.png",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/d2ea5ca7-a954-42aa-9a3e-46ba6cbb92da.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/7590863d-506a-4a4f-a596-b6b2f8dcf3cc.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/8afec3ca-848f-471d-a199-97f4fdb98d84.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/9d296de8-b984-4dd7-ba1f-34bb4c6af2e6.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/c3c9c281-4a04-457d-b138-dcc7b98f029d.png",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/5ce9182f-a820-404f-8c5f-f0b890f7df50.png",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/cd1f9aa8-59f7-4c37-8c25-1c8d288d6bf0.png",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/d4739ce2-0b37-4171-a020-810b61e04ec5.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/390f93b9-a8bf-48c7-bc15-e706eb486bf8.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/e22ba035-3b22-43a2-b03d-1c0152171d5f.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/17fd0ecb-c9ed-4e8f-ae6a-047180103ef7.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/46031d80-4b24-4c52-b376-e983a6c93bba.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/e6d3912f-f8ba-4712-9d2d-25f7c2e43697.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/5b15d4a0-1019-4c04-b6b4-0a55068aaccc.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/5eff063f-a0c1-4fc0-9482-a9f568c95404.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/e2141617-87c5-4235-9d45-67fc6aeaf91c.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/62d0f050-8041-4735-abf2-fe2046ce9ccd.png",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/76a51dd4-dde8-445a-9d4a-b34885929fb5.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/393701a5-efbb-487f-8e45-e903f322a4d9.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/89e84598-6163-47af-b727-8f9034a04296.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/262fd14b-c1bd-4bfd-80f0-521eddccd0d2.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/bf6b8e17-851e-4783-b900-d7acad6d0239.png",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/2d58dee2-d70d-46bf-a6df-b8a6956a22ca.png",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/0d7caee0-e580-48b3-a245-f76846bf4865.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/6cf84f4e-4f3f-4a42-abd5-8dbf58705b42.png",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/e3c7846d-e972-4124-a773-90cb5d8c1faf.png",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/636618a8-c98a-4538-9b35-042466c4d8bc.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/6ead3e61-f447-4f6b-9a87-35c3f6e0de7d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1224492451974881406/original/a4946151-46c1-4b9e-b472-ef1d50572e74.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/b08f2acc-9998-403f-8b23-203962cc6e4c.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/dde2b448-9d55-4162-9bd8-47cb0a0f85f2.png",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/ee3e39e8-e26b-40a0-b0cb-b0d270d9fc9a.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/563229f7-d4d6-495c-b72d-661bd9a53f79.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1218601470270679289/original/072a07f1-a512-48be-97a3-8a83d0719380.png"
  ],
  "description": "Karaçam'da huzurlu bir tatil için korunaklı havuzlu villa. Geniş bahçesi ve konforlu odaları ile kalabalık gruplar için ideal.",
  "whatsappMessage": "Merhaba! Web sitenizden Villa jeshile Korunaklı sıcak havuz için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.85,
  "reviewCount": 54,
  "hostName": "Sefa",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Deep-Luxury-Bungalov",
  "name": "Deep Luxury Bungalov",
  "type": "bungalow",
  "title": "Deep Luxury Bungalov",
  "region": "Sakarya",
  "capacity": 4,
  "bedrooms": 2,
  "bathrooms": 1,
  "pricePerNight": 16999,
  "features": [
    "kitchen",
    "wifi",
    "air_conditioning",
    "heated_pool"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/eb7a75f5-0dff-4944-a97b-5e25927bd090.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/375e8b0c-4fd1-4287-b57d-b4dbc47f827a.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/4a415709-0535-41cf-bc1b-c583c523c0e7.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/4b8dc035-7ac3-478e-abc1-8d43ed0195ea.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/f71ae194-4ada-4d42-b3a4-46dbfcbd08ed.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/b5fe8340-eba9-40e3-9b31-2003f7757f8d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/1f0c6e4e-f549-42a4-bb17-a6f0c2dde839.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/1a2f0e40-eb58-4662-b378-11477f2c35a8.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/5faf202c-e1f3-4f20-8d01-90039589e5cf.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/dee38d84-1ccf-44e4-8a24-7b62768cecea.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/4d8a6234-15ed-45d1-b451-7f5e08b505b8.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/c6f5ab0d-a267-4fe9-94c2-d135b9e19e3f.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/a8c5ed04-3711-4c43-a14b-630a0f1eda42.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1506489436693203876/original/3e3490bd-c819-403b-8e8d-dc212ad9cc3e.jpeg"
  ],
  "description": "Deep Luxury Bungalov - Bu huzurlu konaklama yerinde ailece dinlenebilirsiniz. Tescil bilgileri: 54-2603",
  "whatsappMessage": "Merhaba! Web sitenizden Deep Luxury Bungalov için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 5,
  "reviewCount": 8,
  "hostName": "Deep Luxury Sapanca",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Gol-Manazarali-Sicak-Havuzlu-Bahce-Jakuzili-B2",
  "name": "Gol Manazarali Sicak Havuzlu Bahce Jakuzili B2",
  "type": "chalet",
  "title": "Göl Manzaralı Sıcak havuzlu ,bahçe jakuzili B2",
  "region": "Sakarya",
  "capacity": 7,
  "bedrooms": 3,
  "bathrooms": 3,
  "pricePerNight": 16900,
  "features": [
    "kitchen",
    "wifi",
    "jacuzzi",
    "heated_pool",
    "lake_view",
    "garden"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1359952438777618210/original/7382c7e2-037c-4393-b46b-fea94913bebd.jpeg",
    "https://a0.muscache.com/im/pictures/047a0887-26a6-407d-a901-2bc27d4fa55f.jpg",
    "https://a0.muscache.com/im/pictures/4de2f021-f99d-4d3d-83a7-2bd749d899d7.jpg",
    "https://a0.muscache.com/im/pictures/a9777fe9-a866-4140-8f38-8ba9ed4db0d4.jpg",
    "https://a0.muscache.com/im/pictures/95f944c2-f288-4780-8950-eb4335663b12.jpg",
    "https://a0.muscache.com/im/pictures/03d64bfe-c004-496d-88f1-aea530fb8a49.jpg",
    "https://a0.muscache.com/im/pictures/11245f16-bd67-4191-9f71-5044fdfd623c.jpg",
    "https://a0.muscache.com/im/pictures/0e277d02-0410-45a9-8af9-580a040f80dd.jpg",
    "https://a0.muscache.com/im/pictures/a78ef1a7-8381-471c-9d53-b5bfb8b07320.jpg",
    "https://a0.muscache.com/im/pictures/992e993e-1de9-4b6e-aa48-064916cafda7.jpg",
    "https://a0.muscache.com/im/pictures/5ceff069-f236-481b-99c8-840a6cfd7964.jpg",
    "https://a0.muscache.com/im/pictures/dcd0e729-9fb2-4912-9c19-2c7adad6be98.jpg",
    "https://a0.muscache.com/im/pictures/fb579423-1cd1-4c24-978a-c4b2835558ec.jpg",
    "https://a0.muscache.com/im/pictures/c7d63602-6f0e-4c31-a615-04f4d192fbd4.jpg",
    "https://a0.muscache.com/im/pictures/ee1b2f45-7f46-4be2-89ca-51bea166c19c.jpg",
    "https://a0.muscache.com/im/pictures/d2f2375c-30ff-471a-819e-750c3ad60907.jpg",
    "https://a0.muscache.com/im/pictures/2dc58aa6-e50a-48fb-bf00-770be5c4c82b.jpg",
    "https://a0.muscache.com/im/pictures/0be0ff01-4bdd-4588-9de0-c3facc836336.jpg",
    "https://a0.muscache.com/im/pictures/6e3d60fc-b77a-43df-bd5f-79d0143ce668.jpg",
    "https://a0.muscache.com/im/pictures/d764322b-f58c-491e-abe3-c020775c1eb1.jpg",
    "https://a0.muscache.com/im/pictures/5971ba69-f4e3-4f0c-8bf7-96501b59ffaf.jpg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-44240804/original/e69cfe08-74bc-4202-96a2-f8465d686242.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-44240804/original/7b5ffcc2-83f9-4627-8fdf-1a482ec8d3ff.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1359952438777618210/original/7ddcabc6-c092-4670-924b-9620cc111888.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1359952438777618210/original/b7113854-4c72-4a3b-acef-86a95f259812.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1359952438777618210/original/577dd806-441d-41f2-a33d-5feeb7a3930d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1359952438777618210/original/05dc3fc9-1667-4b3a-8715-775284370779.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1359952438777618210/original/efef876e-130d-4ed5-859d-8f1b529a4cc8.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1359952438777618210/original/e6e53e0c-cede-4b95-9340-190a967a793f.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1359952438777618210/original/bac91dfd-43aa-44f9-8cb0-205e159b9acb.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1359952438777618210/original/bec0eadd-1b3b-4bd9-90ba-fb7936f51f61.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1359952438777618210/original/61613313-9691-487e-9f01-947b405df1e8.jpeg"
  ],
  "description": "Bu eşsiz yerde konaklarken doğanın seslerinin keyfini çıkarın. Göl manzaralı, sıcak havuzlu ve bahçe jakuzili.",
  "whatsappMessage": "Merhaba! Web sitenizden Göl Manzaralı Sıcak havuzlu ,bahçe jakuzili B2 için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.73,
  "reviewCount": 26,
  "hostName": "Sahra",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Casa-Vera-Sapanca-Sicak-Havuzlu",
  "name": "Casa Vera Sapanca Sicak Havuzlu",
  "type": "villa",
  "title": "Casa Vera Sapanca (sıcak havuzlu)",
  "region": "Sakarya",
  "capacity": 12,
  "bedrooms": 6,
  "bathrooms": 6,
  "pricePerNight": 19500,
  "features": [
    "kitchen",
    "wifi",
    "air_conditioning",
    "heated_pool"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/8babcae8-0825-4851-9989-0136d048d931.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/c32d0852-9a1c-4c85-b116-d5dd761c115f.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/3877e1f5-ffbd-4235-a2c2-57d973918558.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/51502391-aee2-4ea9-b430-d20991c33564.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NjY0MzAxNzQzNDAzMzk3MTU2/original/52971766-aae7-4871-beb9-c982616d6784.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NjY0MzAxNzQzNDAzMzk3MTU2/original/225b3bc5-1295-4147-8196-5a432c29a235.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NjY0MzAxNzQzNDAzMzk3MTU2/original/9699c15b-2150-4d6f-9125-f93c95c80db7.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NjY0MzAxNzQzNDAzMzk3MTU2/original/9f208ffd-beae-4ebe-84f0-4a2db5488b8d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-664301743403397156/original/ff3c6d5d-9776-4f22-9cdd-a17952e4cc0e.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/1caee3a9-95d4-402d-b538-1f1c8a012ed7.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/9d3f14f4-f8fd-41df-a295-7e36f24925ea.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/2027d84c-a7b7-491c-a630-db6addba0044.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/89a9f6f3-188c-4a06-8b4f-e8bb722017bb.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-664301743403397156/original/d1d88ebb-a160-4860-9b76-dd5f3692cc41.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/2b83aa62-a6ad-4adf-b4b2-22446044aaba.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/e91d870d-595b-4ed6-879b-248e91cc1469.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/64a0e6ec-d551-44e0-a5a0-a87619ab6ee3.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/71ae4c40-d785-4035-9c94-5b3a70fce4a8.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/27aaffc2-8f8e-4c82-973d-8ddf3c20f36c.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/86add38c-59de-4b3a-90f3-717c4c65073e.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/aef91915-8475-479c-b703-e090d701bca6.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/e26ce069-126e-44ea-a2f8-40f00b1fdc2a.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/a470fa02-ac0a-4ad8-af01-28863c427cf7.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/2b01f137-798e-4986-b0ad-57c8f83510cc.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/12ed035d-9853-4ec4-ab5f-218a3a314586.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-664301743403397156/original/24085f47-1759-4bb3-bb6a-99680cbb80d7.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NjY0MzAxNzQzNDAzMzk3MTU2/original/28aa7526-92ae-4b34-a841-9826fac46316.jpeg"
  ],
  "description": "Sapanca Kırkpınar'da Sıcak Havuzlu ve Saunalı 6+1 Villamız ile hizmetinizdeyiz. Tescil bilgileri: 54-185",
  "whatsappMessage": "Merhaba! Web sitenizden Casa Vera Sapanca (sıcak havuzlu) için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.78,
  "reviewCount": 83,
  "hostName": "Batur",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Gol-Manazarali-Sicak-Havuzlu-Kutuk-Ev-A1",
  "name": "Gol Manazarali Sicak Havuzlu Kutuk Ev A1",
  "type": "chalet",
  "title": "Göl Manzaralı Sıcak havuzlu Kütük Ev A1",
  "region": "Sakarya",
  "capacity": 5,
  "bedrooms": 2,
  "bathrooms": 2,
  "pricePerNight": 27200,
  "features": [
    "kitchen",
    "wifi",
    "heated_pool",
    "lake_view"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/1feb61aa-9dbf-42a9-b125-62ea5d1682d3.jpg",
    "https://a0.muscache.com/im/pictures/a67721b2-b7ef-4861-8fd5-cb10ad3f3512.jpg",
    "https://a0.muscache.com/im/pictures/72c9bcec-d23b-4546-a49a-25242553513c.jpg",
    "https://a0.muscache.com/im/pictures/323124d2-b5b5-4c2c-83aa-70b5995d774a.jpg",
    "https://a0.muscache.com/im/pictures/0749b996-3aae-4fee-b89a-ddecbdc5bf1c.jpg",
    "https://a0.muscache.com/im/pictures/26c59e26-2e21-46ba-a8a9-31560dca9bb3.jpg",
    "https://a0.muscache.com/im/pictures/d815938d-a258-48e5-a293-ce570b24648d.jpg",
    "https://a0.muscache.com/im/pictures/ac1fd6c2-076f-4755-8a5e-e9c3716a2d40.jpg",
    "https://a0.muscache.com/im/pictures/1270901a-a78e-44c5-80d2-bcad77008140.jpg",
    "https://a0.muscache.com/im/pictures/2a6150d4-99df-4618-9395-d32642973043.jpg",
    "https://a0.muscache.com/im/pictures/70139c69-885d-499e-9657-b572802b4be7.jpg",
    "https://a0.muscache.com/im/pictures/4b854fc8-45f1-4f43-a84a-297c15ef04f1.jpg",
    "https://a0.muscache.com/im/pictures/a59ce45e-2d7a-402f-b86a-4abeba66b3b4.jpg",
    "https://a0.muscache.com/im/pictures/77877589-0e51-4700-9259-ed70920fb58e.jpg",
    "https://a0.muscache.com/im/pictures/54df4be6-2f8d-43cb-9c32-443e5d740d46.jpg",
    "https://a0.muscache.com/im/pictures/3f16c0a0-d6a7-4038-a659-7586f1acae45.jpg",
    "https://a0.muscache.com/im/pictures/0fa272a2-0833-4246-bf21-db09a3d53d94.jpg",
    "https://a0.muscache.com/im/pictures/52a19b74-27c4-47e4-8681-4d61eab66faf.jpg",
    "https://a0.muscache.com/im/pictures/ed7c40a1-f539-4c16-b200-52efa036271b.jpg",
    "https://a0.muscache.com/im/pictures/bd896f77-fe27-4d72-b985-09a9b0d36438.jpg",
    "https://a0.muscache.com/im/pictures/f541ba61-13dc-4758-b686-1c1d9a39bb31.jpg",
    "https://a0.muscache.com/im/pictures/9d9a5eaa-b2ba-4723-9c0b-a92bfdebb487.jpg",
    "https://a0.muscache.com/im/pictures/ff650a5b-0298-4c42-893d-d18511837fc3.jpg",
    "https://a0.muscache.com/im/pictures/e44874e6-06f5-46e8-b664-f71e9f96fcc7.jpg"
  ],
  "description": "Bu unutulmaz kaçamak doğayla yeniden bağlantı kurmanızı sağlayacak. Göl manzaralı, sıcak havuzlu, kütük ev.",
  "whatsappMessage": "Merhaba! Web sitenizden Göl Manzaralı Sıcak havuzlu Kütük Ev A1 için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.7,
  "reviewCount": 20,
  "hostName": "Sahra",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Deep-Luxury-Sapanca",
  "name": "Deep Luxury Sapanca",
  "type": "bungalow",
  "title": "Deep Luxury Sapanca",
  "region": "Sakarya",
  "capacity": 4,
  "bedrooms": 2,
  "bathrooms": 1,
  "pricePerNight": 16690,
  "features": [
    "kitchen",
    "wifi",
    "heated_pool"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1483852888684960906/original/46a2381b-15df-416c-a7d9-e26873f39acd.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1483852888684960906/original/54059b3e-828c-4c93-8318-b3688d4d1066.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1483852888684960906/original/2a649636-13f3-4fb4-9d4d-e412ee8ac937.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1483852888684960906/original/2d68fb95-1d61-4d4a-be39-818027ff6925.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1483852888684960906/original/d9dc766f-62be-4822-a2ed-975528d96f66.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1483852888684960906/original/b5660a7f-9484-4838-a5ab-611e25f635f0.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1483852888684960906/original/3b582451-f7dd-4ae3-90de-8fda043d0f4d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1483852888684960906/original/dc24965a-dfa2-4aca-b661-d64d0aee6ab5.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1483852888684960906/original/28416417-b650-403f-8b99-5fe53ac1fe07.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1483852888684960906/original/85581780-946f-4139-ba3f-17f689d6f3f4.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1483852888684960906/original/d179b250-58c7-465f-81b5-cb958e11b3df.jpeg"
  ],
  "description": "Sapanca'nın büyüleyici doğasında, konfor ve zarafeti bir araya getiren Deep Luxury Sapanca, size unutulmaz bir konaklama deneyimi sunuyor. Modern mimarisiyle doğayla kusursuz bir uyum yakalayan bu özel bungalovlar, sadece bir tatil değil, aynı zamanda ruhunuzu dinlendiren bir kaçış vadediyor. Yılın her döneminde size huzur ve lüksü aynı anda sunan Deep Luxury Sapanca, romantik bir kaçamak, balayı tatili ya da sadece kendinize ayırmak istediğiniz kaliteli zaman için ideal. Tescil bilgileri: 54-2603",
  "whatsappMessage": "Merhaba! Web sitenizden Deep Luxury Sapanca için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 5,
  "reviewCount": 1,
  "hostName": "Deep Luxury Sapanca",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Sapancada-villa",
  "name": "Sapancada villa",
  "type": "villa",
  "title": "Sapancada villa",
  "region": "Sakarya",
  "capacity": 7,
  "bedrooms": 3,
  "bathrooms": 2,
  "pricePerNight": 14999,
  "features": [
    "kitchen",
    "wifi",
    "heated_pool",
    "lake_view",
    "barbeque"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/b5966344-b006-4ef0-9504-9560ebb65c29.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/779de12c-627d-47ba-8439-5c554147f43a.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/cf34fca7-ba0c-4de6-93c9-dd4a594eec1b.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/7326fac0-16bc-41e5-9eb5-ef70d4064062.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/e4bfcff8-ed1e-4fc2-b373-ce6afad675e7.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/8aa8c4d6-8de6-4f03-9603-cd67a27a628b.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/8e2e0ae0-fdc9-4d68-95ff-5d38c65bdc20.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/1a3dedcb-3a65-418c-b4ee-6dea61fc63df.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/c9c67c56-ebc9-4b98-984f-5f42b8149a2d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/aa4b9fbc-92d6-4624-97e5-20803ea13a38.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/ae194593-1f14-48c1-a881-521d27e70c00.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/387fba1f-08bd-40b1-9d27-953cf341c49c.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/56779fb1-85fd-4c8e-9abf-012c533c6298.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/564d51d5-4254-4e53-971e-aabde45fbae3.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1242104941963951730/original/23382ebc-a4de-4b77-8d8c-81e2a481dd55.jpeg"
  ],
  "description": "3+1 villa, havuzumuz 10/5 yarı olimpiktir. Tamamen merkezi konum, tamamen muhafazakâr. Migros, BİM, CarrefourSA, Şok araç ile 5dk. Göl kenarına yürüme mesafesi 10 dk. Barbekü, ocak, ateş kazanı vardır. NOT: Yerimizde mutfak tam donanımlıdır. Otobüs veya tren ile gelen müşterilerimiz tek vasıta ile tesisimize ulaşabilecektir.",
  "whatsappMessage": "Merhaba! Web sitenizden Sapancada villa için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.44,
  "reviewCount": 34,
  "hostName": "Ali",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Mehmetbey-Bungovilla-Sicak-Havuz-Villa-2",
  "name": "Mehmetbey Bungovilla Sicak Havuz Villa 2",
  "type": "villa",
  "title": "Mehmetbey Bungovilla sıcak havuz (villa 2)",
  "region": "Sakarya",
  "capacity": 8,
  "bedrooms": 3,
  "bathrooms": 3,
  "pricePerNight": 29999,
  "features": [
    "kitchen",
    "wifi",
    "air_conditioning",
    "heated_pool"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/fc129d4c-4cb6-4523-a9e1-651959671fc2.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/424b24f8-affa-41fc-9328-cf0a0956b266.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/f660824b-be58-4c48-8cd3-fc1d378cd7b6.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/c33a8e34-a823-42ba-9fdd-0b95587ee33e.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/356d790d-2557-4e7a-aa5f-eb554b5c39b6.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/40ffb8bb-4d43-4b3c-99d9-5e99b6c97238.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/536898dc-0939-4ebb-87ee-56fb53c3a8ee.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/447584c4-7de5-41df-a819-d3168729fb26.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/df046efc-f23d-4f48-962d-0845b888431d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/22493ef6-8798-40e2-aa9e-92bfe185d09a.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/9f9ffef2-2590-4acb-b291-f8f5acdfb3a0.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/221ed919-63cd-4c50-a284-5cd2aea4b596.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/6e15aa38-85cb-4ee9-a8ab-30fa61c907b3.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/7a77c98a-1fbb-4006-afe2-eb3b1d629acb.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/8992761f-7593-4f9a-ad17-3b073962e5f7.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/850dafcd-0bbf-4619-aee6-9a926c8f281a.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/ecff2480-2b79-4ff1-92a8-a0abed812236.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/453163c3-c091-439a-a6cb-7ed9672e65f7.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/5a8d2bb5-0b27-4662-8c6d-ac9a00389ace.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/3445eba6-0a8a-4aa1-87d1-bd462b67be95.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/588e0cb6-ea0e-4a5f-9cda-33d929c39c4d.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1287051528381345981/original/4bdcf862-8470-4c12-9232-e08bd9ac6edf.jpeg"
  ],
  "description": "Merkezî bir konumda bulunan bu yerde kalırsanız ailece her yere yakın olacaksınız. Tescil bilgileri: 54-1893",
  "whatsappMessage": "Merhaba! Web sitenizden Mehmetbey Bungovilla sıcak havuz (villa 2) için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.96,
  "reviewCount": 25,
  "hostName": "Emine",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
{
  "id": "Sin-Do-Ma-Dag-Evi",
  "name": "Sin Do Ma Dag Evi",
  "type": "villa",
  "title": "SİN DO MA Dağ Evi",
  "region": "Sakarya",
  "capacity": 4,
  "bedrooms": 2,
  "bathrooms": 1,
  "pricePerNight": 15500,
  "features": [
    "kitchen",
    "wifi",
    "air_conditioning",
    "heated_pool"
  ],
  "images": [
    "https://a0.muscache.com/im/pictures/miso/Hosting-1302137114706119532/original/8bb38a6f-cac5-4c02-b4f8-6137feffbfc8.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1302137114706119532/original/5e6c76d8-7824-4bec-bea5-8bd5d3feee18.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1302137114706119532/original/6ff5a75e-f753-48ff-a570-6fa57fd4d314.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1302137114706119532/original/f0220496-408f-44fd-986a-4c0b836634dc.jpeg",
    "https://a0.muscache.com/im/pictures/miso/Hosting-1302137114706119532/original/31f89e67-7339-446d-9a40-91bce1e33eb6.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1302137114706119532/original/74a70e41-f818-49bd-83e5-73d049ef369e.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1302137114706119532/original/3d174b22-2a6b-446d-aa9f-160094097174.jpeg",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1302137114706119532/original/64394034-a563-46c1-aeaa-83cb84f08155.jpeg"
  ],
  "description": "Bu şık yerde tüm ailenizle hoşça vakit geçirin. Tescil bilgileri: 54-9778",
  "whatsappMessage": "Merhaba! Web sitenizden SİN DO MA Dağ Evi için bilgi/rezervasyon talep etmek istiyorum.",
  "rating": 4.97,
  "reviewCount": 30,
  "hostName": "Orhan",
  "hostAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  "minNights": 4,
  "extraServices": []
},
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
