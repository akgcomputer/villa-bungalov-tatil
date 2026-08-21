import React, { useState, useEffect } from "react";
import {
  Compass,
  MapPin,
  Users,
  Flame,
  Sparkles,
  Search,
  Calendar,
  Check,
  SlidersHorizontal,
  Instagram,
  Phone,
  MessageCircle,
  Clock,
  Heart,
  Share2,
  Lock,
  X,
  ChevronLeft,
  ChevronRight,
  BadgePercent,
  PlusCircle,
  Building,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Wallet,
  Percent,
  Star,
  Home,
  Sliders,
  Sparkle,
  Tent,
  Tv,
  HelpCircle,
  ShieldCheck,
  Map,
  BadgeAlert,
  ArrowRight,
  User,
  UserCheck,
  Trash2,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Image as ImageIcon
} from "lucide-react";
import {
  VILLA_DATA,
  Villa,
  TieredPrice,
  REGIONS,
  GENERAL_FAQ,
  AGENCY_DETAILS,
  ALL_EXTRA_SERVICES,
  getVillaSlug,
  AVAILABLE_SLOGANS,
  CATEGORIZED_AMENITIES,
  VILLA_TYPES_MAP,
  MOCK_USERS,
  type User,
} from "./data";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import VillaCard, { FEATURE_MAP } from "./components/VillaCard";
import AiAssistant from "./components/AiAssistant";
import ReservationPanel, { Booking } from "./components/ReservationPanel";
import UserDashboard from "./components/UserDashboard";
import VillaDetailPage from "./components/VillaDetailPage";
import AdminUsers from "./components/admin/AdminUsers";
import AdminHosts from "./components/admin/AdminHosts";
import AdminCampaigns from "./components/admin/AdminCampaigns";
import AdminPictures from "./components/admin/AdminPictures";

export interface HostCampaign {
  id: string;
  name: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  targetVillaId: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export default function App() {
  // Simulated User Auth States (Moved up to prevent hoisting errors)
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    tcNo: string;
    phone: string;
    email: string;
  } | null>(() => {
    const saved = localStorage.getItem("guest_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [currentHost, setCurrentHost] = useState<{
    name: string;
    tcNo: string;
    phone: string;
  } | null>(() => {
    const saved = localStorage.getItem("host_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [currentAdmin, setCurrentAdmin] = useState<{
    name: string;
    tcNo: string;
    phone: string;
  } | null>(() => {
    const saved = localStorage.getItem("admin_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  // Navigation, Paths, Tabs & Role Orchestration
  const [currentPath, setCurrentPath] = useState<string>(
    () => window.location.pathname || "/",
  );
  const currentRole =
    currentPath.startsWith("/evsahibi")
      ? "host"
      : currentPath.startsWith("/admin")
      ? "admin"
      : currentPath.startsWith("/kullanici")
      ? "guest"
      : "guest";

  const navigateTo = (path: string) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
  };

  const setCurrentRole = (role: "guest" | "host" | "admin") => {
    if (role === "guest") navigateTo("/");
    else if (role === "host") {
      if (currentHost) navigateTo("/evsahibi");
      else setActiveLoginPopup("host");
    } else if (role === "admin") {
      if (currentAdmin) navigateTo("/admin");
      else setActiveLoginPopup("admin");
    }
  };

  // Popups and Modals States
  const [activeLoginPopup, setActiveLoginPopup] = useState<
    "guest" | "host" | "admin" | null
  >(null);
  const [activeRegisterPopup, setActiveRegisterPopup] = useState<
    "guest" | "host" | "admin" | null
  >(null);

  // Custom interactive nav modals
  const [showCitiesModal, setShowCitiesModal] = useState(false);
  const [showBoatsModal, setShowBoatsModal] = useState(false);
  const [showToursModal, setShowToursModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Popups local input states
  const [inputPhone, setInputPhone] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputShowPass, setInputShowPass] = useState(false);

  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regPassConfirm, setRegPassConfirm] = useState("");
  const [regShowPass, setRegShowPass] = useState(false);

  // Time-out session management (Zaman aÅŸÄ±mÄ± - 15 minutes)
  const [sessionTimeout, setSessionTimeout] = useState<number>(900);

  // Listen to popstate for back/forward browser support
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Time-out countdown checker (15 minutes idle timeout)
  useEffect(() => {
    if (currentPath === "/" || currentPath === "") return;

    // Countdown active session timer
    const interval = setInterval(() => {
      setSessionTimeout((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto logout active panel
          if (currentPath === "/kullanici") {
            setCurrentUser(null);
            localStorage.removeItem("guest_user_profile");
          } else if (currentPath === "/evsahibi") {
            setCurrentHost(null);
            localStorage.removeItem("host_user_profile");
          } else if (currentPath === "/admin") {
            setCurrentAdmin(null);
            localStorage.removeItem("admin_user_profile");
          }
          navigateTo("/");
          alert(
            "GÃ¼venliÄŸiniz iÃ§in 15 dakikalÄ±k oturum zaman aÅŸÄ±mÄ± sÃ¼reniz dolmuÅŸtur. LÃ¼tfen tekrar giriÅŸ yapÄ±n.",
          );
          return 900;
        }
        return prev - 1;
      });
    }, 1000);

    const resetTimerActivity = () => {
      setSessionTimeout(900);
    };

    window.addEventListener("mousemove", resetTimerActivity);
    window.addEventListener("click", resetTimerActivity);
    window.addEventListener("keydown", resetTimerActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetTimerActivity);
      window.removeEventListener("click", resetTimerActivity);
      window.removeEventListener("keydown", resetTimerActivity);
    };
  }, [currentPath]);

  // Route-guarding & Auto-protecting dashboards
  useEffect(() => {
    if (currentPath === "/kullanici" && !currentUser) {
      window.history.replaceState(null, "", "/");
      setCurrentPath("/");
      setActiveLoginPopup("guest");
    } else if (currentPath === "/evsahibi" && !currentHost) {
      window.history.replaceState(null, "", "/");
      setCurrentPath("/");
      setActiveLoginPopup("host");
    } else if (currentPath === "/admin" && !currentAdmin) {
      window.history.replaceState(null, "", "/");
      setCurrentPath("/");
      setActiveLoginPopup("admin");
    }
  }, [currentPath, currentUser, currentHost, currentAdmin]);

  const [showReservations, setShowReservations] = useState(false);
  const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null);
  const [selectedDetailImageIndex, setSelectedDetailImageIndex] = useState(0);

  // Lightbox Zoom / Expanded Photo Viewer State
  const [zoomImageIndex, setZoomImageIndex] = useState<number | null>(null);
  const [zoomVilla, setZoomVilla] = useState<Villa | null>(null);

  // Dynamic state for Villas (to allow Host to add real properties, and Admin to delete/update)
  const [villas, setVillas] = useState<Villa[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showLegalWarning, setShowLegalWarning] = useState(() => {
    return !sessionStorage.getItem("legalWarningSeen");
  });
  const [showAddVillaModal, setShowAddVillaModal] = useState(false);
  const [editingVilla, setEditingVilla] = useState<Villa | null>(null);
  const [tierEditingVilla, setTierEditingVilla] = useState<Villa | null>(null);
  // Dynamic state for Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  // Favorites/Wishlist
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Search & Filter criteria (for guest)
  const [filterRegion, setFilterRegion] = useState("Hepsi");
  const [filterType, setFilterType] = useState<string>("all");
  const [heroSlogan, setHeroSlogan] = useState(() => {
    return localStorage.getItem("villabungalov_hero_slogan") || "Åehrin Stresinden Uzak, DoÄŸayla Ä°Ã§ Ä°Ã§e Tatil Ä°Ã§in..";
  });
  const [heroTitle, setHeroTitle] = useState(() => {
    return localStorage.getItem("villabungalov_hero_title") || "ğŸŒ´ Åehirden uzak ama yakÄ±n yerde 3-4 gÃ¼n ne kadar gÃ¼zel olurdu..";
  });
  const [heroDescription, setHeroDescription] = useState(() => {
    return localStorage.getItem("villabungalov_hero_desc") || "Bazen Deniz kenarÄ± bazen GÃ¶l kenarÄ±nda ya da daÄŸÄ±n eteklerinde; Ä±sÄ±tmalÄ± havuzlu bungalovlar, lÃ¼ks villalar ve ÅŸÃ¶mineli evler. OnaylÄ± Ev sahiplerinden yerinizi ayÄ±rtÄ±n.";
  });
  const [heroBgImage, setHeroBgImage] = useState(() => {
    const saved = localStorage.getItem("villabungalov_hero_bg");
    if (!saved || saved.includes("unsplash.com/photo-1470770841072-f978cf4d019e")) {
      return "https://a0.muscache.com/im/pictures/hosting/Hosting-1390334924456893789/original/2aeae359-92fb-4ae5-b617-3df76973c1c3.jpeg?im_w=1200";
    }
    return saved;
  });

  const [socialChannels, setSocialChannels] = useState<{ id: string; type: string; label: string; value: string; url: string; }[]>(() => {
    const saved = localStorage.getItem('villabungalov_socials');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      { id: '1', type: 'WhatsApp', label: '7/24 DoÄŸrudan WhatsApp Destek', value: '+90 541 246 54 29', url: 'https://wa.me/905412465429' },
      { id: '2', type: 'Telefon', label: 'DoÄŸrudan Ev Sahibi AsistanÄ±', value: '+90 541 246 54 29', url: 'tel:+905412465429' },
      { id: '3', type: 'Instagram', label: 'Instagram Resmi HesabÄ±mÄ±z', value: '@villabungalovtatil', url: 'https://instagram.com/villabungalovtatil' }
    ];
  });

  const handleUpdateSocialChannels = (updated: typeof socialChannels) => {
    setSocialChannels(updated);
    localStorage.setItem('villabungalov_socials', JSON.stringify(updated));
    window.dispatchEvent(new Event('villabungalov_socials_changed'));
  };

  // CMS STATE HOOKS (SÃ¼per Admin)
  const [topBarText, setTopBarText] = useState(() => {
    return localStorage.getItem("villabungalov_topbar_text") || "TÃ¼rkiye'nin En SeÃ§kin Villa ve Bungalov Evleri Tek Adreste!";
  });

  const [logoTitle, setLogoTitleState] = useState(() => {
    return localStorage.getItem("villabungalov_logo_title") || "VillaBungalovTatil";
  });

  const [logoSubtitle, setLogoSubtitleState] = useState(() => {
    return localStorage.getItem("villabungalov_logo_subtitle") || "Harika Evler MuhteÅŸem Tatiller";
  });

  // helper to change logo and notify other components
  const handleLogoChange = (title: string, sub: string) => {
    setLogoTitleState(title);
    setLogoSubtitleState(sub);
    localStorage.setItem("villabungalov_logo_title", title);
    localStorage.setItem("villabungalov_logo_subtitle", sub);
    window.dispatchEvent(new Event("villabungalov_logo_changed"));
  };

  const [reviewsSubtitle, setReviewsSubtitle] = useState(() => {
    return localStorage.getItem("villabungalov_reviews_subtitle") || "Daha Ã¶nce konaklayan misafirlerimizin gerÃ§ek tatil ve deneyim paylaÅŸÄ±mlarÄ±";
  });

  const [reviewsData, setReviewsData] = useState<{name: string, comment: string, property: string}[]>(() => {
    const saved = localStorage.getItem("villabungalov_reviews_data");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        name: "KÃ¼bra Ã–.",
        comment: "Harika bir muhafazakar villa deneyimi yaÅŸadÄ±k. Havuzun dÄ±ÅŸarÄ±dan gÃ¶rÃ¼nmemesi bizim iÃ§in Ã§ok Ã¶nemliydi, gerÃ§ekten Ã§ok rahattÄ±.",
        property: "Muhafazakar Aile BahÃ§eli"
      },
      {
        name: "Ahmet T.",
        comment: "EÅŸimle balayÄ±mÄ±z iÃ§in burayÄ± tercih ettik. ÅÃ¶mine baÅŸÄ±nda ve jakuzide vakit geÃ§irmek mÃ¼kemmeldi. Herkese tavsiye ederim.",
        property: "Ã–zel Havuzlu BalayÄ± Evleri"
      },
      {
        name: "Meltem S.",
        comment: "Sessiz, huzurlu ve doÄŸayla baÅŸ baÅŸa muazzam bir 3 gÃ¼n geÃ§irdik. IsÄ±tmalÄ± havuzun derecesi harikaydÄ±, hiÃ§ Ã¼ÅŸÃ¼medik.",
        property: "IsÄ±tmalÄ± Havuzlu LÃ¼ks Dome"
      },
      {
        name: "Can Y.",
        comment: "KalabalÄ±k arkadaÅŸ grubumuzla gittik. GeniÅŸ bahÃ§esi, barbekÃ¼ alanÄ± ve temizliÄŸi kusursuzdu. Ev sahibimiz Muhammet Bey'e Ã§ok teÅŸekkÃ¼rler.",
        property: "GeniÅŸ Aile Ã–zel Havuz"
      },
      {
        name: "Selin G.",
        comment: "Bungalov tatili severler iÃ§in kesinlikle 1 numara! Jakuzili banyosu ve lÃ¼ks dekorasyonuyla rÃ¼ya gibiydi.",
        property: "ÅÃ¶mineli ve Jakuzili DaÄŸ Evi"
      },
      {
        name: "Burak K.",
        comment: "Lokasyon ve manzara mÃ¼kemmel. AnÄ±nda onay sistemiyle Ã§ok hÄ±zlÄ± kiraladÄ±k, her ÅŸey anlatÄ±ldÄ±ÄŸÄ± gibi tertemizdi.",
        property: "Kalkan Koyu ÅÄ±k BalayÄ±"
      }
    ];
  });

  const [faqSubtitle, setFaqSubtitle] = useState(() => {
    return localStorage.getItem("villabungalov_faq_subtitle") || "Rezervasyon sÃ¼reci ve konaklama kurallarÄ± hakkÄ±nda bilmek istedikleriniz";
  });

  const [faqList, setFaqList] = useState<{q: string, a: string}[]>(() => {
    const saved = localStorage.getItem("villabungalov_faq_list");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        q: "GiriÅŸ ve Ã§Ä±kÄ±ÅŸ saatleri nedir?",
        a: "GiriÅŸ saati en erken 14:00, Ã§Ä±kÄ±ÅŸ saati ise en geÃ§ 11:00'dir. Erken giriÅŸ veya geÃ§ Ã§Ä±kÄ±ÅŸ talepleri tesisin mÃ¼saitlik durumuna gÃ¶re Ã¶nceden teyit edilerek planlanabilir."
      },
      {
        q: "Evcil hayvan kabul ediliyor mu?",
        a: "BazÄ± bungalov ve villalarÄ±mÄ±z evcil hayvan kabul etmektedir. DetaylarÄ± incelemek iÃ§in ilan sayfalarÄ±ndaki 'Evcil Dostu' filtresini kullanabilirsiniz."
      },
      {
        q: "IsÄ±tmalÄ± havuzlar kÄ±ÅŸÄ±n sÄ±cak oluyor mu?",
        a: "Evet, Ä±sÄ±tmalÄ± havuzlarÄ±mÄ±zÄ±n tamamÄ± kÄ±ÅŸ dÃ¶nemlerinde dahi 28-30Â°C sÄ±caklÄ±k seviyesine sahip otomatik termostatik Ä±sÄ±tÄ±cÄ±larla sabit tutulmaktadÄ±r."
      },
      {
        q: "KaporayÄ± nasÄ±l Ã¶dÃ¼yoruz?",
        a: "Rezervasyon esnasÄ±nda toplam tutarÄ±n %20-30 civarÄ±ndaki Ã¶n Ã¶demesini (kapora) gÃ¼venli banka havalesi veya kredi kartÄ± ile doÄŸrudan mÃ¼lk sahibine yapabilirsiniz."
      },
      {
        q: "Fiyatlara KDV ve temizlik dahil mi?",
        a: "FiyatlarÄ±mÄ±z ÅŸeffaftÄ±r. Temizlik Ã¼cretleri bazÄ± evlerimizde fiyata dahilken, bazÄ±larÄ±nda tek seferlik Ã§Ä±kÄ±ÅŸ Ã¼creti olarak belirtilir. Ä°lan detaylarÄ±nda gÃ¶rebilirsiniz."
      },
      {
        q: "Rezervasyon iptal edilebilir mi?",
        a: "GiriÅŸ tarihinize 30 gÃ¼n kalana dek yapÄ±lan iptallerde Ã¶n Ã¶demenizin %100'Ã¼ kesintisiz olarak hesabÄ±nÄ±za iade edilmektedir."
      },
      {
        q: "GÄ±da alÄ±ÅŸveriÅŸimizi nereden yapabiliriz?",
        a: "Tesislerimizin birÃ§oÄŸu market ve restoran kurye aÄŸlarÄ±nÄ±n merkezindedir. AyrÄ±ca en yakÄ±n yerel zincir markete genellikle 5-10 dakikalÄ±k sÃ¼rÃ¼ÅŸ mesafesindedir."
      },
      {
        q: "Villalarda elektrik ve internet kesintisi oluyor mu?",
        a: "Tesislerimizin birÃ§oÄŸunda fiber internet ve elektrik dalgalanmalarÄ±na karÅŸÄ± jeneratÃ¶r ya da regÃ¼latÃ¶r sistemi kurulu olup kesintisiz bir deneyim sunulmaktadÄ±r."
      },
      {
        q: "Jakuzi ve ÅŸÃ¶mine kullanÄ±mÄ± Ã¼cretsiz mi?",
        a: "Evet, ÅŸÃ¶mine ve jakuzi donanÄ±mÄ± olan tÃ¼m evlerimizde bu hizmetler konaklama fiyatÄ±na dahildir ve ek bir Ã¼cret Ã¶demeniz gerekmez."
      }
    ];
  });

  const [area1Subtitle, setArea1Subtitle] = useState(() => {
    return localStorage.getItem("villabungalov_area1_subtitle") || "AradÄ±ÄŸÄ±nÄ±z en spesifik Ã¶zelliklere sahip popÃ¼ler kiralama alternatifleri";
  });

  const [area1Titles, setArea1Titles] = useState<string[]>(() => {
    const saved = localStorage.getItem("villabungalov_area1_titles");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      "Evcil Hayvan Ä°zinli Villalar",
      "Evcil Hayvan Kabul Eden KiralÄ±k Villa",
      "Evcil Hayvan Ä°zinli KiralÄ±k Bungalov",
      "Bungalov Villalar",
      "Havuzu DÄ±ÅŸarÄ±dan GÃ¶rÃ¼nmeyen Bungalov Evler",
      "Jakuzili ve ÅÃ¶mineli KiralÄ±k Bungalovlar",
      "KiralÄ±k LÃ¼ks Villalar",
      "KiralÄ±k Konforlu Ã–zel Havuzlu LÃ¼ks Villalar",
      "Muhafazakar KiralÄ±k Villa SeÃ§enekleri",
      "En Romantik BalayÄ± VillalarÄ± ve FiyatlarÄ±",
      "LÃ¼ks GÃ¶z AlÄ±cÄ± KiralÄ±k IsÄ±tmalÄ± IsÄ±nan Havuzlu Villalar",
      "Jakuzili ve ÅÃ¶mineli Romantik DaÄŸ Evleri"
    ];
  });

  const [area2Title, setArea2Title] = useState(() => {
    return localStorage.getItem("villabungalov_area2_title") || "KiralÄ±k Villa ve Bungalov SeÃ§enekleri ile Ä°zole ve Konforlu Bir Tatil";
  });

  const [area2Subtitle, setArea2Subtitle] = useState(() => {
    return localStorage.getItem("villabungalov_area2_subtitle") || "SÄ±cak, Ã¶zgÃ¼r ve gÃ¼venli bir konaklama rehberi";
  });

  const [area2Intro, setArea2Intro] = useState(() => {
    return localStorage.getItem("villabungalov_area2_intro") || "Klasik otel tatillerinin kalabalÄ±k, gÃ¼rÃ¼ltÃ¼lÃ¼ ve katÄ± kurallarla dolu atmosferi yerini artÄ±k Ã¶zgÃ¼rlÃ¼ÄŸe bÄ±rakÄ±yor. GÃ¼nÃ¼mÃ¼zde tatilciler; Ã§iftlerden kalabalÄ±k ailelere, arkadaÅŸ gruplarÄ±ndan kafa dinlemek isteyen bireysel gezginlere kadar herkes, kendi kurallarÄ±nÄ± koyabileceÄŸi bir alan arÄ±yor. Ä°ÅŸte tam bu noktada villabungalovtatil.com.tr olarak, hayalinizdeki konforlu ve mahremiyet odaklÄ± tatili ayaÄŸÄ±nÄ±za getiriyoruz. LÃ¼ks bir kiralÄ±k villa keyfi ya da doÄŸanÄ±n kalbinde sÄ±cak bir bungalov deneyimi... AradÄ±ÄŸÄ±nÄ±z huzur ve Ã¶zgÃ¼rlÃ¼k burada baÅŸlÄ±yor.";
  });

  const [area3Title, setArea3Title] = useState(() => {
    return localStorage.getItem("villabungalov_area3_title") || "Direkt KarÅŸÄ±lÄ±klÄ± GÃ¼venli Ev Sahibi AnlaÅŸmalarÄ±";
  });

  const [area3Text, setArea3Text] = useState(() => {
    return localStorage.getItem("villabungalov_area3_text") || "Villa Bungalov Tatil, baÄŸÄ±msÄ±z kiralama yapan mÃ¼lk sahipleri ile doÄŸa tutkunlarÄ±nÄ± ortak bir tabanda buluÅŸturur. AracÄ± platform masraflarÄ± ve yÃ¼ksek acente komisyonlarÄ± olmadan, direkt ev sahibi asistanlÄ±ÄŸÄ±yla en ekonomik fiyatÄ±n keyfini Ã§Ä±karÄ±rsÄ±nÄ±z.";
  });

  const [area3ButtonText, setArea3ButtonText] = useState(() => {
    return localStorage.getItem("villabungalov_area3_btn_text") || "WhatsApp DesteÄŸi";
  });

  const [area3ButtonUrl, setArea3ButtonUrl] = useState(() => {
    return localStorage.getItem("villabungalov_area3_btn_url") || "https://wa.me/905412465429";
  });

  const [area3ImageUrl, setArea3ImageUrl] = useState(() => {
    return localStorage.getItem("villabungalov_area3_image_url") || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800";
  });

  const [area4Enabled, setArea4Enabled] = useState<boolean>(() => {
    return localStorage.getItem("villabungalov_area4_enabled") === "true";
  });

  const [area4Title, setArea4Title] = useState(() => {
    return localStorage.getItem("villabungalov_area4_title") || "GÃ¼nÃ¼birlik Kamp ve DoÄŸa Aktiviteleri";
  });

  const [area4Subtitle, setArea4Subtitle] = useState(() => {
    return localStorage.getItem("villabungalov_area4_subtitle") || "Tatilinizi macera ve huzur dolu anlarla taÃ§landÄ±rÄ±n";
  });

  const [area4Text, setArea4Text] = useState(() => {
    return localStorage.getItem("villabungalov_area4_text") || "Sapanca ve Ã§evresinde at safari, ATV turlarÄ± ve gÃ¶l kenarÄ± kano aktiviteleriyle doÄŸanÄ±n tadÄ±nÄ± Ã§Ä±karabilirsiniz. Rezervasyon sonrasÄ± asistanÄ±mÄ±zla iletiÅŸime geÃ§erek indirimli aktivite paketlerinden yararlanÄ±n.";
  });

  const [area4ButtonText, setArea4ButtonText] = useState(() => {
    return localStorage.getItem("villabungalov_area4_btn_text") || "Aktiviteleri KeÅŸfet";
  });

  const [area4ButtonUrl, setArea4ButtonUrl] = useState(() => {
    return localStorage.getItem("villabungalov_area4_btn_url") || "https://wa.me/905412465429";
  });

  const [area4ImageUrl, setArea4ImageUrl] = useState(() => {
    return localStorage.getItem("villabungalov_area4_image_url") || "https://images.unsplash.com/photo-1533587834167-a4814c976da9?auto=format&fit=crop&q=80&w=800";
  });

  const [adminActiveTab, setAdminActiveTab] = useState("Misafir YorumlarÄ±");
  const [cmsUnsaved, setCmsUnsaved] = useState(false);
  const [cmsPublishing, setCmsPublishing] = useState(false);
  const [cmsPublishSuccess, setCmsPublishSuccess] = useState(false);

  const cmsJustMounted = React.useRef(true);
  useEffect(() => {
    if (cmsJustMounted.current) {
      cmsJustMounted.current = false;
      return;
    }
    setCmsUnsaved(true);
  }, [
    topBarText,
    logoTitle,
    logoSubtitle,
    reviewsSubtitle,
    reviewsData,
    faqSubtitle,
    faqList,
    area1Subtitle,
    area1Titles,
    area2Title,
    area2Subtitle,
    area2Intro,
    area3Title,
    area3Text,
    area3ButtonText,
    area3ButtonUrl,
    area3ImageUrl,
    area4Enabled,
    area4Subtitle,
    area4Title,
    area4Text,
    area4ButtonText,
    area4ButtonUrl,
    area4ImageUrl,
    heroSlogan,
    heroTitle,
    heroDescription,
    heroBgImage
  ]);

  const handleCmsPublish = () => {
    setCmsPublishing(true);
    
    // Record everything securely in localStorage
    localStorage.setItem("villabungalov_topbar_text", topBarText);
    localStorage.setItem("villabungalov_logo_title", logoTitle);
    localStorage.setItem("villabungalov_logo_subtitle", logoSubtitle);
    localStorage.setItem("villabungalov_reviews_subtitle", reviewsSubtitle);
    localStorage.setItem("villabungalov_reviews_data", JSON.stringify(reviewsData));
    localStorage.setItem("villabungalov_faq_subtitle", faqSubtitle);
    localStorage.setItem("villabungalov_faq_list", JSON.stringify(faqList));
    localStorage.setItem("villabungalov_area1_subtitle", area1Subtitle);
    localStorage.setItem("villabungalov_area1_titles", JSON.stringify(area1Titles));
    localStorage.setItem("villabungalov_area2_title", area2Title);
    localStorage.setItem("villabungalov_area2_subtitle", area2Subtitle);
    localStorage.setItem("villabungalov_area2_intro", area2Intro);
    localStorage.setItem("villabungalov_area3_title", area3Title);
    localStorage.setItem("villabungalov_area3_text", area3Text);
    localStorage.setItem("villabungalov_area3_btn_text", area3ButtonText);
    localStorage.setItem("villabungalov_area3_btn_url", area3ButtonUrl);
    localStorage.setItem("villabungalov_area3_image_url", area3ImageUrl);
    localStorage.setItem("villabungalov_area4_enabled", area4Enabled ? "true" : "false");
    localStorage.setItem("villabungalov_area4_subtitle", area4Subtitle);
    localStorage.setItem("villabungalov_area4_title", area4Title);
    localStorage.setItem("villabungalov_area4_text", area4Text);
    localStorage.setItem("villabungalov_area4_btn_text", area4ButtonText);
    localStorage.setItem("villabungalov_area4_btn_url", area4ButtonUrl);
    localStorage.setItem("villabungalov_area4_image_url", area4ImageUrl);
    localStorage.setItem("villabungalov_hero_slogan", heroSlogan);
    localStorage.setItem("villabungalov_hero_title", heroTitle);
    localStorage.setItem("villabungalov_hero_desc", heroDescription);
    localStorage.setItem("villabungalov_hero_bg", heroBgImage);

    // Broadcast change
    window.dispatchEvent(new Event("villabungalov_logo_changed"));

    setTimeout(() => {
      setCmsPublishing(false);
      setCmsUnsaved(false);
      setCmsPublishSuccess(true);
      setTimeout(() => {
        setCmsPublishSuccess(false);
      }, 4000);
    }, 1000);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeAmenities, setActiveAmenities] = useState<string[]>([]);
  const [searchGuests, setSearchGuests] = useState<number>(0);

  // User Auth States moved up

  const [companions, setCompanions] = useState<
    { id: string; name: string; tcNo: string }[]
  >([]);
  const [inlineCompanionName, setInlineCompanionName] = useState("");
  const [inlineCompanionTc, setInlineCompanionTc] = useState("");
  const [showCompanionInlineForm, setShowCompanionInlineForm] = useState(false);

  // Calendar Navigator States for Date Range Selector
  const [calendarYear, setCalendarYear] = useState(() =>
    new Date().getFullYear(),
  );
  const [calendarMonth, setCalendarMonth] = useState(() =>
    new Date().getMonth(),
  );

  // Quick reservation form dialog state
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    checkIn: "",
    checkOut: "",
    guestsCount: 2,
    breakfastIncluded: false,
    selectedCompanionIds: [] as string[],
    selectedExtraServices: [] as string[],
    serviceQuantities: {} as Record<string, number>,
  });
  const [quickBookVilla, setQuickBookVilla] = useState<Villa | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Campaigns and Coupon states
  const [campaigns, setCampaigns] = useState<HostCampaign[]>(() => {
    const saved = localStorage.getItem("villabungalov_campaigns");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "camp-1",
        name: "Yaz Sezonu Ã–zel BaÅŸlangÄ±Ã§ FÄ±rsatÄ±",
        code: "YAZ10",
        discountType: "percentage",
        discountValue: 10,
        targetVillaId: "all",
        isActive: true,
        startDate: "2026-06-01",
        endDate: "2026-08-31",
      },
      {
        id: "camp-2",
        name: "Hafta Sonu Bungalov KampanyasÄ±",
        code: "BUNGALOV2000",
        discountType: "fixed",
        discountValue: 2000,
        targetVillaId: "all",
        isActive: true,
        startDate: "2026-06-15",
        endDate: "2026-09-30",
      }
    ];
  });

  const saveCampaignsState = (updated: HostCampaign[]) => {
    setCampaigns(updated);
    localStorage.setItem("villabungalov_campaigns", JSON.stringify(updated));
  };

  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [newCampaignForm, setNewCampaignForm] = useState({
    name: "",
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 10,
    targetVillaId: "all",
    startDate: "2026-06-15",
    endDate: "2026-09-30",
  });

  // Current applied campaign for guest quick book modal
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCampaign, setAppliedCampaign] = useState<HostCampaign | null>(null);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    if (!quickBookVilla) {
      setCouponCodeInput("");
      setAppliedCampaign(null);
      setCouponError("");
    }
  }, [quickBookVilla]);

  // Host Dashboard: Form for adding a new villa
  const [newVillaForm, setNewVillaForm] = useState({
    name: "",
    title: "",
    type: "bungalow" as Villa["type"],
    region: "Ä°stanbul" as Villa["region"],
    capacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    pricePerNight: 5000,
    minNights: 2,
    description: "",
    badge: "Yeni Ä°lan",
    features: [] as string[],
    selectedExtraServices: [] as string[],
    imagePreset: "preset1", // Will mapping mock premium images
    slogans: ["entry", "outdoor", "peaceful"] as string[],
    prePaymentRate: 0,
    catFeatures: [
      "view_mountain",
      "bath_hairdryer",
      "bath_soap",
      "bath_hotwater",
      "bed_essentials",
      "bed_sheets",
      "temp_ac",
      "net_wifi",
      "kit_kitchen",
      "kit_fridge",
      "out_balcony",
      "park_free_prem",
      "park_pool",
    ] as string[],
    customExtraServices: [] as {
      id: string;
      name: string;
      price: number;
      type: "per_person_daily" | "per_person_flat" | "flat";
    }[],
    // Boat Options
    isBoat: false,
    boatType: "Katamaran",
    skipper: "KaptanlÄ±",
    concept: "GÃ¼nlÃ¼k Koy Gezisi",
    port: "KuruÃ§eÅŸme MarinasÄ±, Ä°stanbul",
  });
  const [hostFormSuccess, setHostFormSuccess] = useState(false);

  // Load state from localStorage on Mount
  useEffect(() => {
    // 1. Villas load
    const loadVillas = async () => {
      try {
        const response = await fetch('/api/villas');
        if (response.ok) {
          const apiVillas = await response.json();
          setVillas(apiVillas);
          localStorage.setItem("airbnb_villas", JSON.stringify(apiVillas));
          return;
        }
      } catch (err) {
        console.error("API fetch error", err);
      }
      
      const DATA_VERSION = "v3_imported_data";
      const localVersion = localStorage.getItem("airbnb_data_version");
      
      if (localVersion !== DATA_VERSION) {
        // Version mismatch or new import: Wipe and load from VILLA_DATA
        localStorage.removeItem("airbnb_villas");
        setVillas(VILLA_DATA);
        localStorage.setItem("airbnb_villas", JSON.stringify(VILLA_DATA));
        localStorage.setItem("airbnb_data_version", DATA_VERSION);
        return;
      }
      
      const savedVillas = localStorage.getItem("airbnb_villas");
      if (savedVillas) {
        try {
          const parsedVillas = JSON.parse(savedVillas);
          setVillas(parsedVillas);
        } catch (e) {
          setVillas(VILLA_DATA);
        }
      } else {
        setVillas(VILLA_DATA);
        localStorage.setItem("airbnb_villas", JSON.stringify(VILLA_DATA));
      }
    };
    loadVillas();

    // Load Users
    const savedUsers = localStorage.getItem("airbnb_users");
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch(e) {
        setUsers(MOCK_USERS);
      }
    } else {
      setUsers(MOCK_USERS);
      localStorage.setItem("airbnb_users", JSON.stringify(MOCK_USERS));
    }

    // 2. Bookings load
    const savedBookings = localStorage.getItem("villabungalov_bookings");
    const DEMO_BOOKINGS = [
      {
        id: "REZ-2026-A101",
        villaId: "sapanca-dome",
        villaName: "Sapanca Glass Dome",
        guestName: "Ahmet YÄ±lmaz",
        guestPhone: "+90 533 987 65 43",
        guestEmail: "ahmet@gmail.com",
        checkIn: "2026-06-15",
        checkOut: "2026-06-18",
        guestsCount: 2,
        totalDays: 3,
        totalPrice: 15600,
        basePrice: 15600,
        discountAmount: 0,
        prepaymentAmount: 1560,
        status: "confirmed",
        createdAt: "2026-06-11T12:00:00Z",
      },
      {
        id: "REZ-2026-B202",
        villaId: "kirkpinar-nest",
        villaName: "KÄ±rkpÄ±nar Family Villa",
        guestName: "Zeynep Kaya",
        guestPhone: "+90 542 345 67 89",
        guestEmail: "zeynep@hotmail.com",
        checkIn: "2026-07-02",
        checkOut: "2026-07-06",
        guestsCount: 4,
        totalDays: 4,
        totalPrice: 50000,
        basePrice: 50000,
        discountAmount: 0,
        prepaymentAmount: 5000,
        status: "pending",
        createdAt: "2026-06-12T10:30:00Z",
      },
      {
        id: "REZ-2026-C303",
        villaId: "bosphorus-princess-cat",
        villaName: "Princess Azure Katamaran",
        guestName: "Mehmet Demir",
        guestPhone: "+90 505 111 22 33",
        guestEmail: "mehmet@gmail.com",
        checkIn: "2026-06-25",
        checkOut: "2026-06-27",
        guestsCount: 6,
        totalDays: 2,
        totalPrice: 37000,
        basePrice: 37000,
        discountAmount: 0,
        prepaymentAmount: 3700,
        status: "pending",
        createdAt: "2026-06-12T14:15:00Z",
      },
    ];
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
        setBookings(DEMO_BOOKINGS);
      }
    } else {
      setBookings(DEMO_BOOKINGS);
      localStorage.setItem(
        "villabungalov_bookings",
        JSON.stringify(DEMO_BOOKINGS),
      );
    }

    // 3. Favorites load
    const savedFavorites = localStorage.getItem("villabungalov_favs");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {}
    }

    // 4. Guest user login load
    const savedUser = localStorage.getItem("guest_user_profile");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setBookingForm((prev) => ({
          ...prev,
          name: parsed.name,
          phone: parsed.phone,
          email: parsed.email,
        }));
      } catch (e) {}
    }

    const savedCompanions = localStorage.getItem("guest_companions");
    if (savedCompanions) {
      try {
        setCompanions(JSON.parse(savedCompanions));
      } catch (e) {}
    }

    const savedHost = localStorage.getItem("host_user_profile");
    if (savedHost) {
      try {
        setCurrentHost(JSON.parse(savedHost));
      } catch (e) {}
    }

    const savedAdmin = localStorage.getItem("admin_user_profile");
    if (savedAdmin) {
      try {
        setCurrentAdmin(JSON.parse(savedAdmin));
      } catch (e) {}
    }
  }, []);

  // Unified logout helper
  const handleLogout = (role: "guest" | "host" | "admin") => {
    if (role === "guest") {
      setCurrentUser(null);
      localStorage.removeItem("guest_user_profile");
    } else if (role === "host") {
      setCurrentHost(null);
      localStorage.removeItem("host_user_profile");
    } else if (role === "admin") {
      setCurrentAdmin(null);
      localStorage.removeItem("admin_user_profile");
    }
    navigateTo("/");
  };

  // Save actions helpers
  const saveVillasState = (updatedList: Villa[]) => {
    setVillas(updatedList);
    localStorage.setItem("airbnb_villas", JSON.stringify(updatedList));
  };

  const saveBookingsState = (updatedList: Booking[]) => {
    setBookings(updatedList);
    localStorage.setItem("villabungalov_bookings", JSON.stringify(updatedList));
  };

  // Toggle wishlist handler
  const handleToggleFavorite = (id: string) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((f) => f !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("villabungalov_favs", JSON.stringify(updated));
  };

  // Main system filters (Guest view)
  const filteredVillas = villas.filter((villa) => {
    if (villa.isActive === false) return false;
    if (villa.approvalStatus !== "approved" && villa.approvalStatus !== undefined && villa.approvalStatus !== "pending_edit") return false;
    // Region
    if (filterRegion !== "Hepsi" && villa.region !== filterRegion) return false;
    // Type
    if (filterType !== "all") {
      if (filterType === "muhafazakar") {
        const isMuhafazakar = 
          villa.title.toLowerCase().includes("muhafazakar") || 
          villa.title.toLowerCase().includes("korunaklÄ±") ||
          villa.description.toLowerCase().includes("muhafazakar") || 
          villa.description.toLowerCase().includes("korunaklÄ±") ||
          (villa.badge && (villa.badge.toLowerCase().includes("muhafazakar") || villa.badge.toLowerCase().includes("korunaklÄ±"))) ||
          villa.type === "muhafazakar";
        if (!isMuhafazakar) return false;
      } else if (filterType === "balayi") {
        const isBalayi = 
          villa.title.toLowerCase().includes("balayÄ±") || 
          villa.title.toLowerCase().includes("romantik") ||
          villa.description.toLowerCase().includes("balayÄ±") || 
          villa.description.toLowerCase().includes("romantik") ||
          (villa.badge && (villa.badge.toLowerCase().includes("balayÄ±") || villa.badge.toLowerCase().includes("romantik"))) ||
          villa.type === "balayi";
        if (!isBalayi) return false;
      } else if (filterType === "bungalow") {
        if (villa.type !== "bungalow" && villa.type !== "chalet") return false;
      } else if (filterType === "villa") {
        if (villa.type !== "villa" && villa.type !== "mansion") return false;
      } else {
        if (villa.type !== filterType) return false;
      }
    }
    // Search query matched with title/name/description
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = villa.name.toLowerCase().includes(q);
      const matchTitle = villa.title.toLowerCase().includes(q);
      const matchDesc = villa.description.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchDesc) return false;
    }
    // Max guests capability
    if (searchGuests > 0 && villa.capacity < searchGuests) return false;
    // Match each select feature
    if (activeAmenities.length > 0) {
      const matchesAll = activeAmenities.every((f) => {
        if (f === "plus_thirty") {
          return (villa.features || []).length >= 4;
        }
        return (villa.features || []).includes(f);
      });
      if (!matchesAll) return false;
    }
    return true;
  });

  const toggleAmenityFilter = (featName: string) => {
    if (activeAmenities.includes(featName)) {
      setActiveAmenities((prev) => prev.filter((a) => a !== featName));
    } else {
      setActiveAmenities((prev) => [...prev, featName]);
    }
  };

  const handleSpecialSelection = (title: string) => {
    // Reset filters
    setFilterRegion("Hepsi");
    setFilterType("all");
    setSearchQuery("");
    setActiveAmenities([]);
    setSearchGuests(0);

    const lower = title.toLowerCase();

    if (lower.includes("evcil") || lower.includes("pet")) {
      setActiveAmenities(["pet_friendly"]);
    } else if (lower.includes("Ä±sÄ±tmalÄ±") || lower.includes("isitmali")) {
      setActiveAmenities(["heated_pool"]);
    } else if (lower.includes("jakuzili")) {
      setActiveAmenities(["jacuzzi"]);
    } else if (lower.includes("ÅŸÃ¶mineli") || lower.includes("somineli")) {
      setActiveAmenities(["fireplace"]);
    } else if (lower.includes("muhafazakar") || lower.includes("korunaklÄ±")) {
      setFilterType("muhafazakar");
    } else if (lower.includes("balayÄ±") || lower.includes("balayi") || lower.includes("romantik")) {
      setFilterType("balayi");
    } else if (lower.includes("bungalov")) {
      setFilterType("bungalow");
    } else if (lower.includes("lÃ¼ks") || lower.includes("luks") || lower.includes("villa")) {
      setFilterType("villa");
    }

    // Scroll smoothly to list section
    setTimeout(() => {
      const element = document.getElementById("villas-list-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  };

  const getCalculatePriceInfo = (
    villa: Villa,
    inDateStr: string,
    outDateStr: string,
  ) => {
    if (!inDateStr || !outDateStr) return { days: 0, total: 0 };
    const inDate = new Date(inDateStr);
    const outDate = new Date(outDateStr);
    const diff = outDate.getTime() - inDate.getTime();
    if (diff <= 0) return { days: 0, total: 0 };
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    let total = 0;
    for (let i = 0; i < days; i++) {
      const nightDate = new Date(inDate.getTime());
      nightDate.setDate(inDate.getDate() + i);

      // Format current date as YYYY-MM-DD
      const yyyy = nightDate.getFullYear();
      const mm = String(nightDate.getMonth() + 1).padStart(2, "0");
      const dd = String(nightDate.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      // Check tier prices
      let activePrice = villa.pricePerNight;
      if (villa.kademeliFiyatlar && villa.kademeliFiyatlar.length > 0) {
        const matchingTier = villa.kademeliFiyatlar.find(
          (tier) => dateStr >= tier.startDate && dateStr <= tier.endDate,
        );
        if (matchingTier) {
          activePrice = matchingTier.price;
        }
      }
      total += activePrice;
    }

    return { days, total };
  };

  const formatTurkishDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    return `${d}.${m}.${y.slice(-2)}`;
  };

  // Handle open dialog reservation request
  const handleOpenQuickBook = (villa: Villa) => {
    const today = new Date();
    // Default to at least the minimum nights of the villa!
    const tomorrow = new Date();
    const minN = villa.minNights || 2;
    tomorrow.setDate(today.getDate() + minN);

    // Initialize calendar month and year to today
    setCalendarYear(today.getFullYear());
    setCalendarMonth(today.getMonth());

    setBookingForm({
      name: currentUser ? currentUser.name : "",
      phone: currentUser ? currentUser.phone : "",
      email: currentUser ? currentUser.email : "",
      checkIn: today.toISOString().substring(0, 10),
      checkOut: tomorrow.toISOString().substring(0, 10),
      guestsCount: villa.capacity > 2 ? 2 : villa.capacity,
      breakfastIncluded: false,
      selectedCompanionIds: [],
      selectedExtraServices: [],
      serviceQuantities: {},
    });
    setFormSuccess(false);
    setQuickBookVilla(villa);
  };

  const handleOpenFromDetail = (villa: Villa) => {
    setSelectedVilla(null);
    handleOpenQuickBook(villa);
  };

  const handleCancelBooking = (bookingId: string, reason?: string) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: "cancelled" as const, cancelReason: reason } : b,
    );
    saveBookingsState(updated);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const villa = quickBookVilla;
    if (!villa) return;

    if (!currentUser) {
      alert(
        "Misafir Bilgisi Eksik: Rezervasyon yapmadan Ã¶nce lÃ¼tfen yukarÄ±daki 'KullanÄ±cÄ± GiriÅŸi & Kimlik Bildirim Paneli' Ã¼zerinden Ad-Soyad ve T.C. Kimlik numaranÄ±zÄ± girerek Ã¼ye giriÅŸi yapÄ±nÄ±z.",
      );
      return;
    }

    const { days, total } = getCalculatePriceInfo(
      villa,
      bookingForm.checkIn,
      bookingForm.checkOut,
    );
    if (days <= 0) {
      alert("Hata: Ã‡Ä±kÄ±ÅŸ tarihi giriÅŸ tarihinden sonra olmalÄ±dÄ±r.");
      return;
    }

    // Enforce minimum nights constraint
    const minN = villa.minNights || 2;
    if (days < minN) {
      alert(
        `Hata: Bu ev iÃ§in en az konaklama sÃ¼resi ${minN} gecedir. GiriÅŸ/Ã‡Ä±kÄ±ÅŸ tarihlerinizi en az ${minN} gece olacak ÅŸekilde gÃ¼ncelleyin. (Mevcut seÃ§iminiz: ${days} Gece)`,
      );
      return;
    }

    // Check if selected range overlaps with existing confirmed bookings
    const hasOverlap = bookings.some((b) => {
      if (b.villaId !== villa.id || b.status === "cancelled") return false;
      return (
        bookingForm.checkIn < b.checkOut && bookingForm.checkOut > b.checkIn
      );
    });
    if (hasOverlap) {
      alert(
        "Hata: SeÃ§tiÄŸiniz tarihler arasÄ±nda dolu/rezervasyonlu gÃ¼nler bulunmaktadÄ±r. LÃ¼tfen takvimde Ã§izgili olmayan uygun tarihleri seÃ§iniz.",
      );
      return;
    }

    // Check for missing companion entries
    let missingCompanionCount = 0;
    for (let i = 1; i < bookingForm.guestsCount; i++) {
      const chosenId = bookingForm.selectedCompanionIds[i - 1];
      if (!chosenId) {
        missingCompanionCount++;
      }
    }
    if (missingCompanionCount > 0) {
      alert(
        "Yasal Bildirim UyarÄ±sÄ±: Konaklayacak diÄŸer kiÅŸilerin (refakatÃ§ilerin) bilgilerini seÃ§mediniz veya eklemediniz. LÃ¼tfen listeden seÃ§im yapÄ±n ya da yeni refakatÃ§i tanÄ±mlayÄ±n.",
      );
      return;
    }

    // Calculate extra services
    let servicesCost = 0;
    const srvTextList: string[] = [];
    if (villa.extraServices) {
      villa.extraServices.forEach((srv) => {
        const qty = bookingForm.serviceQuantities?.[srv.id] || 0;
        if (qty > 0) {
          let cost = 0;
          if (
            srv.type === "per_person_daily" ||
            srv.type === "per_person_flat"
          ) {
            cost = srv.price * bookingForm.guestsCount * qty;
          } else {
            cost = srv.price * qty;
          }
          servicesCost += cost;
          srvTextList.push(
            `${srv.name} (x${qty} - â‚º${cost.toLocaleString("tr-TR")})`,
          );
        }
      });
    }

    let campaignDiscountAmount = 0;
    if (appliedCampaign) {
      if (appliedCampaign.discountType === "percentage") {
        campaignDiscountAmount = Math.round(total * (appliedCampaign.discountValue / 100));
      } else {
        campaignDiscountAmount = Math.round(appliedCampaign.discountValue);
      }
    }
    const rentalAfterDiscount = Math.max(0, total - campaignDiscountAmount);
    const finalTotalPrice = rentalAfterDiscount + servicesCost;
    const kaparo = Math.round(rentalAfterDiscount * 0.1);
    const prePaymentRate = villa.prePaymentRate || 0;
    const kesinPayment =
      prePaymentRate > 0 ? Math.round(rentalAfterDiscount * (prePaymentRate / 100)) : 0;
    const onRezOdenecek = kaparo + kesinPayment + servicesCost;
    const kalanKapida = finalTotalPrice - onRezOdenecek;

    // staying guests list compiled for law compliance (KBBS)
    const stayingGuestsDetails: string[] = [];
    stayingGuestsDetails.push(
      `1. ${currentUser.name} (TC: ${currentUser.tcNo}) [Siz]`,
    );
    for (let i = 1; i < bookingForm.guestsCount; i++) {
      const chosenId = bookingForm.selectedCompanionIds[i - 1];
      if (!chosenId || chosenId === "later") {
        stayingGuestsDetails.push(
          `${i + 1}. Daha sonra eklenecek (Ev sahibine bildirilecek)`,
        );
      } else {
        const match = companions.find((c) => c.id === chosenId);
        if (match) {
          stayingGuestsDetails.push(
            `${i + 1}. ${match.name} (TC: ${match.tcNo})`,
          );
        } else {
          stayingGuestsDetails.push(
            `${i + 1}. Daha sonra eklenecek (Ev sahibine bildirilecek)`,
          );
        }
      }
    }

    const newBooking: Booking = {
      id: "RES-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      villaId: villa.id,
      villaName: villa.name,
      villaImage:
        villa.images[0] ||
        "https://images.unsplash.com/photo-1629812456605-4a044aa38fbc?auto=format&fit=crop&q=80&w=800",
      guestName: currentUser.name,
      guestPhone: currentUser.phone,
      guestEmail: currentUser.email,
      checkIn: bookingForm.checkIn,
      checkOut: bookingForm.checkOut,
      guestsCount: bookingForm.guestsCount,
      totalDays: days,
      totalPrice: finalTotalPrice,
      basePrice: total,
      discountAmount: campaignDiscountAmount,
      servicesCost: servicesCost,
      selectedServicesList: bookingForm.serviceQuantities ? 
        Object.entries(bookingForm.serviceQuantities)
          .filter(([_, qty]) => qty > 0)
          .map(([id, qty]) => {
            const srv = villa.services?.find(s => s.id === id);
            return {
              name: srv?.name || id,
              cost: srv ? (srv.type.includes("per_person") ? srv.price * bookingForm.guestsCount * qty : srv.price * qty) : 0,
              qty
            };
          }) : [],
      prepaymentAmount: onRezOdenecek,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...bookings];
    saveBookingsState(updated);
    setFormSuccess(true);

    // Dynamic Whatsapp text redirection
    setTimeout(() => {
      const waText = `Merhaba Villa Bungalov Tatil, sitemizden bir Ã¶n rezervasyon talebi baÅŸlattÄ±m:

ğŸ§¾ *Rezervasyon Kodu:* ${newBooking.id}
ğŸ¡ *Tesis:* ${newBooking.villaName} (${villa.region})
ğŸ“† *Tarihler:* ${formatTurkishDate(newBooking.checkIn)} - ${formatTurkishDate(newBooking.checkOut)} (${newBooking.totalDays} Gece)
ğŸ‘¥ *KiÅŸi SayÄ±sÄ±:* ${newBooking.guestsCount} Misafir
ğŸ‘¤ *Rezervasyon Sahibi:* ${currentUser.name} (TC: ${currentUser.tcNo})
ğŸ“ *Ä°rtibat:* ${currentUser.phone} / ${currentUser.email}

ğŸ‘¥ *Konaklayacak DiÄŸer KiÅŸiler (KBBS):*
${stayingGuestsDetails.map((g) => `   â€¢ ${g}`).join("\n")}

ğŸ›’ *SeÃ§ilen Ek Hizmetler:*
${srvTextList.length > 0 ? srvTextList.map((s) => `   â€¢ ${s}`).join("\n") : "   â€¢ Yok"}

ğŸ’µ *Ã–deme Hesap DaÄŸÄ±lÄ±mÄ±:*
   â€¢ Kiralama Bedeli (${days} Gece): â‚º${total.toLocaleString("tr-TR")}
${appliedCampaign ? `   â€¢ KampanyalÄ± Kiralama Bedeli: â‚º${rentalAfterDiscount.toLocaleString("tr-TR")} (Kod: ${appliedCampaign.code})\n` : ""}${servicesCost > 0 ? `   â€¢ Ekstra Hizmetler ToplamÄ±: â‚º${servicesCost.toLocaleString("tr-TR")}\n` : ""}   â€¢ Toplam Ã–deme: â‚º${finalTotalPrice.toLocaleString("tr-TR")}
   â€¢ *Kaparo %10:* â‚º${kaparo.toLocaleString("tr-TR")}
${prePaymentRate > 0 ? `   â€¢ *Ev Sahibi Ã–n Ã–demesi (%${prePaymentRate}):* â‚º${kesinPayment.toLocaleString("tr-TR")}\n` : ""}   â€¢ *Ã–n Rezervasyonda Ã–denecek:* â‚º${onRezOdenecek.toLocaleString("tr-TR")}
   â€¢ *KapÄ±da Kalan Ã–deme:* â‚º${kalanKapida.toLocaleString("tr-TR")}

â„¹ï¸ *Not:* Rezervasyon sÄ±rasÄ±nda sadece Ã¶n Ã¶deme (kaparo + ev sahibi Ã¶n Ã¶demesi + ek hizmetler) tahsil edilir, kalanÄ± kapÄ±da Ã¶dersiniz.

MÃ¼saitlik durumunu teyit ederek rezervasyonumu netleÅŸtirmek istiyorum. TeÅŸekkÃ¼rler!`;

      const encoded = encodeURIComponent(waText);
      const url = `https://wa.me/${AGENCY_DETAILS.whatsapp.replace("+", "")}?text=${encoded}`;
      window.open(url, "_blank");
      setQuickBookVilla(null);
    }, 1500);
  };

  // Host Action: Create a listing
  const handleCreateVilla = (e: React.FormEvent) => {
    e.preventDefault();

    // Choose premium cover photo presets depending on selected view types
    const presets: Record<string, string[]> = {
      preset1: [
        "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800",
      ],
      preset2: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
      ],
      preset3: [
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800",
      ],
    };

    const selectedImgSet = presets[newVillaForm.imagePreset] || presets.preset1;

    const newVilla: Villa = {
      id: "villa-added-" + Date.now(),
      name:
        newVillaForm.name ||
        (newVillaForm.isBoat ? "LÃ¼ks Ã–zel Yat" : "Ã–zel Bungalov Evi"),
      title:
        newVillaForm.title ||
        (newVillaForm.isBoat
          ? "KaptanlÄ± MuhteÅŸem Yat Kiralama"
          : "LÃ¼ks YaÅŸam ve DoÄŸa KaÃ§amaÄŸÄ±"),
      type: newVillaForm.isBoat ? "boat" : newVillaForm.type,
      region: newVillaForm.region,
      capacity: newVillaForm.capacity,
      bedrooms: newVillaForm.isBoat ? 3 : newVillaForm.bedrooms,
      bathrooms: newVillaForm.isBoat ? 2 : newVillaForm.bathrooms,
      pricePerNight: newVillaForm.pricePerNight,
      minNights: newVillaForm.minNights || 2,
      extraServices: newVillaForm.customExtraServices,
      features:
        newVillaForm.features.length > 0
          ? newVillaForm.features
          : ["wifi", "garden", "heated_pool"],
      images: selectedImgSet,
      description:
        newVillaForm.description ||
        "Ev sahibi tarafÄ±ndan paylaÅŸÄ±lan, benzersiz konfor barÄ±ndÄ±ran lÃ¼ks kiralama seÃ§eneÄŸi.",
      badge: newVillaForm.isBoat ? "â›µ Yat Kiralama" : "Yeni Ä°lan",
      whatsappMessage: "Merhaba! Yeni ilanÄ±nÄ±z hakkÄ±nda bilgi alabilir miyim?",
      rating: 5.0,
      reviewCount: 1,
      hostName: "Siz (Ev Sahibi)",
      hostAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      slogans: newVillaForm.slogans,
      catFeatures: newVillaForm.catFeatures,
      prePaymentRate: newVillaForm.prePaymentRate || 0,
      isBoat: newVillaForm.isBoat,
      boatDetails: newVillaForm.isBoat
        ? {
            boatType: newVillaForm.boatType,
            skipper: newVillaForm.skipper,
            concept: newVillaForm.concept,
            port: newVillaForm.port,
          }
        : undefined,
    };

    const updated = [newVilla, ...villas];
    saveVillasState(updated);
    setHostFormSuccess(true);
    setTimeout(() => {
      setHostFormSuccess(false);
      setShowAddVillaModal(false);
      // Reset form
      setNewVillaForm({
        name: "",
        title: "",
        type: "bungalow",
        region: "Ä°stanbul",
        capacity: 4,
        bedrooms: 2,
        bathrooms: 1,
        pricePerNight: 5000,
        minNights: 2,
        description: "",
        features: [],
        selectedExtraServices: [],
        badge: "Yeni Ä°lan",
        imagePreset: "preset1",
        slogans: ["entry", "outdoor", "peaceful"],
        prePaymentRate: 0,
        catFeatures: [
          "view_mountain",
          "bath_hairdryer",
          "bath_soap",
          "bath_hotwater",
          "bed_essentials",
          "bed_sheets",
          "temp_ac",
          "net_wifi",
          "kit_kitchen",
          "kit_fridge",
          "out_balcony",
          "park_free_prem",
          "park_pool",
        ],
        customExtraServices: [],
        isBoat: false,
        boatType: "Katamaran",
        skipper: "KaptanlÄ±",
        concept: "GÃ¼nlÃ¼k Koy Gezisi",
        port: "KuruÃ§eÅŸme MarinasÄ±, Ä°stanbul",
      });
    }, 2000);
  };

  const handleToggleNewVillaFeature = (feat: string) => {
    setNewVillaForm((prev) => {
      const alreadyHas = prev.features.includes(feat);
      return {
        ...prev,
        features: alreadyHas
          ? prev.features.filter((f) => f !== feat)
          : [...prev.features, feat],
      };
    });
  };

  // Host Action: Delete house listing
  const handleDeleteVilla = async (id: string) => {
    // Instead of completely removing, mark it as inactive and rejected, so admin can see it was deleted.
    const updated = villas.map((v) => v.id === id ? { ...v, isActive: false, approvalStatus: "rejected" as const } : v);
    saveVillasState(updated);
    try {
      // Assuming the API handles soft deletes or real deletes. If real delete, we still keep it locally as inactive for admin history.
      await fetch(`/api/villas/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Failed to delete villa from API", e);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean | undefined) => {
    const nextStatus = currentStatus === false ? true : false;
    const updated = villas.map(v => v.id === id ? { ...v, isActive: nextStatus } : v);
    saveVillasState(updated);
    try {
      await fetch(`/api/villas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus })
      });
    } catch (e) {
      console.error("Failed to toggle villa active status", e);
    }
  };

  // Admin & Host Action: Approve/Decline reservation requests
  const handleUpdateBookingStatus = (
    id: string,
    nextStatus: "confirmed" | "cancelled" | "pending",
  ) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: nextStatus } : b,
    );
    saveBookingsState(updated);
  };

  // Quick stats calculators
  const totalHostRevenueCapacity = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalPendingCount = bookings.filter(
    (b) => b.status === "pending",
  ).length;
  const totalApprovedCount = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;

  const matchedVilla = villas.find((v) => {
    const slug1 = getVillaSlug(v.name, v.region)
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();
    const slug2 = currentPath.replace(/^\/+|\/+$/g, "").toLowerCase();
    return slug1 === slug2;
  });

  return (
    <div
      className="min-h-screen bg-[#FAFAFA] font-sans text-stone-900 flex flex-col selection:bg-rose-100 selection:text-rose-900"
      id="app-root"
    >
      {/* Dynamic Upper Top informational Banner - Airbnb Look */}
      {currentPath === "/" && (
        <div className="bg-[#FF385C] text-white text-[11px] font-bold py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
          <BadgePercent className="h-4 w-4 animate-pulse shrink-0" />
          <span>
            {topBarText}
          </span>
        </div>
      )}

      {/* Main Navbar loaded with 3-role state orchestration */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        currentUser={currentUser}
        currentHost={currentHost}
        currentAdmin={currentAdmin}
        onOpenLogin={(role) => {
          setActiveLoginPopup(role);
          setActiveRegisterPopup(null);
        }}
        onLogout={handleLogout}
        bookingCount={totalPendingCount}
        favoriteCount={favorites.length}
        onShowBoats={() => setShowBoatsModal(true)}
        onShowTours={() => setShowToursModal(true)}
        onShowContact={() => setShowContactModal(true)}
        onShowCities={() => setShowCitiesModal(true)}
        onSelectRegion={(reg) => {
          setFilterRegion(reg);
        }}
        onSelectType={(typeStr) => {
          setFilterType(typeStr);
        }}
      />

      {/* ----------------- GUEST VIEW / LANDING PAGE ----------------- */}
      {currentPath === "/" && (
        <>
          {/* Authentic Airbnb Style Header Search Section */}
          <section
            className="relative bg-stone-950 py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
            id="hero-section"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center brightness-[0.25]" 
              style={{ backgroundImage: `url(${heroBgImage})` }}
            />

            <div className="relative mx-auto max-w-4xl flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3.5 py-1 text-xs font-semibold text-rose-300 border border-white/10 mb-4">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
                <span>{heroSlogan}</span>
              </span>

              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                {heroTitle}
              </h1>
              <p className="mt-4 text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed font-sans">
                {heroDescription}
              </p>

              {/* Master Airbnb Search Widget */}
              <div className="mt-8 w-full max-w-3xl bg-white rounded-3xl shadow-xl p-4 border border-stone-150 text-left">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  {/* Region picker dropdown */}
                  <div className="flex flex-col gap-1 px-2 md:border-r md:border-stone-100">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1 font-display">
                      BÃ¶lge
                    </label>
                    <div className="relative">
                      <select
                        value={filterRegion}
                        onChange={(e) => setFilterRegion(e.target.value)}
                        className="w-full bg-transparent border-0 text-xs font-semibold text-stone-850 focus:outline-none cursor-pointer appearance-none py-1 pr-6"
                      >
                        {REGIONS.map((reg) => (
                          <option
                            key={reg}
                            value={reg}
                            className="text-stone-850 font-sans"
                          >
                            {reg === "Hepsi" ? "Nereye Gidiyorsunuz?" : reg}
                          </option>
                        ))}
                      </select>
                      <MapPin className="absolute top-1 right-1 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Mekan TÃ¼rÃ¼ Picker (Lists housing types) */}
                  <div className="flex flex-col gap-1 px-2 md:border-r md:border-stone-100">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1 font-display">
                      Mekan TÃ¼rÃ¼
                    </label>
                    <div className="relative">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full bg-transparent border-0 text-xs font-semibold text-stone-850 focus:outline-none cursor-pointer appearance-none py-1 pr-6"
                      >
                        <option value="all">Ne TÃ¼r Bir Yer?</option>
                        {Object.entries(VILLA_TYPES_MAP).map(([key, val]) => (
                          <option
                            key={key}
                            value={key}
                            className="text-stone-850 font-sans"
                          >
                            {val.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute top-1 right-1 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Guests restriction (Interactive minus/plus selectors) */}
                  <div className="flex flex-col gap-1 px-2 md:border-r md:border-stone-100">
                    <label className="text-[10px] font-black text-[#FF385C] uppercase tracking-widest pl-1 font-display">
                      Misafirler
                    </label>
                    <div className="flex items-center justify-between py-1 bg-stone-50 rounded-xl px-2 border border-stone-200">
                      <button
                        type="button"
                        onClick={() => setSearchGuests((prev) => Math.max(0, prev - 1))}
                        className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:border-[#FF385C] hover:text-[#FF385C] active:scale-95 transition cursor-pointer font-bold text-xs bg-white"
                      >
                        -
                      </button>
                      <span className="text-xs font-extrabold text-stone-800 select-none">
                        {searchGuests > 0 ? `${searchGuests} Misafir` : "KiÅŸi Ekle"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSearchGuests((prev) => Math.min(20, prev + 1))}
                        className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:border-[#FF385C] hover:text-[#FF385C] active:scale-95 transition cursor-pointer font-bold text-xs bg-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Search triggering inside grid */}
                  <div className="px-2">
                    <button
                      type="button"
                      onClick={() => {
                        const element = document.getElementById("villas-list-section");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FF385C] hover:bg-[#E02647] py-3 text-xs font-extrabold text-white transition-all shadow-md active:scale-95 cursor-pointer uppercase tracking-wider"
                    >
                      <Search className="h-4 w-4" />
                      <span className="hidden md:inline">REZERVASYON ARA</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Airbnb Category Carousel - High-fidelity icons */}
          <section
            className="bg-white border-b border-stone-150 py-4"
            id="filters-carousel"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
                {/* Horizontal Category pills mapping with beautiful icons */}
                <div className="flex items-center gap-8 min-w-max pb-1">
                  {/* Category 1 */}
                  <button
                    onClick={() => setFilterType("all")}
                    className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all ${
                      filterType === "all"
                        ? "border-stone-900 text-stone-900 font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    <Home className="h-5 w-5" />
                    <span>TÃ¼m Evler</span>
                  </button>

                  {/* Category 2 */}
                  <button
                    onClick={() => setFilterType("muhafazakar")}
                    className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all ${
                      filterType === "muhafazakar"
                        ? "border-stone-900 text-[#FF385C] font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span>Muhafazakar Villalar</span>
                  </button>

                  {/* Category 3 */}
                  <button
                    onClick={() => setFilterType("balayi")}
                    className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all ${
                      filterType === "balayi"
                        ? "border-stone-900 text-[#FF385C] font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    <Heart className="h-5 w-5 text-[#FF385C] fill-[#FF385C]" />
                    <span>BalayÄ± VillalarÄ±</span>
                  </button>

                  {/* Category 4 */}
                  <button
                    onClick={() => setFilterType("villa")}
                    className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all ${
                      filterType === "villa"
                        ? "border-stone-900 text-[#FF385C] font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    <Building className="h-5 w-5" />
                    <span>LÃ¼ks Villalar</span>
                  </button>

                  {/* Category 5 */}
                  <button
                    onClick={() => setFilterType("apartment")}
                    className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all ${
                      filterType === "apartment"
                        ? "border-stone-900 text-[#FF385C] font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    <Compass className="h-5 w-5" />
                    <span>Daireler</span>
                  </button>

                  {/* Category 6 */}
                  <button
                    onClick={() => setFilterType("bungalow")}
                    className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all ${
                      filterType === "bungalow"
                        ? "border-stone-900 text-[#FF385C] font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    <Tent className="h-5 w-5" />
                    <span>Bungalovlar</span>
                  </button>
                </div>

                {/* Vertical Divider */}
                <div className="h-10 w-px bg-stone-200 hidden md:block" />

                {/* Quick Filters Toggle & Reset */}
                <div className="hidden md:flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-stone-400" />
                  <span className="text-xs text-stone-500 font-extrabold mr-2 uppercase tracking-wide">
                    Filtre :
                  </span>
                  <div className="flex gap-1.5 font-sans">
                    {[
                      { key: "heated_pool", label: "Havuz", icon: "♨️" },
                      { key: "jacuzzi", label: "Jakuzi", icon: "🛁" },
                      { key: "pet_friendly", label: "Evcil Dostu", icon: "🐾" },
                    ].map((item) => {
                      const active = activeAmenities.includes(item.key);
                      return (
                        <button
                          key={item.key}
                          onClick={() => toggleAmenityFilter(item.key)}
                          className={`rounded-xl px-3 py-1 text-xs font-bold border transition duration-150 flex items-center gap-1 cursor-pointer ${
                            active
                              ? "bg-rose-50 border-[#FF385C] text-[#FF385C] shadow-sm font-extrabold"
                              : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-white hover:text-stone-800"
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Content Body (Search Result, Wishlisted widget, listings count) */}
          <main
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1"
            id="main-content"
          >
            {/* Custom LED Pulsing Keyframe Style */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes led-pulse {
                0%, 100% {
                  border-color: #ff385c;
                  box-shadow: 0 0 5px rgba(255, 56, 92, 0.4), inset 0 0 3px rgba(255, 56, 92, 0.2);
                }
                50% {
                  border-color: #f87171;
                  box-shadow: 0 0 15px rgba(248, 113, 113, 0.8), inset 0 0 8px rgba(248, 113, 113, 0.4);
                }
              }
              @keyframes led-pulse-green {
                0%, 100% {
                  border-color: #10b981;
                  box-shadow: 0 0 5px rgba(16, 185, 129, 0.4), inset 0 0 3px rgba(16, 185, 129, 0.2);
                }
                50% {
                  border-color: #34d399;
                  box-shadow: 0 0 15px rgba(52, 211, 153, 0.8), inset 0 0 8px rgba(52, 211, 153, 0.4);
                }
              }
              @keyframes led-pulse-blue {
                0%, 100% {
                  border-color: #3b82f6;
                  box-shadow: 0 0 5px rgba(59, 130, 246, 0.4), inset 0 0 3px rgba(59, 130, 246, 0.2);
                }
                50% {
                  border-color: #60a5fa;
                  box-shadow: 0 0 15px rgba(96, 165, 250, 0.8), inset 0 0 8px rgba(96, 165, 250, 0.4);
                }
              }
              .led-flash-box {
                border-width: 2px;
                animation: led-pulse 2s infinite ease-in-out;
              }
              .led-flash-box-green {
                border-width: 2px;
                animation: led-pulse-green 2s infinite ease-in-out;
              }
              .led-flash-box-blue {
                border-width: 2px;
                animation: led-pulse-blue 2s infinite ease-in-out;
              }
            `}} />

            {/* Quick status notice if search conditions active (Placed on top of the boxes) */}
            {(filterRegion !== "Hepsi" ||
              filterType !== "all" ||
              searchQuery ||
              activeAmenities.length > 0 ||
              searchGuests > 0) && (
              <div className="mb-8 rounded-2xl bg-[#5c0618] border border-[#7f0f25] p-5 flex flex-col gap-4 text-xs shadow-md">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <div className="text-rose-100/90 font-medium font-sans">
                      AradÄ±ÄŸÄ±nÄ±z Kriterlerle EÅŸleÅŸen
                    </div>
                    <div className="text-sm font-black text-white">
                      {filteredVillas.length} Ä°lan Listeleniyor
                    </div>
                    {/* Small tag representations for active filters */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {filterRegion !== "Hepsi" && (
                        <span className="bg-[#780e22] text-rose-100 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                          ğŸ“ {filterRegion}
                        </span>
                      )}
                      {filterType !== "all" && (
                        <span className="bg-[#780e22] text-rose-100 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                          ğŸ¡ {VILLA_TYPES_MAP[filterType as keyof typeof VILLA_TYPES_MAP]?.label || filterType}
                        </span>
                      )}
                      {searchGuests > 0 && (
                        <span className="bg-[#780e22] text-rose-100 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                          ğŸ‘¥ {searchGuests} KiÅŸi
                        </span>
                      )}
                      {activeAmenities.map(am => (
                        <span key={am} className="bg-[#780e22] text-rose-100 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                          âœ¨ {am === 'heated_pool' ? 'Havuzlu' : am === 'jacuzzi' ? 'Jakuzili' : am === 'pet_friendly' ? 'Evcil Dostu' : am === 'air_conditioning' ? 'KlimalÄ±' : '+30 DonanÄ±m'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFilterRegion("Hepsi");
                      setFilterType("all");
                      setSearchQuery("");
                      setActiveAmenities([]);
                      setSearchGuests(0);
                    }}
                    className="font-bold text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition-all uppercase tracking-wider text-[10px] whitespace-nowrap text-center self-start sm:self-auto"
                  >
                    Filtreleri Temizle
                  </button>
                </div>

                {filteredVillas.length > 0 && (
                  <div className="mt-2 text-left">
                    <div className="h-px bg-white/10 mb-4" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {filteredVillas.map((v) => {
                        const isFav = favorites.includes(v.id);
                        return (
                          <div
                            key={v.id}
                            onClick={() => setSelectedVilla(v)}
                            className="group flex flex-col gap-1 cursor-pointer bg-[#3f020f] p-2 rounded-xl border border-white/5 hover:border-[#FF385C]/60 transition-all duration-200 hover:scale-[1.015]"
                          >
                            <div className="aspect-square rounded-lg overflow-hidden relative bg-stone-900">
                              <img
                                src={v.images[0]}
                                alt={v.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-[8px] text-white font-extrabold px-1 rounded-sm">
                                {v.region}
                              </span>
                              {isFav && (
                                <span className="absolute top-1 right-1 bg-[#FF385C] text-white text-[8px] p-0.5 rounded-full scale-100 animate-pulse">
                                  â¤ï¸
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-bold text-white truncate leading-tight group-hover:text-amber-400 mt-1">
                              {v.name}
                            </span>
                            <span className="text-[10px] text-rose-200/90 font-mono">
                              â‚º{v.pricePerNight.toLocaleString("tr-TR")}/gece
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Restructured Box Layout with %100 Para Ä°ade GÃ¼vencesi at the top */}
            <div className="space-y-6 mb-12">
              {/* Box 1 (On top/Full-width) */}
              <div className="led-flash-box bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6 transition-all hover:scale-[1.005]">
                <div className="flex flex-col md:flex-row items-center gap-5">
                  <div className="h-14 w-14 rounded-full bg-rose-50 flex items-center justify-center text-[#FF385C] shrink-0">
                    <BadgePercent className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-stone-900 font-display">
                      %100 Para Ä°ade GÃ¼vencesi
                    </h4>
                    <p className="mt-1 text-xs text-stone-500 max-w-xl font-sans">
                      Rezervasyon tarihinizden 30 gÃ¼n Ã¶ncesine kadar Ã¼cretsiz iptal hakkÄ± ve %100 kesintisiz para iadesi sunuyoruz. GÃ¼venle yerinizi ayÄ±rtÄ±n.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="rounded-xl bg-[#FF385C] hover:bg-[#E02647] px-5 py-2.5 text-xs font-bold text-white transition active:scale-95 shrink-0 uppercase tracking-wider"
                >
                  Ãœcretsiz Ä°ptal KoÅŸullarÄ±
                </button>
              </div>

              {/* Box 2 & Box 3 side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Box 2 */}
                <div className="led-flash-box-green bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:scale-[1.01]">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-extrabold text-stone-900 font-display">
                    Ã–zel Havuzlu Villalar
                  </h4>
                  <p className="mt-2 text-xs text-stone-500 leading-relaxed font-sans px-2">
                    Kendinize ait Ã¶zel havuzlu villalarÄ±mÄ±zda serinlemenin keyfini Ã§Ä±karÄ±n. Mahremiyet ve konforun tadÄ±nÄ± Ã§Ä±karÄ±n.
                  </p>
                </div>

                {/* Box 3 */}
                <div className="led-flash-box-blue bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:scale-[1.01]">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-extrabold text-stone-900 font-display">
                    7/24 Destek
                  </h4>
                  <p className="mt-2 text-xs text-stone-500 leading-relaxed font-sans px-2">
                    Tatiliniz boyunca ihtiyaÃ§ duyduÄŸunuz her an, deneyimli destek ekibimiz sizi bekliyor. Size yardÄ±mcÄ± olmak iÃ§in buradayÄ±z.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Refund Modal Overlay */}
            {showRefundModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-250 relative text-left">
                  <button
                    onClick={() => setShowRefundModal(false)}
                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center text-[#FF385C]">
                      <BadgePercent className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-extrabold text-stone-900 font-display">
                      Ä°ptal ve Ä°ade Garantisi
                    </h3>
                  </div>
                  <div className="space-y-3.5 text-xs text-stone-600 leading-relaxed font-sans">
                    <p>
                      <strong>%100 Para Ä°ade GÃ¼vencesi:</strong> GiriÅŸ tarihinizden 30 gÃ¼n Ã¶ncesine kadar olan rezervasyon talebi iptallerinde, Ã¶dediÄŸiniz Ã¶n Ã¶deme oranÄ±nÄ±n tamamÄ±nÄ± hiÃ§bir kesinti olmaksÄ±zÄ±n hesabÄ±nÄ±za iade ediyoruz.
                    </p>
                    <p>
                      <strong>MÃ¼cbir Sebepler & DoÄŸal Haller:</strong> OlaÄŸanÃ¼stÃ¼ doÄŸa olaylarÄ±, hastalÄ±k veya seyahat kÄ±sÄ±tlamalarÄ± gibi beklenmeyen durumlarda, Ã¶demeniz bir sonraki konaklamanÄ±zda kullanÄ±lmak Ã¼zere koruma altÄ±na alÄ±nÄ±r.
                    </p>
                    <p>
                      GÃ¶nÃ¼l rahatlÄ±ÄŸÄ±yla erken rezervasyon ayrÄ±calÄ±klarÄ±ndan ÅŸimdi faydalanÄ±n!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowRefundModal(false)}
                    className="mt-6 w-full py-3 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-bold transition active:scale-95"
                  >
                    AnladÄ±m, Kapat
                  </button>
                </div>
              </div>
            )}

            {favorites.length > 0 && (
              <section className="mb-10 bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-[#FF385C] fill-[#FF385C]" />
                  <h3 className="text-sm font-bold text-stone-900 font-display">
                    Favorileriniz
                  </h3>
                  <span className="text-xs text-stone-400">
                    ({favorites.length} Ä°lgi Duyulan Ev)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
                  {villas
                    .filter((v) => favorites.includes(v.id))
                    .map((v) => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVilla(v)}
                        className="group flex flex-col gap-1 cursor-pointer bg-stone-50 p-2 rounded-xl border border-stone-100 hover:border-stone-300 transition"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden relative">
                          <img
                            src={v.images[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-xs font-bold text-stone-900 truncate leading-tight group-hover:text-[#FF385C]">
                          {v.name}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          â‚º{v.pricePerNight.toLocaleString("tr-TR")}/gece
                        </span>
                      </div>
                    ))}
                </div>
              </section>
            )}





            {/* Displaying Villa Grid */}
            {filteredVillas.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/70 p-8">
                <BadgeAlert className="h-12 w-12 text-[#FF385C] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-stone-800">
                  SeÃ§tiÄŸiniz Kriterlerde Konaklama BulunamadÄ±
                </h3>
                <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  Ä°puÃ§larÄ±: BÃ¶lge filtresini 'TÃ¼m Sapanca KÃ¶yleri' yapabilir
                  veya diÄŸer Ã¶zellikleri geniÅŸleterek ev sahiplerinin mÃ¼sait
                  evlerine gÃ¶z atabilirsiniz.
                </p>
                <button
                  onClick={() => {
                    setFilterRegion("Hepsi");
                    setFilterType("all");
                    setSearchQuery("");
                    setActiveAmenities([]);
                    setSearchGuests(0);
                  }}
                  className="mt-6 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white transition active:scale-95"
                >
                  TÃ¼m Tesisleri Tekrar Listele
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVillas.map((villa) => (
                  <VillaCard
                    key={villa.id}
                    villa={villa}
                    isFavorite={favorites.includes(villa.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={(v) => {
                      setSelectedVilla(v);
                      setSelectedDetailImageIndex(0);
                    }}
                    onQuickBook={handleOpenQuickBook}
                    onGoToDetail={(v) => {
                      navigateTo(getVillaSlug(v.name, v.region));
                    }}
                  />
                ))}
              </div>
            )}

            {(() => {
              const activeVillas = villas.filter(v => v.isActive !== false && (v.approvalStatus === "approved" || v.approvalStatus === undefined));
              
              const muhafazakarVillas = activeVillas.filter(v => 
                v.title.toLowerCase().includes("muhafazakar") || 
                v.title.toLowerCase().includes("korunaklÄ±") || 
                v.description.toLowerCase().includes("muhafazakar") ||
                (v.badge && (v.badge.toLowerCase().includes("muhafazakar") || v.badge.toLowerCase().includes("korunaklÄ±")))
              ).slice(0, 3);
              const finalMuhafazakar = muhafazakarVillas.length >= 3 ? muhafazakarVillas : [...muhafazakarVillas, ...activeVillas.filter(v => !muhafazakarVillas.includes(v))].slice(0, 3);

              const balayiVillas = activeVillas.filter(v => 
                v.title.toLowerCase().includes("balayÄ±") || 
                v.title.toLowerCase().includes("romantik") || 
                v.description.toLowerCase().includes("balayÄ±") ||
                v.type === "balayi"
              ).slice(0, 3);
              const finalBalayi = balayiVillas.length >= 3 ? balayiVillas : [...balayiVillas, ...activeVillas.filter(v => !balayiVillas.includes(v))].slice(0, 3);

              const hemenVillas = activeVillas.filter(v => 
                v.title.toLowerCase().includes("anÄ±nda") || 
                v.title.toLowerCase().includes("hemen") || 
                v.instantBook || 
                v.id.toString().includes("instant") ||
                v.id.toString().includes("vip")
              ).slice(0, 3);
              const finalHemen = hemenVillas.length >= 3 ? hemenVillas : [...hemenVillas, ...activeVillas.filter(v => !hemenVillas.includes(v))].slice(0, 3);

              const anindaVillas = activeVillas.filter(v => 
                v.title.toLowerCase().includes("anÄ±nda") || 
                v.instantBook || 
                v.id.toString().includes("instant")
              ).slice(0, 3);
              const finalAninda = anindaVillas.length >= 3 ? anindaVillas : [...anindaVillas, ...villas.filter(v => !anindaVillas.includes(v))].slice(0, 3);

              return (
                <div className="space-y-20 mt-16 animate-in fade-in duration-500">
                  {/* Muhafazakar Villalar */}
                  <section id="muhafazakar-collection" className="scroll-mt-20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 21c-4.4 0-8-3.6-8-8c0-2.4.6-5.4 3-6.4C8.5 6 10.5 5 12 5s3.5 1 5 1.6c2.4 1 3 4 3 6.4c0 4.4-3.6 8-8 8z" />
                          <path d="M12 5V2.5" />
                          <path d="M9 13.5a3 3 0 0 0 6 0" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-stone-900 font-display">
                          Muhafazakar Villalar
                        </h3>
                        <p className="text-xs text-stone-500 font-sans">
                          DÄ±ÅŸarÄ±dan gÃ¶rÃ¼nmeyen korunaklÄ± havuz alanlarÄ±yla aileniz ve sevdikleriniz iÃ§in tam mahremiyet
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                      {finalMuhafazakar.map((villa) => (
                        <VillaCard
                          key={`muhafazakar-${villa.id}`}
                          villa={villa}
                          isFavorite={favorites.includes(villa.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onSelect={(v) => {
                            setSelectedVilla(v);
                            setSelectedDetailImageIndex(0);
                          }}
                          onQuickBook={handleOpenQuickBook}
                          onGoToDetail={(v) => {
                            navigateTo(getVillaSlug(v.name, v.region));
                          }}
                        />
                      ))}
                    </div>
                  </section>

                  {/* BalayÄ± VillalarÄ± */}
                  <section id="balayi-collection" className="scroll-mt-20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 21c-3.5 0-6.5-2.5-7-6-.5-3.5 1.5-6.5 5-7l1.5-.2V6c0-1.5 1-2.5 2.5-2.5S16.5 4.5 16.5 6v1.8c3.5.5 5.5 3.5 5 7-.5 3.5-3.5 6-7 6.2" />
                          <circle cx="12" cy="11" r="1.5" />
                          <path d="M9.5 15.5a4 4 0 0 1 5 0M8 8a3.5 3.5 0 0 1 8 0" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-stone-900 font-display">
                          BalayÄ± VillalarÄ±
                        </h3>
                        <p className="text-xs text-stone-500 font-sans">
                          Yeni evlenen Ã§iftlere Ã¶zel jakuzili, ÅŸÃ¶mineli ve sÄ±cak havuzlu en romantik kaÃ§Ä±ÅŸ rotalarÄ±
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                      {finalBalayi.map((villa) => (
                        <VillaCard
                          key={`balayi-${villa.id}`}
                          villa={villa}
                          isFavorite={favorites.includes(villa.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onSelect={(v) => {
                            setSelectedVilla(v);
                            setSelectedDetailImageIndex(0);
                          }}
                          onQuickBook={handleOpenQuickBook}
                          onGoToDetail={(v) => {
                            navigateTo(getVillaSlug(v.name, v.region));
                          }}
                        />
                      ))}
                    </div>
                  </section>

                  {/* Hemen Kiralanabilir Villalar */}
                  <section id="hemen-kiralik" className="scroll-mt-20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-stone-900 font-display">
                          Hemen Kiralanabilir Villalar
                        </h3>
                        <p className="text-xs text-stone-500 font-sans">
                          Sezonun en hit konumlarÄ±nda beklemeden hemen yerinizi ayÄ±rtabileceÄŸiniz fÄ±rsat mÃ¼lkleri
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                      {finalHemen.map((villa) => (
                        <VillaCard
                          key={`hemen-${villa.id}`}
                          villa={villa}
                          isFavorite={favorites.includes(villa.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onSelect={(v) => {
                            setSelectedVilla(v);
                            setSelectedDetailImageIndex(0);
                          }}
                          onQuickBook={handleOpenQuickBook}
                          onGoToDetail={(v) => {
                            navigateTo(getVillaSlug(v.name, v.region));
                          }}
                        />
                      ))}
                    </div>
                  </section>

                  {/* AnÄ±nda Rezervasyon */}
                  <section id="aninda-rezervasyon" className="scroll-mt-20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                          <path d="M12 2a10 10 0 0 1 10 10c0 1.25-.23 2.45-.65 3.5l-2-2.35M2.65 8.5C2.23 7.45 2 6.25 2 5a10 10 0 0 1 10-10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-stone-900 font-display">
                          Ã–n Onay Beklemeden AnÄ±nda Rezervasyon AyrÄ±calÄ±ÄŸÄ±!
                        </h3>
                        <p className="text-xs text-stone-500 font-sans">
                          Saatlerce cevap beklemeye son! Rezervasyon talebiniz mÃ¼lk sahibine anÄ±nda iletilir ve onaylanÄ±r
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                      {finalAninda.map((villa) => (
                        <VillaCard
                          key={`aninda-${villa.id}`}
                          villa={villa}
                          isFavorite={favorites.includes(villa.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onSelect={(v) => {
                            setSelectedVilla(v);
                            setSelectedDetailImageIndex(0);
                          }}
                          onQuickBook={handleOpenQuickBook}
                          onGoToDetail={(v) => {
                            navigateTo(getVillaSlug(v.name, v.region));
                          }}
                        />
                      ))}
                    </div>
                  </section>

                  {/* Misafir YorumlarÄ± Grid */}
                  <section id="misafir-yorumlari" className="scroll-mt-20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-stone-900 font-display">
                          Misafir YorumlarÄ±
                        </h3>
                        <p className="text-xs text-stone-500 font-sans">
                          {reviewsSubtitle}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                      {reviewsData.map((review, rIdx) => (
                        <div key={rIdx} className="bg-white border border-stone-150 p-4 rounded-2xl shadow-xs transition hover:shadow-md flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center gap-1.5 mb-2.5">
                              <div className="h-6 w-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-[9px] uppercase font-display">
                                {review.name.substring(0,2)}
                              </div>
                              <span className="text-xs font-bold text-stone-900">{review.name}</span>
                            </div>
                            <div className="flex text-amber-500 gap-0.5 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                              ))}
                            </div>
                            <p className="text-[11px] text-stone-600 leading-normal line-clamp-4 font-sans italic">
                              "{review.comment}"
                            </p>
                          </div>
                          <div className="mt-4 pt-2 border-t border-stone-100">
                            <span className="text-[9px] font-semibold text-[#FF385C] block truncate">
                              {review.property}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* SÄ±kÃ§a Sorulan Sorular FAQ Section */}
                  <section id="sss-accordion-section" className="bg-stone-950 text-stone-100 p-8 sm:p-12 rounded-3xl border border-stone-900 shadow-xl scroll-mt-20 text-left">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-10 w-10 bg-stone-900 rounded-full flex items-center justify-center text-[#FF385C] border border-[#FF385C]/35">
                        <HelpCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold tracking-tight text-white font-display">
                          SÄ±kÃ§a Sorulan Sorular
                        </h3>
                        <p className="text-xs text-stone-400 font-sans">
                          {faqSubtitle}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3.5 max-w-4xl">
                      {faqList.map((faq, index) => {
                        const isOpen = activeFaqIndex === index;
                        return (
                          <div key={index} className="border-b border-stone-850 pb-3">
                            <button
                              onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                              className="w-full flex items-center justify-between py-3 text-left hover:text-[#FF385C] transition-colors focus:outline-none"
                            >
                              <span className="text-sm font-bold tracking-tight font-display">{faq.q}</span>
                              <ChevronDown className={`h-4 w-4 text-stone-500 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-[#FF385C]" : ""}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 max-h-0 ${isOpen ? "max-h-52 mt-2" : ""}`}>
                              <p className="text-[12px] text-stone-300 leading-relaxed font-sans pb-3 pl-1">
                                {faq.a}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Ã–zel Evler Section */}
                  <section id="ozel-evler" className="bg-stone-50 border border-stone-150 p-8 sm:p-12 rounded-3xl shadow-xs scroll-mt-20 text-left">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-10 w-10 bg-white rounded-full border border-stone-150 flex items-center justify-center text-[#FF385C] shadow-sm">
                        <Home className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-stone-900 font-display">
                          Ã–zel Evler Listesi
                        </h3>
                        <p className="text-xs text-stone-500 font-sans">
                          {area1Subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                      {area1Titles.map((title, idx) => {
                        const currentYear = new Date().getFullYear();
                        const fullTitle = `${title} ${currentYear}`;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSpecialSelection(title)}
                            className="group flex items-center justify-between py-2 text-left text-xs font-bold text-stone-700 hover:text-[#FF385C] border-b border-stone-150 transition-colors w-full cursor-pointer"
                          >
                            <span>{fullTitle}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* YararlÄ± Bilgiler Section */}
                  <section id="yararli-bilgiler" className="scroll-mt-20 text-left">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 bg-[#FF385C]/10 rounded-full flex items-center justify-center text-[#FF385C]">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                          <path d="M6 6h10"/>
                          <path d="M6 10h10"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-stone-900 font-display">
                          KiralÄ±k Villa ve Bungalov SeÃ§enekleri ile Ä°zole ve Konforlu Bir Tatil
                        </h3>
                        <p className="text-xs text-stone-500 font-sans">
                          SÄ±cak, Ã¶zgÃ¼r ve gÃ¼venli bir konaklama rehberi
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8 max-w-5xl bg-stone-50 border border-stone-150 p-6 sm:p-10 rounded-3xl text-xs text-stone-600 font-sans leading-relaxed">
                      
                      {/* Intro */}
                      <p className="text-sm text-stone-700 leading-relaxed font-medium">
                        Klasik otel tatillerinin kalabalÄ±k, gÃ¼rÃ¼ltÃ¼lÃ¼ ve katÄ± kurallarla dolu atmosferi yerini artÄ±k Ã¶zgÃ¼rlÃ¼ÄŸe bÄ±rakÄ±yor. GÃ¼nÃ¼mÃ¼zde tatilciler; Ã§iftlerden kalabalÄ±k ailelere, arkadaÅŸ gruplarÄ±ndan kafa dinlemek isteyen bireysel gezginlere kadar herkes, kendi kurallarÄ±nÄ± koyabileceÄŸi bir alan arÄ±yor. Ä°ÅŸte tam bu noktada <strong>villabungalovtatil.com.tr</strong> olarak, hayalinizdeki konforlu ve mahremiyet odaklÄ± tatili ayaÄŸÄ±nÄ±za getiriyoruz. LÃ¼ks bir kiralÄ±k villa keyfi ya da doÄŸanÄ±n kalbinde sÄ±cak bir bungalov deneyimi... AradÄ±ÄŸÄ±nÄ±z huzur ve Ã¶zgÃ¼rlÃ¼k burada baÅŸlÄ±yor.
                      </p>

                      {/* Neden Villa ve Bungalov KiralamalÄ±sÄ±nÄ±z */}
                      <div className="pt-4 border-t border-stone-200">
                        <h4 className="text-base font-extrabold text-[#FF385C] uppercase tracking-wider mb-4 font-display">
                          Neden Villa ve Bungalov KiralamalÄ±sÄ±nÄ±z?
                        </h4>
                        <p className="mb-4">
                          Geleneksel konaklama alternatifleri yerine Ã¶zel bir villa veya bungalov tercih etmek, tatilinizi tamamen kiÅŸiselleÅŸtirmenizi saÄŸlar. Ä°ÅŸte Ã¶ne Ã§Ä±kan avantajlar:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                          <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs">
                            <span className="text-[#FF385C] text-lg font-black block mb-2">1. KiÅŸiselleÅŸtirilmiÅŸ Tatil Ã–zgÃ¼rlÃ¼ÄŸÃ¼</span>
                            <ul className="space-y-3.5 text-stone-500">
                              <li>
                                <strong className="text-stone-800 block">Kendi ProgramÄ±nÄ±zÄ± YapÄ±n:</strong>
                                Yemek saatleri, havuz kullanÄ±m vakitleri ya da uyandÄ±ÄŸÄ±nÄ±z an tamamen size ait. Otellerdeki gibi kuyruÄŸa girmek veya kahvaltÄ± saatini kaÃ§Ä±rma stresi yok.
                              </li>
                              <li>
                                <strong className="text-stone-800 block">GeniÅŸ Gruplar Ä°Ã§in Ä°deal:</strong>
                                KalabalÄ±k aileler ve arkadaÅŸ gruplarÄ± ortak alanlarda eÄŸlenirken, her odanÄ±n kendine ait banyo ve yaÅŸam alanÄ± sunmasÄ± sayesinde mahremiyet korunur.
                              </li>
                              <li>
                                <strong className="text-stone-800 block">Romantik KaÃ§amaklar:</strong>
                                Jakuzili, ÅŸÃ¶mineli bungalovlar veya panoramik deniz manzaralÄ± villalar, baÅŸ baÅŸa kalmak isteyen Ã§iftler iÃ§in eÅŸsiz bir atmosfer sunar.
                              </li>
                            </ul>
                          </div>

                          <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs">
                            <span className="text-[#FF385C] text-lg font-black block mb-2">2. Maksimum Mahremiyet ve Size Ã–zel Alanlar</span>
                            <ul className="space-y-3.5 text-stone-500">
                              <li>
                                <strong className="text-stone-800 block">Tamamen Size Ait:</strong>
                                Ã–zel havuz, geniÅŸ bahÃ§e ve evin tÃ¼m bÃ¶lÃ¼mleri yalnÄ±zca sizin ve sevdiklerinizin kullanÄ±mÄ±ndadÄ±r.
                              </li>
                              <li>
                                <strong className="text-stone-800 block">Ã–zgÃ¼rce EÄŸlenin:</strong>
                                BaÅŸkalarÄ±nÄ± rahatsÄ±z etme endiÅŸesi taÅŸÄ±madan mÃ¼zik dinleyebilir, havuz baÅŸÄ± partileri verebilir ya da sadece doÄŸanÄ±n sessizliÄŸini dinleyebilirsiniz.
                              </li>
                            </ul>
                          </div>

                          <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs">
                            <span className="text-[#FF385C] text-lg font-black block mb-2">3. Ekonomik ve BÃ¼tÃ§e Dostu Ã‡Ã¶zÃ¼mler</span>
                            <ul className="space-y-3.5 text-stone-500">
                              <li>
                                <strong className="text-stone-800 block">Maliyet PaylaÅŸÄ±mÄ±:</strong>
                                BÃ¼yÃ¼k gruplarla yapÄ±lan villa kiralamalarÄ±nda, kiÅŸi baÅŸÄ±na dÃ¼ÅŸen maliyet lÃ¼ks otellere kÄ±yasla Ã§ok daha ekonomiktir.
                              </li>
                              <li>
                                <strong className="text-stone-800 block">Mutfak Ã–zgÃ¼rlÃ¼ÄŸÃ¼:</strong>
                                Tam donanÄ±mlÄ± mutfaÄŸÄ±nÄ±zda, yerel pazarlardan taze malzemeler alarak kendi yemeÄŸinizi hazÄ±rlayabilir, restoran masraflarÄ±nÄ± minimuma indirebilirsiniz.
                              </li>
                              <li>
                                <strong className="text-stone-800 block">Uzun DÃ¶nem FÄ±rsatlarÄ±:</strong>
                                HaftalÄ±k veya aylÄ±k konaklamalarda villabungalovtatil.com.tr'ye Ã¶zel uzun dÃ¶nem indirimlerinden yararlanabilirsiniz.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* TarzÄ±nÄ±za Uygun Lokasyon ve Ã–zellikleri */}
                      <div className="pt-4 border-t border-stone-200">
                        <h4 className="text-base font-extrabold text-[#FF385C] uppercase tracking-wider mb-2 font-display">
                          TarzÄ±nÄ±za Uygun Lokasyon ve Villa Ã–zellikleri
                        </h4>
                        <p className="mb-4 text-stone-500">
                          Tatilden beklentiniz ne olursa olsun, portfÃ¶yÃ¼mÃ¼zde size uygun bir seÃ§enek mutlaka var.
                        </p>

                        <div className="overflow-x-auto bg-white rounded-2xl border border-stone-200">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-stone-50 border-b border-stone-150 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                                <th className="p-4 font-display">Tatil Konsepti</th>
                                <th className="p-4 font-display">Ã–ne Ã‡Ä±kan Ã–zellikler</th>
                                <th className="p-4 font-display">Aktivite SeÃ§enekleri</th>
                              </tr>
                            </thead>
                            <tbody className="text-[11px] text-stone-600 divide-y divide-stone-150">
                              <tr>
                                <td className="p-4 font-bold text-stone-900 font-display">Sahil &amp; Deniz</td>
                                <td className="p-4">Denize sÄ±fÄ±r veya yakÄ±n, panoramik manzara</td>
                                <td className="p-4">Su sporlarÄ±, plaj keyfi, tekne turlarÄ±</td>
                              </tr>
                              <tr>
                                <td className="p-4 font-bold text-stone-900 font-display">DoÄŸa &amp; Orman</td>
                                <td className="p-4">Bungalov evler, temiz hava, izole konum</td>
                                <td className="p-4">Trekking, bisiklet, meditasyon ve yoga</td>
                              </tr>
                              <tr>
                                <td className="p-4 font-bold text-stone-900 font-display">Åehir Merkezine YakÄ±n</td>
                                <td className="p-4">Restoran, market ve gece hayatÄ±na kolay eriÅŸim</td>
                                <td className="p-4">KÃ¼ltÃ¼r turlarÄ±, yerel lezzet keÅŸifleri, alÄ±ÅŸveriÅŸ</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Konforunuzu ArtÄ±ran Detaylar */}
                      <div className="pt-4 border-t border-stone-200">
                        <h4 className="text-base font-extrabold text-[#FF385C] uppercase tracking-wider mb-4 font-display">
                          Konforunuzu ArtÄ±ran Detaylar
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white/60 p-4 rounded-xl border border-stone-200/60">
                            <h5 className="font-bold text-stone-900 mb-1">IsÄ±tmalÄ± ve KapalÄ± Havuzlar</h5>
                            <p className="text-stone-500 font-sans text-[11px] leading-relaxed">DÃ¶rt mevsim tatil yapmak isteyenler iÃ§in kÄ±ÅŸ aylarÄ±nda da havuz keyfi sunan seÃ§enekler.</p>
                          </div>
                          <div className="bg-white/60 p-4 rounded-xl border border-stone-200/60">
                            <h5 className="font-bold text-stone-900 mb-1">GeniÅŸ BahÃ§e ve BarbekÃ¼</h5>
                            <p className="text-stone-500 font-sans text-[11px] leading-relaxed">Ã‡ocuk oyun alanlarÄ±, evcil hayvan dostu bahÃ§eler ve keyifli akÅŸam yemekleri iÃ§in barbekÃ¼ alanlarÄ±.</p>
                          </div>
                          <div className="bg-white/60 p-4 rounded-xl border border-stone-200/60">
                            <h5 className="font-bold text-stone-900 mb-1">LÃ¼ks Detaylar</h5>
                            <p className="text-stone-500 font-sans text-[11px] leading-relaxed">ÅÃ¶mineli sÄ±cak daÄŸ evleri, jakuzili sÃ¼it odalar ve geniÅŸ seyir teraslarÄ±.</p>
                          </div>
                        </div>
                      </div>

                      {/* GÃ¼venli Rezervasyon Ä°Ã§in Dikkat Etmeniz Gerekenler */}
                      <div className="pt-4 border-t border-stone-200">
                        <h4 className="text-base font-extrabold text-[#FF385C] uppercase tracking-wider mb-4 font-display">
                          GÃ¼venli Rezervasyon Ä°Ã§in Dikkat Etmeniz Gerekenler
                        </h4>
                        <p className="mb-4">
                          KiralÄ±k villa ve bungalov sektÃ¶rÃ¼nde doÄŸru adÄ±mlarÄ± atmak, tatilinizin kusursuz geÃ§mesi iÃ§in kritiktir:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-stone-500">
                          <div className="flex gap-2 items-start">
                            <span className="text-[#FF385C] font-bold shrink-0 mt-0.5">â€¢</span>
                            <div>
                              <strong className="text-stone-800">GÃ¼venilirlik Her Åeydir:</strong> OnaylanmÄ±ÅŸ ev sahipleri, mÃ¼ÅŸteri yorumlarÄ± doÄŸrulanmÄ±ÅŸ ve ÅŸeffaf iptal koÅŸullarÄ± sunan platformlarÄ± tercih edin. <strong>villabungalovtatil.com.tr</strong> olarak tÃ¼m portfÃ¶yÃ¼mÃ¼zÃ¼ dÃ¼zenli denetimlerden geÃ§iriyor, size gÃ¼venli bir kiralama sÃ¼reci sunmak iÃ§in Ã§abalÄ±yoruz.
                            </div>
                          </div>
                          <div className="flex gap-2 items-start">
                            <span className="text-[#FF385C] font-bold shrink-0 mt-0.5">â€¢</span>
                            <div>
                              <strong className="text-stone-800">Erken Rezervasyon:</strong> Ã–zellikle Ä°stanbul ve Marmara BÃ¶lgesi her mevsimde, yaz aylarÄ±nda da Ege ve Akdeniz bÃ¶lgelerindeki popÃ¼ler villalar yÃ¼ksek sezonda hÄ±zla dolmaktadÄ±r. Erken rezervasyon hem yerinizi garantiler hem de fiyat avantajÄ± saÄŸlar.
                            </div>
                          </div>
                          <div className="flex gap-2 items-start">
                            <span className="text-[#FF385C] font-bold shrink-0 mt-0.5">â€¢</span>
                            <div>
                              <strong className="text-stone-800">UlaÅŸÄ±m ve Lojistik:</strong> VillanÄ±n otopark durumunu, havaalanÄ± transfer imkanlarÄ±nÄ± ve market, eczane, hastane gibi temel ihtiyaÃ§ noktalarÄ±na olan mesafesini Ã¶nceden inceleyin.
                            </div>
                          </div>
                          <div className="flex gap-2 items-start">
                            <span className="text-[#FF385C] font-bold shrink-0 mt-0.5">â€¢</span>
                            <div>
                              <strong className="text-stone-800">Evcil Hayvan Ä°zni:</strong> Patili dostunuzla seyahat edecekseniz, "evcil hayvan dostu" filtrelerimizi kullanarak uygun evleri listeleyebilirsiniz.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Uzaktan Ã‡alÄ±ÅŸanlar (Workation) Ä°Ã§in Yeni Nesil Tatil */}
                      <div className="pt-4 border-t border-stone-200">
                        <h4 className="text-base font-extrabold text-[#FF385C] uppercase tracking-wider mb-2 font-display">
                          Uzaktan Ã‡alÄ±ÅŸanlar (WORKATION) Ä°Ã§in Yeni Nesil Tatil
                        </h4>
                        <p className="text-stone-500">
                          GÃ¼nÃ¼mÃ¼zde iÅŸ ve tatili birleÅŸtirmek artÄ±k Ã§ok kolay. YÃ¼ksek hÄ±zlÄ± internet altyapÄ±sÄ±na ve sessiz Ã§alÄ±ÅŸma alanlarÄ±na sahip villa ve bungalovlarÄ±mÄ±z, uzaktan Ã§alÄ±ÅŸan profesyoneller iÃ§in mÃ¼kemmel bir ofis ortamÄ± sunuyor. DoÄŸaya karÅŸÄ± kahvenizi yudumlarken toplantÄ±larÄ±nÄ±za katÄ±labilir, mesai bitiminde havuzun tadÄ±nÄ± Ã§Ä±karabilirsiniz.
                        </p>
                      </div>

                      {/* Hayalinizdeki Tatili Åimdi PlanlayÄ±n! */}
                      <div className="p-6 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                        <h4 className="text-base font-extrabold text-[#FF385C] uppercase tracking-wider mb-2 font-display">
                          Hayalinizdeki Tatili Åimdi PlanlayÄ±n!
                        </h4>
                        <p className="text-[13px] text-stone-700 font-medium font-display leading-relaxed">
                          KiralÄ±k villa ve bungalov tatili, her anÄ± sizin tarafÄ±nÄ±zdan tasarlanmÄ±ÅŸ bir yaÅŸam deneyimidir. Sevdiklerinizle unutulmaz anÄ±lar biriktirmek, ÅŸehrin stresinden uzaklaÅŸmak ve tamamen size ait bir alanda dinlenmek iÃ§in daha fazla beklemeyin.
                        </p>
                        <p className="mt-3 text-[13px] text-stone-700 leading-relaxed">
                          Hemen <strong>villabungalovtatil.com.tr</strong> adresini ziyaret edin; bÃ¼tÃ§enize, zevkinize ve ihtiyacÄ±nÄ±za en uygun villayÄ± geliÅŸmiÅŸ filtreleme seÃ§eneklerimizle saniyeler iÃ§inde bulun!
                        </p>
                      </div>

                    </div>
                  </section>
                </div>
              );
            })()}

            {/* Why Peer-To-Peer Booking (Alan 3 and optional Alan 4) */}
            <section className="mt-20 bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" id="alan-3-section">
              <div>
                <h3 className="text-2xl font-extrabold text-stone-950 sm:text-3xl tracking-tight leading-tight font-display">
                  {area3Title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed mt-4">
                  {area3Text}
                </p>

                <a 
                  href={area3ButtonUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-6 flex items-center gap-2.5 bg-[#FF385C]/10 text-[#FF385C] hover:bg-[#FF385C] hover:text-white px-5 py-3 rounded-2xl border border-[#FF385C]/10 w-fit font-bold text-xs tracking-wide transition-all"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF385C] text-white shrink-0">
                    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                      <path d="M1.3 21.8L8.6 14c-1-1.8-1.5-3.8-1.5-5.9C7.1 1.6 12 0 12 0s3.2 1.2 5.5 3.5c2.3 2.3 3.5 5.3 3.5 8.5 0 6.6-5.4 12-12 12-2 0-4-.5-5.7-1.4l-2 1.3 M6.6 17c1.6 1 3.2 1.5 4.8 1.5 5.4 0 9.8-4.4 9.8-9.8 0-2.6-1-5.1-2.9-7-1.9-1.9-4.3-2.9-7-2.9-5.4 0-9.8 4.4-9.8 9.8 0 1.7.5 3.4 1.4 4.9l-1 3.6 3.7-1" />
                    </svg>
                  </div>
                  <span>{area3ButtonText}</span>
                </a>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm border border-stone-100">
                <img
                  src={area3ImageUrl}
                  alt={area3Title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-stone-900/10" />
              </div>
            </section>

            {area4Enabled && (
              <section className="mt-10 bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" id="alan-4-section">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#FF385C] uppercase block mb-1">
                    {area4Subtitle}
                  </span>
                  <h3 className="text-2xl font-extrabold text-stone-950 sm:text-3xl tracking-tight leading-tight font-display">
                    {area4Title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed mt-4">
                    {area4Text}
                  </p>

                  <a 
                    href={area4ButtonUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-6 flex items-center gap-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-650 hover:text-white px-5 py-3 rounded-2xl border border-indigo-100 w-fit font-bold text-xs tracking-wide transition-all"
                  >
                    <span>{area4ButtonText}</span>
                  </a>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm border border-stone-100">
                  <img
                    src={area4ImageUrl}
                    alt={area4Title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-stone-900/10" />
                </div>
              </section>
            )}


          </main>
        </>
      )}

      {/* ----------------- STANDALONE VILLA DETAIL VIEW ----------------- */}
      {matchedVilla && (
        <VillaDetailPage
          villa={matchedVilla}
          onBack={() => navigateTo("/")}
          onQuickBook={(v) => {
            setQuickBookVilla(v);
            setBookingForm((prev) => ({
              ...prev,
              guestsCount: Math.min(2, v.capacity),
              selectedCompanionIds: [],
              selectedExtraServices: [],
              serviceQuantities: {},
            }));
          }}
          isFavorite={favorites.includes(matchedVilla.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* ----------------- KULLANICI / GUEST DASHBOARD PANEL ----------------- */}
      {currentPath === "/kullanici" && currentUser && (
        <UserDashboard
          currentUser={currentUser}
          onUpdateProfile={(profile) => {
            setCurrentUser(profile);
            localStorage.setItem("guest_user_profile", JSON.stringify(profile));
          }}
          companions={companions}
          onAddCompanion={(name, tcNo) => {
            const newComp = { id: "comp_" + Date.now(), name, tcNo };
            const updated = [...companions, newComp];
            setCompanions(updated);
            localStorage.setItem("guest_companions", JSON.stringify(updated));
          }}
          onDeleteCompanion={(id) => {
            const updated = companions.filter((c) => c.id !== id);
            setCompanions(updated);
            localStorage.setItem("guest_companions", JSON.stringify(updated));
          }}
          bookings={bookings}
          onCancelBooking={handleCancelBooking}
          favorites={favorites}
          villas={villas}
          onSelectVilla={(villa) => setSelectedVilla(villa)}
          sessionTimeout={sessionTimeout}
          onExtendSession={() => setSessionTimeout(900)}
          onLogout={() => handleLogout("guest")}
        />
      )}

      {/* ----------------- EV SAHÄ°BÄ° PANELÄ° / HOST PANEL ----------------- */}
      {currentRole === "host" && (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
          {/* Mustard-Black Top bar styling */}
          <div className="bg-stone-950 text-white p-6 rounded-3xl border border-stone-850 shadow-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20">
                <Building className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="block text-[9px] font-black text-amber-400 uppercase tracking-widest leading-none mb-1">
                  EV SAHÄ°BÄ° YÃ–NETÄ°M PANELÄ°
                </span>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                  HoÅŸ Geldiniz,{" "}
                  {currentHost ? currentHost.name.replace(" (Bungalov Sahibi)", "") : "Ahmet YÄ±lmaz"}
                </h1>
              </div>
            </div>

            {/* Session tracker & Logout with Hardal-Siyah buttons */}
            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              <div className="flex items-center gap-2 rounded-2xl bg-stone-900 border border-stone-800 py-2 px-3.5 text-xs text-amber-400">
                <Clock className="h-4 w-4 animate-spin shrink-0 text-amber-500" />
                <span className="font-semibold text-stone-300">
                  GÃ¼venli Oturum:{" "}
                </span>
                <span className="font-mono font-bold text-amber-500 bg-amber-500/10 py-0.5 px-1.5 rounded-lg">
                  {Math.floor(sessionTimeout / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(sessionTimeout % 60).toString().padStart(2, "0")}
                </span>
                <button
                  onClick={() => setSessionTimeout(900)}
                  className="ml-2 hover:text-white font-black underline uppercase tracking-wider text-[9px] cursor-pointer"
                  title="GÃ¼venli oturum sÃ¼resini uzat"
                >
                  SÃ¼reyi Uzat
                </button>
              </div>

              <button
                onClick={() => navigateTo("/")}
                className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 text-xs transition active:scale-95 cursor-pointer shadow-md shadow-emerald-600/15"
              >
                <Compass className="h-3.5 w-3.5 animate-pulse" />
                <span>Siteye Git</span>
              </button>

              <button
                onClick={() => handleLogout("host")}
                className="flex items-center gap-1.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black px-4 py-2 text-xs transition active:scale-95 cursor-pointer shadow-md shadow-amber-500/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Oturumu Kapat</span>
              </button>
            </div>
          </div>

          {/* Core Analytics Matrix for Host */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-[#FF385C] rounded-xl shrink-0">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-[11px] text-stone-400 font-bold uppercase tracking-wider">
                  Ä°lan KazancÄ±nÄ±z
                </span>
                <span className="font-mono text-lg font-extrabold text-stone-900">
                  â‚º{totalHostRevenueCapacity.toLocaleString("tr-TR")}
                </span>
                <span className="block text-[9px] text-stone-400 mt-0.5">
                  Onaylanan Ã¶n Ã¶demeler
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-[11px] text-stone-400 font-bold uppercase tracking-wider">
                  Onay Bekleyenler
                </span>
                <span className="font-mono text-lg font-extrabold text-stone-900">
                  {bookings.filter((b) => b.status === "pending").length} Talep
                </span>
                <span className="block text-[9px] text-stone-400 mt-0.5">
                  MÃ¼ÅŸteri geri dÃ¶nÃ¼ÅŸ bekliyor
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-[11px] text-stone-400 font-bold uppercase tracking-wider">
                  Aktif Ä°lanlarÄ±nÄ±z
                </span>
                <span className="font-mono text-lg font-extrabold text-stone-900">
                  {villas.filter(v => v.isActive !== false && currentHost && (v.hostName === currentHost.name.replace(" (Bungalov Sahibi)", "") || v.hostId === currentHost.id)).length} Ä°lan
                </span>
                <span className="block text-[9px] text-[#10B981] mt-0.5 font-bold">
                  Kiralama yayÄ±nda aktif
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-xl shrink-0">
                <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <span className="block text-[11px] text-stone-400 font-bold uppercase tracking-wider">
                  DeÄŸerlendirme PuanÄ±
                </span>
                <span className="font-mono text-lg font-extrabold text-stone-900">
                  â˜… 4.96
                </span>
                <span className="block text-[9px] text-stone-400 mt-0.5">
                  MÃ¼kemmel Ev Sahibi rozeti
                </span>
              </div>
            </div>
          </div>

          {/* Quick Anchor Navigation Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-sans animate-fade-in">
            <span className="text-xs text-stone-400 font-extrabold uppercase tracking-wider block">
              âš¡ HIZLI ERÄ°ÅÄ°M:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => document.getElementById("host-rezervasyonlar")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 rounded-xl bg-amber-500/10 text-amber-800 hover:bg-amber-500 hover:text-stone-950 font-black px-4 py-2.5 text-xs transition active:scale-95 cursor-pointer shadow-xs border border-amber-500/10"
              >
                <span>ğŸ“… Rezervasyonlar</span>
              </button>
              <button
                onClick={() => document.getElementById("host-ilanlar")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold px-4 py-2.5 text-xs transition active:scale-95 cursor-pointer shadow-xs border border-stone-200/50"
              >
                <span>ğŸ¢ Ä°lanlarÄ±nÄ±z</span>
              </button>
              <button
                onClick={() => setShowAddVillaModal(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold px-4 py-2.5 text-xs transition active:scale-95 cursor-pointer shadow-xs border border-emerald-200/50"
              >
                <span>â• Yeni Ev Ekle</span>
              </button>
              <button
                onClick={() => document.getElementById("host-kampanyalar")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold px-4 py-2.5 text-xs transition active:scale-95 cursor-pointer shadow-xs border border-stone-200/50"
              >
                <span>ğŸ·ï¸ KampanyalarÄ±m</span>
              </button>
              <button
                onClick={() => {
                  setNewCampaignForm({
                    name: "",
                    code: "",
                    discountType: "percentage",
                    discountValue: 10,
                    targetVillaId: "all",
                    startDate: "2026-06-15",
                    endDate: "2026-09-30"
                  });
                  setShowAddCampaignModal(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#FF385C] font-extrabold px-4 py-2.5 text-xs transition active:scale-95 cursor-pointer shadow-xs border border-rose-200/50"
              >
                <span>ğŸ·ï¸ Yeni Kampanya Ekle</span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
              {/* Booking Requests Specific to your houses */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs" id="host-rezervasyonlar">
                <h2 className="text-lg font-extrabold text-stone-900 font-display flex items-center gap-2 mb-4">
                  <span>ğŸ“…</span> Tesislerinize Gelen Misafir Rezervasyon Talepleri
                </h2>

                {bookings.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 text-xs">
                    HenÃ¼z konuklardan gelen bir rezervasyon talebi
                    bulunmamaktadÄ±r.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl border border-stone-150 bg-white shadow-xs relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">
                              Talep ID: {b.id}
                            </span>
                            <h4 className="text-xs font-black text-stone-900 mt-0.5">
                              {b.guestName} / {b.villaName}
                            </h4>
                          </div>

                          {/* Active state show */}
                          <div>
                            {b.status === "pending" && (
                              <span className="bg-amber-150 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                Beklemede
                              </span>
                            )}
                            {b.status === "confirmed" && (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                OnaylandÄ±
                              </span>
                            )}
                            {b.status === "cancelled" && (
                              <div className="flex items-center gap-1 group relative inline-flex">
                                <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                  Reddedildi
                                </span>
                                {b.cancelReason && (
                                  <>
                                    <HelpCircle className="h-4 w-4 text-stone-400 cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-stone-800 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-normal normal-case font-normal text-center">
                                      <span className="block font-bold mb-0.5 text-stone-300">Ä°ptal GerekÃ§esi:</span>
                                      {b.cancelReason}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800"></div>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 border-t border-stone-100 mt-2 text-[11px] text-stone-600">
                          <div>
                            <span className="block text-stone-400 text-[10px]">
                              TARÄ°HLER
                            </span>
                            <strong>
                              {b.checkIn} GiriÅŸ / {b.checkOut} Ã‡Ä±kÄ±ÅŸ (
                              {b.totalDays} Gece)
                            </strong>
                          </div>
                          <div>
                            <span className="block text-stone-400 text-[10px]">
                              MÄ°SAFÄ°R SAYISI
                            </span>
                            <strong>{b.guestsCount} Misafir</strong>
                          </div>
                          <div>
                            <span className="block text-stone-400 text-[10px]">
                              Ä°LETÄ°ÅÄ°M HARÄ°TASI
                            </span>
                            <strong>{b.guestPhone}</strong>
                          </div>
                          <div className="col-span-1 sm:col-span-3 pt-1">
                            <span className="block text-stone-400 text-[10px]">
                              TAHMÄ°NÄ° KAZANÃ‡ (BRÃœT)
                            </span>
                            <strong className="text-stone-850 font-semibold text-xs">
                              â‚º{b.totalPrice.toLocaleString("tr-TR")}
                            </strong>
                          </div>
                        </div>

                        {b.status === "pending" && (
                          <div className="flex gap-2 justify-end border-t border-stone-150 pt-2.5 mt-2">
                            <button
                              onClick={() =>
                                handleUpdateBookingStatus(b.id, "cancelled")
                              }
                              className="text-xs p-1 px-3 border border-stone-200 hover:bg-stone-50 rounded-lg text-stone-500 font-semibold cursor-pointer"
                            >
                              Talebi Reddet
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateBookingStatus(b.id, "confirmed")
                              }
                              className="text-xs p-1 px-3 bg-[#FF385C] hover:bg-[#E02647] rounded-lg text-white font-bold cursor-pointer"
                            >
                              Talebi Onayla
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            {/* Column 3: host campaigns management */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs" id="host-kampanyalar">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">ğŸ·ï¸</span>
                    <div>
                      <h2 className="text-sm font-black text-stone-900 font-display uppercase tracking-wider leading-none">
                        KampanyalarÄ±m
                      </h2>
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        Kupon ve promosyon kodlarÄ±m
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNewCampaignForm({
                        name: "",
                        code: "",
                        discountType: "percentage",
                        discountValue: 10,
                        targetVillaId: "all",
                        startDate: "2026-06-15",
                        endDate: "2026-09-30"
                      });
                      setShowAddCampaignModal(true);
                    }}
                    className="flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold px-3 py-1.5 text-xs transition active:scale-95 shadow-sm cursor-pointer shrink-0"
                  >
                    <span>+ Yeni</span>
                  </button>
                </div>

                {campaigns.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 text-xs font-sans">
                    HenÃ¼z tanÄ±mlanmÄ±ÅŸ bir kampanya bulunamadÄ±. Hemen yeni bir promosyon kodu tanÄ±mlayabilirsiniz.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map((camp) => {
                      const associatedVilla = villas.find(v => v.id === camp.targetVillaId);
                      return (
                        <div
                          key={camp.id}
                          className={`p-3.5 rounded-2xl border transition ${
                            camp.isActive
                              ? "bg-stone-50 border-stone-150 hover:border-stone-200"
                              : "bg-stone-50/50 border-stone-100 opacity-60"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2 font-sans">
                            <div>
                              <h4 className="text-xs font-black text-stone-900 leading-tight">
                                {camp.name}
                              </h4>
                              <span className="inline-block text-[9px] font-mono font-bold bg-amber-500/15 text-amber-800 rounded px-1.5 py-0.5 mt-1">
                                KOD: {camp.code}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  const updated = campaigns.map((c) =>
                                    c.id === camp.id ? { ...c, isActive: !c.isActive } : c
                                  );
                                  saveCampaignsState(updated);
                                }}
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded cursor-pointer ${
                                  camp.isActive
                                    ? "bg-emerald-100/80 text-emerald-700 hover:bg-rose-50 hover:text-rose-600 font-sans"
                                    : "bg-stone-200 text-stone-605 hover:bg-emerald-100/80 hover:text-emerald-700 font-sans"
                                }`}
                                title={camp.isActive ? "KampanyayÄ± Kapat" : "KampanyayÄ± AÃ§"}
                              >
                                {camp.isActive ? "Aktif" : "Pasif"}
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`"${camp.name}" kampanyasÄ±nÄ± silmek istiyor musunuz?`)) {
                                    const updated = campaigns.filter((c) => c.id !== camp.id);
                                    saveCampaignsState(updated);
                                  }
                                }}
                                className="text-rose-600 hover:text-rose-850 p-1 rounded-md hover:bg-rose-50 transition shrink-0 cursor-pointer"
                                title="Sil"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-[11px] text-stone-600 pt-2 border-t border-dashed border-stone-200">
                            <div className="flex justify-between font-medium">
                              <span>Ä°ndirim OranÄ±/TutarÄ±:</span>
                              <strong className="text-stone-850">
                                {camp.discountType === "percentage"
                                  ? `%${camp.discountValue}`
                                  : `â‚º${camp.discountValue.toLocaleString("tr-TR")}`}
                              </strong>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>GeÃ§erli Tesis:</span>
                              <strong className="text-stone-850 truncate max-w-[125px]">
                                {camp.targetVillaId === "all"
                                  ? "TÃ¼m Konutlar ğŸ¡"
                                  : associatedVilla?.name || "Ã–zel Konut"}
                              </strong>
                            </div>
                            {camp.startDate && camp.endDate && (
                              <div className="flex justify-between font-sans text-[10px] text-stone-400">
                                <span>Tarih AralÄ±ÄŸÄ±:</span>
                                <span>
                                  {camp.startDate} / {camp.endDate}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Ä°lanlarÄ±nÄ±z (Listings) block placed gracefully at bottom of host stack */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs" id="host-ilanlar">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100 font-display">
                  <h2 className="text-lg font-extrabold text-[#111] flex items-center gap-2">
                    <span>ğŸ¢</span> YayÄ±ndaki Ä°lanlarÄ±nÄ±z / Tesisleriniz
                  </h2>
                  <button
                    onClick={() => setShowAddVillaModal(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#FF385C] hover:bg-[#E02647] text-white font-bold px-4 py-2 text-xs transition active:scale-95 shadow-md shadow-rose-500/10 cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Yeni Ä°lan Ekle</span>
                  </button>
                </div>

                <div className="space-y-4 font-sans">
                  {villas.filter(v => v.isActive !== false && currentHost && (v.hostName === currentHost.name.replace(" (Bungalov Sahibi)", "") || v.hostId === currentHost.id)).map((v) => (
                    <div
                      key={v.id}
                      className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-4 rounded-2xl border border-stone-100 hover:border-stone-200 bg-stone-50/40 gap-4 transition font-sans"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={v.images[0]}
                          alt=""
                          className="h-16 w-24 object-cover rounded-xl bg-stone-200 shadow-xs shrink-0 border border-stone-200/40"
                        />
                        <div>
                          <div className="flex items-center flex-wrap gap-1.5">
                            <span className="text-sm font-black text-stone-900">
                              {v.name}
                            </span>
                            <span className="text-[9px] font-extrabold uppercase bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">
                              {VILLA_TYPES_MAP[v.type]?.icon || "ğŸ¡"}{" "}
                              {VILLA_TYPES_MAP[v.type]?.label || "Konut"}
                            </span>
                            {v.isBoat && (
                              <span className="text-[9px] font-extrabold uppercase bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded">
                                â›µ Tekne
                              </span>
                            )}
                          </div>
                          <span className="block text-[11px] text-stone-400 mt-1 pb-0.5">
                            {v.region} â€¢ â˜… {v.rating} ({v.reviewCount} DeÄŸerlendirme)
                          </span>
                          <span className="block text-[11px] font-bold text-[#FF385C]">
                            Gecelik Kiralama Bedeli: â‚º{v.pricePerNight.toLocaleString("tr-TR")}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 w-full xl:w-auto justify-end">
                        <a
                          href={getVillaSlug(v.name, v.region)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-sky-50 border border-sky-150 hover:bg-sky-100 text-sky-700 hover:text-sky-900 rounded-xl px-3 py-2 text-xs font-black transition flex items-center gap-1 shrink-0"
                        >
                          Sitede GÃ¶r ğŸ”—
                        </a>
                        <button
                          onClick={() => setEditingVilla(v)}
                          className="bg-amber-50 border border-amber-150 hover:bg-amber-100 text-amber-700 hover:text-amber-900 rounded-xl px-3 py-2 text-xs font-black transition flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          Ä°lanÄ± DÃ¼zenle ğŸ“
                        </button>
                        <button
                          onClick={() => setTierEditingVilla(v)}
                          className="bg-white border border-stone-250 hover:border-[#D6D3D1] hover:bg-stone-100 text-stone-800 rounded-xl px-3 py-2 text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          ğŸ“… Kademeli Fiyat Gir
                        </button>
                        <button
                          onClick={() => handleToggleActive(v.id, v.isActive)}
                          className="bg-stone-100 border border-stone-200 hover:bg-stone-200 text-stone-700 rounded-xl px-3 py-2 text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          {v.isActive === false ? 'â–¶ Ä°lanÄ± BaÅŸlat' : 'â¸ Ä°lanÄ± Durdur'}
                        </button>
                        <button
                          onClick={() => {
                            if(window.confirm('Ä°lanÄ± tamamen silmek istediÄŸinize emin misiniz?')) {
                              handleDeleteVilla(v.id);
                            }
                          }}
                          className="bg-rose-50 hover:bg-[#FF385C] text-[#FF385C] hover:text-white rounded-xl px-3 py-2 text-xs font-black transition cursor-pointer shrink-0 border border-rose-100"
                        >
                          ğŸ—‘ Ä°lanÄ± Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

          </div>
        </main>
      )}

      {/* ----------------- ADMÄ°N PANELÄ° / ADMIN CONTROL ROOM ----------------- */}
      {currentRole === "admin" && (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
          {/* Admin Blue Themed Control Header Bar */}
          <div className="bg-blue-900 text-white p-6 rounded-3xl border border-blue-805 shadow-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-900 shadow-md">
                <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="block text-[9px] font-black text-blue-200 uppercase tracking-widest leading-none mb-1">
                  ADMÄ°NÄ°STRATOR YETKÄ°LÄ° KONTROL KABÄ°NÄ°
                </span>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                  Sistem YÃ¶neticisi:{" "}
                  {currentAdmin ? currentAdmin.name : "BaÅŸ YÃ¶netici"}
                </h1>
              </div>
            </div>

            {/* Inactivity Countdown & Blue logout buttons */}
            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              <div className="flex items-center gap-2 rounded-2xl bg-blue-950 border border-blue-800 py-2 px-3.5 text-xs text-blue-200">
                <Clock className="h-4 w-4 animate-spin shrink-0 text-blue-400" />
                <span className="font-semibold text-blue-100">
                  Oturum Åifreleme:{" "}
                </span>
                <span className="font-mono font-bold text-white bg-blue-500/25 py-0.5 px-1.5 rounded-lg">
                  {Math.floor(sessionTimeout / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(sessionTimeout % 60).toString().padStart(2, "0")}
                </span>
                <button
                  onClick={() => setSessionTimeout(900)}
                  className="ml-2 hover:text-white font-black underline uppercase tracking-wider text-[9px] cursor-pointer"
                  title="GÃ¼venli yÃ¶netici oturum sÃ¼resini uzat"
                >
                  SÃ¼reyi Uzat
                </button>
              </div>

              <button
                onClick={() => {
                  if (
                    confirm(
                      "YÃ¶netim panelinden Ã§Ä±kmak istediÄŸinize emin misiniz?",
                    )
                  ) {
                    handleLogout("admin");
                  }
                }}
                className="flex items-center gap-1.5 rounded-2xl bg-white hover:bg-stone-150 text-blue-900 font-extrabold px-4 py-2 text-xs transition active:scale-95 cursor-pointer shadow-md"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>GÃ¼venli Oturum Kapat</span>
              </button>
            </div>
          </div>

          {/* Admin Platform Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-stone-800">
            <div className="bg-stone-950 text-white p-5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Platform BrÃ¼t Ä°ÅŸlemleri
                </span>
                <Wallet className="h-4.5 w-4.5 text-emerald-400" />
              </div>
              <span className="block font-mono text-xl font-bold">
                â‚º
                {bookings
                  .reduce(
                    (sum, b) =>
                      sum + (b.status === "confirmed" ? b.totalPrice : 0),
                    0,
                  )
                  .toLocaleString("tr-TR")}
              </span>
              <span className="text-[9px] text-stone-400 block mt-1">
                Sistem Ã¼zerinden Ã¶denen toplam ciro
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  TÃ¼m Tesis Hacmi
                </span>
                <Building className="h-4.5 w-4.5 text-[#FF385C]" />
              </div>
              <span className="block font-mono text-xl font-bold">
                {villas.length} Aktif MÃ¼lk
              </span>
              <span className="text-[9px] text-stone-400 block mt-1">
                FarklÄ± ev sahipleri tarafÄ±ndan sunulan
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Toplam Rezervasyon
                </span>
                <Calendar className="h-4.5 w-4.5 text-amber-500" />
              </div>
              <span className="block font-mono text-xl font-bold">
                {bookings.length} Talep
              </span>
              <span className="text-[9px] text-stone-400 block mt-1">
                OluÅŸturulan Ã¶n rezervasyon seyahatleri
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Bekleyen Onay Teyidi
                </span>
                <Clock className="h-4.5 w-4.5 text-blue-500" />
              </div>
              <span className="block font-mono text-xl font-bold text-[#FF385C]">
                {bookings.filter((b) => b.status === "pending").length} Onay
              </span>
              <span className="text-[9px] text-stone-400 block mt-1">
                AnÄ±nda eylem gerektiren operasyon
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <button onClick={() => navigateTo("/admin/users")} className="bg-stone-900 text-white p-4 rounded-2xl hover:bg-stone-800 transition shadow-sm font-bold flex items-center justify-center gap-2 border border-stone-800 hover:border-stone-600">
              <Users className="h-5 w-5 text-blue-400" /> KullanÄ±cÄ±lar
            </button>
            <button onClick={() => navigateTo("/admin/hosts")} className="bg-stone-900 text-white p-4 rounded-2xl hover:bg-stone-800 transition shadow-sm font-bold flex items-center justify-center gap-2 border border-stone-800 hover:border-stone-600">
              <UserCheck className="h-5 w-5 text-emerald-400" /> Ev Sahipleri
            </button>
            <button onClick={() => navigateTo("/admin/campaigns")} className="bg-stone-900 text-white p-4 rounded-2xl hover:bg-stone-800 transition shadow-sm font-bold flex items-center justify-center gap-2 border border-stone-800 hover:border-stone-600">
              <BadgeAlert className="h-5 w-5 text-amber-400" /> Kampanyalar
            </button>
            <button onClick={() => navigateTo("/admin/pictures")} className="bg-stone-900 text-white p-4 rounded-2xl hover:bg-stone-800 transition shadow-sm font-bold flex items-center justify-center gap-2 border border-stone-800 hover:border-stone-600">
              <ImageIcon className="h-5 w-5 text-[#FF385C]" /> GÃ¶rseller
            </button>
            <button onClick={() => navigateTo("/admin")} className="bg-blue-900 text-white p-4 rounded-2xl hover:bg-blue-800 transition shadow-sm font-bold flex items-center justify-center gap-2 border border-blue-800 hover:border-blue-600">
              <ShieldCheck className="h-5 w-5 text-blue-300" /> Admin Paneli
            </button>
          </div>

          {currentPath === "/admin" && (
            <div className="flex flex-col space-y-8">
            {/* Global Reservation queue system for Admin */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-base font-bold text-stone-950 mb-4 font-display">
                Rezervasyon Onay KuyruÄŸu
              </h3>

              {bookings.length === 0 ? (
                <div className="text-center py-10 text-stone-400 text-xs">
                  Sistemde henÃ¼z kayÄ±tlÄ± rezervasyon iÅŸlemi bulunmamaktadÄ±r.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider text-[10px]">
                        <th className="pb-3 font-semibold">Rezervasyon Kod</th>
                        <th className="pb-3 font-semibold">Tesis AdÄ±</th>
                        <th className="pb-3 font-semibold">Misafir Detay</th>
                        <th className="pb-3 font-semibold">SÃ¼re</th>
                        <th className="pb-3 font-semibold">Tutar</th>
                        <th className="pb-3 font-semibold text-center">
                          Durum
                        </th>
                        <th className="pb-3 font-semibold text-center">
                          Ä°ÅŸlem
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-stone-50/50">
                          <td className="py-4 font-mono font-bold text-stone-900">
                            {b.id}
                          </td>
                          <td className="py-4 font-semibold">{b.villaName}</td>
                          <td className="py-4">
                            <span className="block font-semibold">
                              {b.guestName}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {b.guestPhone}
                            </span>
                          </td>
                          <td className="py-4">
                            <span>
                              {b.checkIn} â†’ {b.checkOut}
                            </span>
                            <span className="block text-[10px] text-stone-400 font-medium">
                              ({b.totalDays} Gece)
                            </span>
                          </td>
                          <td className="py-4 font-mono font-bold text-stone-900">
                            â‚º{b.totalPrice.toLocaleString("tr-TR")}
                          </td>
                          <td className="py-4 text-center">
                            {b.status === "pending" && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-1 rounded font-bold">
                                Bekliyor
                              </span>
                            )}
                            {b.status === "confirmed" && (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-1 rounded font-bold">
                                OnaylandÄ±
                              </span>
                            )}
                            {b.status === "cancelled" && (
                              <div className="flex items-center justify-center gap-1 group relative">
                                <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-1 rounded font-bold">
                                  Ä°ptal
                                </span>
                                {b.cancelReason && (
                                  <>
                                    <HelpCircle className="h-4 w-4 text-stone-400 cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-stone-800 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-normal font-normal text-left">
                                      <span className="block font-bold mb-0.5 text-stone-300">Ä°ptal GerekÃ§esi:</span>
                                      {b.cancelReason}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800"></div>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-4">
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() =>
                                  handleUpdateBookingStatus(b.id, "confirmed")
                                }
                                className="bg-emerald-50 text-emerald-800 hover:bg-emerald-500 hover:text-white p-1 rounded transition"
                                title="Onayla"
                              >
                                <Check className="h-4.5 w-4.5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateBookingStatus(b.id, "cancelled")
                                }
                                className="bg-rose-50 text-rose-800 hover:bg-rose-500 hover:text-white p-1 rounded transition"
                                title="Reddet"
                              >
                                <X className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Admin Actions & Platform state control */}
            
              {/* Ä°lan Onay ve Vitrin YÃ¶netimi Panel */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs font-sans">
                <h3 className="text-sm font-bold text-stone-950 mb-1 font-display flex items-center gap-1.5 text-blue-900 uppercase">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Ä°lan Onay & Vitrin YÃ¶netimi</span>
                </h3>
                <p className="text-[11px] text-stone-500 leading-relaxed mb-4">
                  Ev sahipleri tarafÄ±ndan eklenen ilanlarÄ± onaylayÄ±n veya reddedin. Ä°lanlarÄ± vitrin kategorilerine ekleyin.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider text-[10px]">
                        <th className="pb-3 font-semibold">Tesis AdÄ±</th>
                        <th className="pb-3 font-semibold">Ev Sahibi</th>
                        <th className="pb-3 font-semibold text-center">Durum</th>
                        <th className="pb-3 font-semibold text-center">Ä°lan OnayÄ± / DÃ¼zenle</th>
                        <th className="pb-3 font-semibold text-center">Vitrin SeÃ§imi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {villas.map((v) => (
                        <tr key={v.id} className="hover:bg-stone-50/50 transition">
                          <td className="py-3 font-bold text-stone-800 flex items-center gap-3">
                            {v.images?.[0] ? (
                              <img src={v.images[0]} alt={v.name} className="w-10 h-10 rounded-lg object-cover border border-stone-200" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
                                <ImageIcon className="h-4 w-4" />
                              </div>
                            )}
                            {v.name}
                          </td>
                          <td className="py-3 text-stone-500">{v.hostName || "Bilinmiyor"}</td>
                          <td className="py-3 text-center">
                            {v.approvalStatus === "approved" ? (
                              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold">YayÄ±nda</span>
                            ) : v.approvalStatus === "pending_edit" ? (
                              <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded text-[10px] font-bold">DÃ¼zenleme OnayÄ± Bekliyor</span>
                            ) : v.approvalStatus === "rejected" ? (
                              <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-[10px] font-bold">Reddedildi</span>
                            ) : (
                              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold">Yeni Ä°lan Onay Bekliyor</span>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex justify-center gap-2">
                              {v.approvalStatus !== "rejected" && (
                                <button
                                  onClick={async () => {
                                    const updatedList = villas.map(villa => 
                                      villa.id === v.id ? { ...villa, approvalStatus: "rejected" as const } : villa
                                    );
                                    saveVillasState(updatedList);
                                    try {
                                      await fetch(`/api/villas/${v.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ approvalStatus: 'rejected' })
                                      });
                                    } catch(e) {}
                                  }}
                                  className="px-2 py-1 bg-rose-50 text-rose-600 rounded font-medium hover:bg-rose-100 transition-colors text-[10px]"
                                >
                                  Reddet
                                </button>
                              )}
                              {v.approvalStatus !== "approved" && (
                                <button
                                  onClick={async () => {
                                    const updatedList = villas.map(villa => 
                                      villa.id === v.id ? { ...villa, approvalStatus: "approved" as const } : villa
                                    );
                                    saveVillasState(updatedList);
                                    try {
                                      await fetch(`/api/villas/${v.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ approvalStatus: 'approved' })
                                      });
                                    } catch(e) {}
                                  }}
                                  className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded font-medium hover:bg-emerald-100 transition-colors text-[10px]"
                                >
                                  Onayla
                                </button>
                              )}
                              <button
                                onClick={async () => {
                                  if (confirm("Bu ilanÄ± tamamen silmek istediÄŸinize emin misiniz?")) {
                                    const updatedList = villas.filter(villa => villa.id !== v.id);
                                    saveVillasState(updatedList);
                                    try {
                                      await fetch(`/api/villas/${v.id}`, { method: "DELETE" });
                                    } catch(e) {}
                                  }
                                }}
                                className="px-2 py-1 bg-red-50 text-red-600 rounded font-medium hover:bg-red-100 transition-colors text-[10px]"
                              >
                                Sil
                              </button>
                              <button
                                onClick={() => {
                                  setEditingVilla(v);
                                }}
                                className="px-2 py-1 bg-blue-50 text-blue-600 rounded font-medium hover:bg-blue-100 transition-colors text-[10px]"
                              >
                                DÃ¼zenle
                              </button>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            {v.approvalStatus === "approved" ? (
                              <div className="flex justify-center gap-2">
                                <label className="flex items-center gap-1 cursor-pointer text-[10px] font-medium text-stone-600">
                                  <input 
                                    type="checkbox" 
                                    checked={v.featuredCategories?.includes("balayi") || false}
                                    onChange={async (e) => {
                                      const isChecked = e.target.checked;
                                      const currentCats = v.featuredCategories || [];
                                      const newCats = isChecked ? [...currentCats, "balayi"] : currentCats.filter(c => c !== "balayi");
                                      const updatedList = villas.map(villa => villa.id === v.id ? { ...villa, featuredCategories: newCats } : villa);
                                      saveVillasState(updatedList);
                                      try {
                                        await fetch(`/api/villas/${v.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ featuredCategories: newCats })
                                        });
                                      } catch(e) {}
                                    }}
                                    className="rounded text-rose-500 focus:ring-rose-500 h-3 w-3" 
                                  />
                                  BalayÄ±
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer text-[10px] font-medium text-stone-600">
                                  <input 
                                    type="checkbox" 
                                    checked={v.featuredCategories?.includes("muhafazakar") || false}
                                    onChange={async (e) => {
                                      const isChecked = e.target.checked;
                                      const currentCats = v.featuredCategories || [];
                                      const newCats = isChecked ? [...currentCats, "muhafazakar"] : currentCats.filter(c => c !== "muhafazakar");
                                      const updatedList = villas.map(villa => villa.id === v.id ? { ...villa, featuredCategories: newCats } : villa);
                                      saveVillasState(updatedList);
                                      try {
                                        await fetch(`/api/villas/${v.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ featuredCategories: newCats })
                                        });
                                      } catch(e) {}
                                    }}
                                    className="rounded text-rose-500 focus:ring-rose-500 h-3 w-3" 
                                  />
                                  Muhafazakar
                                </label>
                              </div>
                            ) : (
                              <span className="text-[10px] text-stone-400 italic">Ã–nce OnaylayÄ±n</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Slogan and Image Customization Panel */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs font-sans">
                <h3 className="text-sm font-bold text-stone-950 mb-1 font-display flex items-center gap-1.5 text-blue-900 uppercase">
                  <Sparkles className="h-4 w-4 text-[#FF385C]" />
                  <span>Anasayfa Vitrin YÃ¶netimi</span>
                </h3>
                <p className="text-[11px] text-stone-500 leading-relaxed mb-4">
                  Sitenin anasayfasÄ±ndaki sloganÄ±, alt metni ve hero arka plan gÃ¶rselini anÄ±nda buradan gÃ¼ncelleyebilirsiniz.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Ãœst KÃ¼Ã§Ã¼k Slogan (Sparkle)
                    </label>
                    <input
                      type="text"
                      value={heroSlogan}
                      onChange={(e) => {
                        setHeroSlogan(e.target.value);
                        localStorage.setItem("villabungalov_hero_slogan", e.target.value);
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-850 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="Slogan girin..."
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Ana ManÅŸet BaÅŸlÄ±ÄŸÄ±
                    </label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => {
                        setHeroTitle(e.target.value);
                        localStorage.setItem("villabungalov_hero_title", e.target.value);
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-850 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="BaÅŸlÄ±k girin..."
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      AÃ§Ä±klama Alt Metni
                    </label>
                    <textarea
                      rows={3}
                      value={heroDescription}
                      onChange={(e) => {
                        setHeroDescription(e.target.value);
                        localStorage.setItem("villabungalov_hero_desc", e.target.value);
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-855 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none leading-relaxed"
                      placeholder="AÃ§Ä±klama alt metni girin..."
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Zemin Arka Plan GÃ¶rseli (URL)
                    </label>
                    <input
                      type="text"
                      value={heroBgImage}
                      onChange={(e) => {
                        setHeroBgImage(e.target.value);
                        localStorage.setItem("villabungalov_hero_bg", e.target.value);
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://..."
                    />
                    <span className="text-[9px] text-[#FF385C] block mt-1 font-semibold">
                      *DeÄŸiÅŸiklikler anÄ±nda anasayfaya yansÄ±r ve kalÄ±cÄ± kaydedilir.
                    </span>
                  </div>
                </div>
              </div>

              {/* âš¡ MAJESTIC SUPER ADMIN CMS SITE EDITOR âš¡ */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 mb-8 text-left" id="super-admin-cms-editor">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 border-b border-stone-200 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 font-display flex items-center gap-2">
                    SÃ¼per Admin CanlÄ± Ä°Ã§erik YÃ¶netim ModÃ¼lÃ¼ (CMS)
                  </h2>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    TÃ¼m anasayfa baÅŸlÄ±klarÄ±nÄ±, logolarÄ±, bilgilendirme alanlarÄ±nÄ± ve yorumlarÄ± anÄ±nda tasarlayÄ±n ve kalÄ±cÄ± olarak gÃ¼ncelleyin.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Save status badge */}
                {cmsUnsaved ? (
                  <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-800 text-[10px] px-3 py-1.5 rounded-full font-bold">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                     YayÄ±nlanmamÄ±ÅŸ DeÄŸiÅŸiklikler Var!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-800 text-[10px] px-3 py-1.5 rounded-full font-bold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                     Sitede TÃ¼m Veriler GÃ¼ncel &amp; CanlÄ±
                  </span>
                )}

                {/* Kaydet & YayÄ±nla Button! */}
                <button
                  onClick={handleCmsPublish}
                  disabled={cmsPublishing}
                  className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md overflow-hidden ${
                    cmsPublishing 
                      ? "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200"
                      : cmsUnsaved
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-200 cursor-pointer border border-emerald-500"
                        : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer border border-blue-600"
                  }`}
                >
                  {cmsPublishing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                      YayÄ±nlanÄ±yor...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Kaydet &amp; CanlÄ± YayÄ±nla
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Publication Success Banner */}
            {cmsPublishSuccess && (
              <div className="mb-6 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between animate-fade-in shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-950 font-sans">CanlÄ± YayÄ±na AlÄ±ndÄ±!</h4>
                    <p className="text-[11px] text-emerald-700 font-sans mt-0.5 leading-normal">
                      TÃ¼m metin deÄŸiÅŸiklikleriniz, logolar, misafir yorumlarÄ± ve alan ÅŸablonlarÄ± baÅŸarÄ±yla kaydedildi ve yayÄ±na alÄ±ndÄ±!
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setCmsPublishSuccess(false)}
                  className="text-emerald-500 hover:text-emerald-800 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left sidebar menu */}
              <div className="lg:col-span-1 border-r border-stone-200/80 pr-2 space-y-1.5">
                <span className="block text-[10px] uppercase font-black tracking-widest text-stone-400 mb-2 pl-2">YÃ¶netim MenÃ¼sÃ¼</span>
                {[
                  { key: "Misafir YorumlarÄ±", label: "Misafir YorumlarÄ±" },
                  { key: "GÃ¶rsel", label: "GÃ¶rsel" },
                  { key: "GÃ¶rsel Alt menÃ¼ler", label: "GÃ¶rsel Alt menÃ¼ler" },
                  { key: "Ã¼st bar", label: "Ã¼st bar" },
                  { key: "manÅŸet", label: "manÅŸet" },
                  { key: "SSS", label: "SSS" },
                  { key: "Alan 1", label: "Alan 1" },
                  { key: "Alan 2", label: "Alan 2" },
                  { key: "Alan 3", label: "Alan 3" },
                  { key: "Alan 4", label: "Alan 4" }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setAdminActiveTab(item.key)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all flex items-center justify-between ${
                      adminActiveTab === item.key
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="opacity-40">â†’</span>
                  </button>
                ))}
              </div>

              {/* Right forms workspace */}
              <div className="lg:col-span-3 min-h-[400px]">
                {/* 1. MÄ°SAFÄ°R YORUMLARI TAB */}
                {adminActiveTab === "Misafir YorumlarÄ±" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 font-display">Misafir YorumlarÄ± Alan YÃ¶netimi</h3>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        MÃ¼ÅŸteri memnuniyetini gÃ¶steren yorumlarÄ± dÃ¼zenleyin veya yenilerini ekleyin.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Misafir YorumlarÄ± Alt BaÅŸlÄ±k TanÄ±tÄ±m YazÄ±sÄ±</label>
                        <input
                          type="text"
                          value={reviewsSubtitle}
                          onChange={(e) => {
                            setReviewsSubtitle(e.target.value);
                            localStorage.setItem("villabungalov_reviews_subtitle", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="Alt metin girin..."
                        />
                      </div>

                      <div className="border-t border-stone-200/80 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Aktif GerÃ§ek Yorumlar Listesi</label>
                          <button
                            onClick={() => {
                              const newList = [
                                ...reviewsData,
                                {
                                  name: "Yorumcu " + (reviewsData.length + 1) + ".",
                                  comment: "RÃ¼ya gibi harika bir bungalov konaklamasÄ±ydÄ±. Tertemizdi, konumu Ã§ok sessiz ve doÄŸanÄ±n iÃ§indeydi. Kesinlikle Ã§ok memnun kaldÄ±k.",
                                  property: "Elite Jakuzili IsÄ±tmalÄ± SÄ±nÄ±fÄ±"
                                }
                              ];
                              setReviewsData(newList);
                              localStorage.setItem("villabungalov_reviews_data", JSON.stringify(newList));
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl transition"
                          >
                            + Yeni GerÃ§ek Yorum Ekle
                          </button>
                        </div>

                        <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                          {reviewsData.map((rev, index) => (
                            <div key={index} className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-blue-600 font-mono">YORUM #{index + 1}</span>
                                <button
                                  onClick={() => {
                                    const filtered = reviewsData.filter((_, i) => i !== index);
                                    setReviewsData(filtered);
                                    localStorage.setItem("villabungalov_reviews_data", JSON.stringify(filtered));
                                  }}
                                  className="text-[10px] text-rose-500 hover:text-rose-700 font-bold hover:underline"
                                >
                                  Bu Yorumu Sil
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-400 uppercase mb-0.5">Misafir Ä°smi</label>
                                  <input
                                    type="text"
                                    value={rev.name}
                                    onChange={(e) => {
                                      const updated = [...reviewsData];
                                      updated[index].name = e.target.value;
                                      setReviewsData(updated);
                                      localStorage.setItem("villabungalov_reviews_data", JSON.stringify(updated));
                                    }}
                                    className="w-full bg-white border border-stone-150 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-400 uppercase mb-0.5">Yorum YaptÄ±ÄŸÄ± Konut / Ä°lan SÄ±nÄ±fÄ±</label>
                                  <input
                                    type="text"
                                    value={rev.property}
                                    onChange={(e) => {
                                      const updated = [...reviewsData];
                                      updated[index].property = e.target.value;
                                      setReviewsData(updated);
                                      localStorage.setItem("villabungalov_reviews_data", JSON.stringify(updated));
                                    }}
                                    className="w-full bg-white border border-stone-150 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase mb-0.5">Yorum Ä°Ã§eriÄŸi</label>
                                <textarea
                                  rows={2}
                                  value={rev.comment}
                                  onChange={(e) => {
                                    const updated = [...reviewsData];
                                    updated[index].comment = e.target.value;
                                    setReviewsData(updated);
                                    localStorage.setItem("villabungalov_reviews_data", JSON.stringify(updated));
                                  }}
                                  className="w-full bg-white border border-stone-150 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none resize-none leading-normal"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. GÃ–RSEL TAB */}
                {adminActiveTab === "GÃ¶rsel" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 font-display">GÃ¶rsel Vitrin &amp; ManÅŸet AlanÄ±</h3>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        Sitenin en Ã¼stÃ¼ndeki bÃ¼yÃ¼k tanÄ±tÄ±m manÅŸetinin metinlerini ve arkasÄ±ndaki gÃ¶rseli dilediÄŸiniz zaman deÄŸiÅŸtirin.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">KÃ¼Ã§Ã¼k Ãœst BaÅŸlÄ±k (Slogan)</label>
                        <input
                          type="text"
                          value={heroSlogan}
                          onChange={(e) => {
                            setHeroSlogan(e.target.value);
                            localStorage.setItem("villabungalov_hero_slogan", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">BÃ¼yÃ¼k ManÅŸet BaÅŸlÄ±ÄŸÄ±</label>
                        <input
                          type="text"
                          value={heroTitle}
                          onChange={(e) => {
                            setHeroTitle(e.target.value);
                            localStorage.setItem("villabungalov_hero_title", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">DetaylÄ± AÃ§Ä±klama ParagrafÄ±</label>
                        <textarea
                          rows={3}
                          value={heroDescription}
                          onChange={(e) => {
                            setHeroDescription(e.target.value);
                            localStorage.setItem("villabungalov_hero_desc", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Zemin Arka Plan GÃ¶rsel Adresi (URL)</label>
                        <input
                          type="text"
                          value={heroBgImage}
                          onChange={(e) => {
                            setHeroBgImage(e.target.value);
                            localStorage.setItem("villabungalov_hero_bg", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs font-mono text-stone-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="mt-3 bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
                          <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">MÃ¼kemmel Alternatif GÃ¶rseller (HÄ±zlÄ± Uygula)</span>
                          <div className="flex gap-2">
                            {[
                              { label: "DoÄŸa Bungalov", url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1390334924456893789/original/2aeae359-92fb-4ae5-b617-3df76973c1c3.jpeg?im_w=1200" },
                              { label: "Sapanca GÃ¶l ManzarasÄ±", url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200" },
                              { label: "LÃ¼ks Havuzlu Villa", url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" }
                            ].map((bg, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setHeroBgImage(bg.url);
                                  localStorage.setItem("villabungalov_hero_bg", bg.url);
                                }}
                                className="bg-white border text-[10px] font-bold text-stone-600 hover:text-blue-600 border-stone-200 hover:border-blue-500 rounded-lg px-2 py-1 transition cursor-pointer"
                              >
                                {bg.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. GÃ–RSEL ALT MENÃœLER TAB */}
                {adminActiveTab === "GÃ¶rsel Alt menÃ¼ler" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 font-display">GÃ¶rsel Alt MenÃ¼ YapÄ±landÄ±rmasÄ±</h3>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        AÅŸaÄŸÄ±daki alt menÃ¼lerin her biri, web sayfasÄ±nÄ±n farklÄ± bir donanÄ±mÄ±nÄ± ve gÃ¶rsel ÅŸablonlarÄ±nÄ± yÃ¶netmenizi saÄŸlar.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: "Ã¼st bar", desc: "En tepe duyuru metnini dÃ¼zenleyin", target: "Ã¼st bar" },
                        { title: "manÅŸet", desc: "Logo baÅŸlÄ±ÄŸÄ± ve sloganÄ±nÄ± kontrol edin", target: "manÅŸet" },
                        { title: "SSS (SÄ±kÃ§a Sorulan Sorular)", desc: "SorularÄ±n ve cevaplarÄ±n tamamÄ±na mÃ¼dahale edin", target: "SSS" },
                        { title: "Alan 1 (Ã–zel Evler)", desc: "Kategorize Ã¶zel arama anahtar linklerini yÃ¶netin", target: "Alan 1" },
                        { title: "Alan 2 (KiralÄ±k Villa v..)", desc: "Metinleri, rehber ve tablolarÄ± revize edin", target: "Alan 2" },
                        { title: "Alan 3 (Direkt KarÅŸÄ±lÄ±klÄ±)", desc: "Peer-to-peer Airbnb modelinin tÃ¼m alanlarÄ±", target: "Alan 3" }
                      ].map((sub, i) => (
                        <button
                          key={i}
                          onClick={() => setAdminActiveTab(sub.target)}
                          className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-3xl p-5 text-left transition flex flex-col justify-between h-full group cursor-pointer"
                        >
                          <div>
                            <span className="block text-xs font-extrabold text-[#FF385C] uppercase font-display mb-1.5">{sub.title}</span>
                            <p className="text-[11px] text-stone-500 font-sans leading-relaxed">{sub.desc}</p>
                          </div>
                          <span className="text-[10px] font-black text-blue-600 hover:underline mt-4 block">Alt MenÃ¼yÃ¼ AÃ§ â†’</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. ÃœST BAR TAB */}
                {adminActiveTab === "Ã¼st bar" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 font-display">En Ãœst Duyuru BarÄ±</h3>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        ZiyaretÃ§ileri karÅŸÄ±layan kÄ±rmÄ±zÄ± ÅŸerit Ã¼zerindeki duyuru yazÄ±sÄ±.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">Duyuru / TanÄ±tÄ±m Metni</label>
                      <input
                        type="text"
                        value={topBarText}
                        onChange={(e) => {
                          setTopBarText(e.target.value);
                          localStorage.setItem("villabungalov_topbar_text", e.target.value);
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Ã–rn: TÃ¼rkiye'nin En SeÃ§kin Villa ve Bungalov Evleri Tek Adreste!"
                      />
                    </div>
                  </div>
                )}

                {/* 5. MANÅET TAB */}
                {adminActiveTab === "manÅŸet" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 font-display">Logo ve Marka Slogan AyarlarÄ±</h3>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        Sitedeki ana logo metnini ve altÄ±ndaki kÃ¼Ã§Ã¼k yardÄ±mcÄ± sloganÄ± dilediÄŸiniz gibi dÃ¼zenleyin. DeÄŸiÅŸiklik Navbar ve Footer alanlarÄ±na otomatik uygulanÄ±r.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Logo Ana BaÅŸlÄ±ÄŸÄ± (Ãœst KÄ±sÄ±m)</label>
                        <input
                          type="text"
                          value={logoTitle}
                          onChange={(e) => {
                            handleLogoChange(e.target.value, logoSubtitle);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="VillaBungalovTatil"
                        />
                        <span className="text-[9px] text-stone-400 mt-1 block leading-relaxed">
                          YazÄ± iÃ§inde 'Bungalov' geÃ§iyorsa sistem onu otomatik yeÅŸil vurgulu yapar!
                        </span>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Logo Alt SloganÄ±</label>
                        <input
                          type="text"
                          value={logoSubtitle}
                          onChange={(e) => {
                            handleLogoChange(logoTitle, e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Harika Evler MuhteÅŸem Tatiller"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. SSS TAB */}
                {adminActiveTab === "SSS" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 font-display">SÄ±kÃ§a Sorulan Sorular (SSS) YÃ¶netimi</h3>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        KullanÄ±cÄ±larÄ± bilgilendiren accordion sorularÄ±nÄ± ve alt yazÄ±sÄ±nÄ± buradan Ã¶zgÃ¼rce dÃ¼zenleyin.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">BÃ¶lÃ¼m Alt BaÅŸlÄ±ÄŸÄ± (Subtitle)</label>
                        <input
                          type="text"
                          value={faqSubtitle}
                          onChange={(e) => {
                            setFaqSubtitle(e.target.value);
                            localStorage.setItem("villabungalov_faq_subtitle", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="border-t border-stone-200/80 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Aktif SSS Soru &amp; Cevap Listesi</label>
                          <button
                            onClick={() => {
                              const newList = [
                                ...faqList,
                                {
                                  q: "IsÄ±tmalÄ± dÄ±ÅŸ havuzlar fiyata dahil mi?",
                                  a: "Evet, ilanlarÄ±mÄ±zda Ä±sÄ±tmalÄ± havuzlu olarak belirtilen tÃ¼m mÃ¼lklerde Ä±sÄ±tma hizmetimiz fiyata dahildir."
                                }
                              ];
                              setFaqList(newList);
                              localStorage.setItem("villabungalov_faq_list", JSON.stringify(newList));
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl transition"
                          >
                            + Yeni Soru &amp; Cevap Ekle
                          </button>
                        </div>

                        <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                          {faqList.map((faq, index) => (
                            <div key={index} className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-blue-600 font-mono">SORU #{index + 1}</span>
                                <button
                                  onClick={() => {
                                    const filtered = faqList.filter((_, i) => i !== index);
                                    setFaqList(filtered);
                                    localStorage.setItem("villabungalov_faq_list", JSON.stringify(filtered));
                                  }}
                                  className="text-[10px] text-rose-500 hover:text-rose-700 font-bold hover:underline"
                                >
                                  Bu Soruyu KaldÄ±r
                                </button>
                              </div>

                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase mb-0.5">Soru Metni</label>
                                <input
                                  type="text"
                                  value={faq.q}
                                  onChange={(e) => {
                                    const updated = [...faqList];
                                    updated[index].q = e.target.value;
                                    setFaqList(updated);
                                    localStorage.setItem("villabungalov_faq_list", JSON.stringify(updated));
                                  }}
                                  className="w-full bg-white border border-stone-150 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase mb-0.5 font-sans">AÃ§Ä±klayÄ±cÄ± Cevap Metni</label>
                                <textarea
                                  rows={2}
                                  value={faq.a}
                                  onChange={(e) => {
                                    const updated = [...faqList];
                                    updated[index].a = e.target.value;
                                    setFaqList(updated);
                                    localStorage.setItem("villabungalov_faq_list", JSON.stringify(updated));
                                  }}
                                  className="w-full bg-white border border-stone-150 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none resize-none leading-normal"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. ALAN 1 TAB */}
                {adminActiveTab === "Alan 1" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 font-display">Alan 1 - Ã–zel Evler Listesi</h3>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        KullanÄ±cÄ±larÄ± Ã¶zel filtrelere yÃ¶nlendiren arama linklerinin baÅŸlÄ±klarÄ±nÄ± dilediÄŸiniz gibi kontrol edin. "BaÅŸlÄ±k + Cari YÄ±l" (Ã–rn: {new Date().getFullYear()}) dinamiÄŸi kod seviyesinde otomatik iÅŸlemeye devam eder.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">BÃ¶lÃ¼m Alt BaÅŸlÄ±ÄŸÄ± (Subtitle)</label>
                        <input
                          type="text"
                          value={area1Subtitle}
                          onChange={(e) => {
                            setArea1Subtitle(e.target.value);
                            localStorage.setItem("villabungalov_area1_subtitle", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="border-t border-stone-200/80 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Aktif Filtre Linkleri Listesi</label>
                          <button
                            onClick={() => {
                              const newList = [...area1Titles, "MuhteÅŸem DoÄŸa ManzaralÄ± IsÄ±tmalÄ± Havuzlu Evler"];
                              setArea1Titles(newList);
                              localStorage.setItem("villabungalov_area1_titles", JSON.stringify(newList));
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 font-sans rounded-xl transition"
                          >
                            + Yeni Link Ekle
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                          {area1Titles.map((titleText, idx) => (
                            <div key={idx} className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 flex items-center gap-3">
                              <div className="flex-1">
                                <span className="block text-[8px] font-bold text-stone-400 uppercase mb-0.5">Link AdÄ± #{idx + 1}</span>
                                <input
                                  type="text"
                                  value={titleText}
                                  onChange={(e) => {
                                    const updated = [...area1Titles];
                                    updated[idx] = e.target.value;
                                    setArea1Titles(updated);
                                    localStorage.setItem("villabungalov_area1_titles", JSON.stringify(updated));
                                  }}
                                  className="w-full bg-white border border-stone-150 rounded-xl px-2.5 py-1 text-xs text-stone-800 font-bold focus:outline-none"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const filtered = area1Titles.filter((_, i) => i !== idx);
                                  setArea1Titles(filtered);
                                  localStorage.setItem("villabungalov_area1_titles", JSON.stringify(filtered));
                                }}
                                className="text-stone-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50/50 transition self-end"
                                title="KaldÄ±r"
                              >
                                <X className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. ALAN 2 TAB */}
                {adminActiveTab === "Alan 2" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 font-display">Alan 2 - Genel KiralÄ±k Villa &amp; Bungalov TanÄ±tÄ±mÄ±</h3>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        MÃ¼ÅŸterileri izole ve konforlu tatil hakkÄ±nda bilgilendiren geniÅŸ makale alanÄ±nÄ±n baÅŸlÄ±ÄŸÄ±, alt baÅŸlÄ±ÄŸÄ± ve baÅŸlangÄ±Ã§ paragrafÄ±.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">BÃ¼yÃ¼k BÃ¶lÃ¼m BaÅŸlÄ±ÄŸÄ±</label>
                        <input
                          type="text"
                          value={area2Title}
                          onChange={(e) => {
                            setArea2Title(e.target.value);
                            localStorage.setItem("villabungalov_area2_title", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">KÃ¼Ã§Ã¼k Alt BaÅŸlÄ±k</label>
                        <input
                          type="text"
                          value={area2Subtitle}
                          onChange={(e) => {
                            setArea2Subtitle(e.target.value);
                            localStorage.setItem("villabungalov_area2_subtitle", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">GiriÅŸ ParagrafÄ± (Rehber Makale)</label>
                        <textarea
                          rows={4}
                          value={area2Intro}
                          onChange={(e) => {
                            setArea2Intro(e.target.value);
                            localStorage.setItem("villabungalov_area2_intro", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. ALAN 3 TAB */}
                {adminActiveTab === "Alan 3" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 font-display">Alan 3 - Direkt KarÅŸÄ±lÄ±klÄ± GÃ¼venli Ev Sahibi AnlaÅŸmalarÄ±</h3>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        AracÄ± yÃ¼ksek komisyonlar olmadan seyahat felsefesini aÃ§Ä±klayan Airbnb esintili anket/banner alanÄ±nÄ±n metinleri, butonu ve gÃ¶rseli.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">BÃ¶lÃ¼m BaÅŸlÄ±ÄŸÄ±</label>
                        <input
                          type="text"
                          value={area3Title}
                          onChange={(e) => {
                            setArea3Title(e.target.value);
                            localStorage.setItem("villabungalov_area3_title", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">BÃ¶lÃ¼m AÃ§Ä±klama YazÄ±sÄ±</label>
                        <textarea
                          rows={3}
                          value={area3Text}
                          onChange={(e) => {
                            setArea3Text(e.target.value);
                            localStorage.setItem("villabungalov_area3_text", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-850 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Buton YazÄ±sÄ±</label>
                          <input
                            type="text"
                            value={area3ButtonText}
                            onChange={(e) => {
                              setArea3ButtonText(e.target.value);
                              localStorage.setItem("villabungalov_area3_btn_text", e.target.value);
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Buton YÃ¶nlendirme Adresi (Link / WhatsApp)</label>
                          <input
                            type="text"
                            value={area3ButtonUrl}
                            onChange={(e) => {
                              setArea3ButtonUrl(e.target.value);
                              localStorage.setItem("villabungalov_area3_btn_url", e.target.value);
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-600 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">SaÄŸ Taraf Arka Plan GÃ¶rseli (URL)</label>
                        <input
                          type="text"
                          value={area3ImageUrl}
                          onChange={(e) => {
                            setArea3ImageUrl(e.target.value);
                            localStorage.setItem("villabungalov_area3_image_url", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs font-mono text-stone-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. ALAN 4 TAB */}
                {adminActiveTab === "Alan 4" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 font-display">Alan 4 - Serbest KampanyalÄ± Ek Alan</h3>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        Gelecekte sisteme dilediÄŸiniz zaman entegre edebileceÄŸiniz, anasayfanÄ±n en altÄ±nda gÃ¶rÃ¼necek baÄŸÄ±msÄ±z lÃ¼ks tanÄ±tÄ±m bloÄŸunun tÃ¼m yÃ¶netimi.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100 flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-blue-900">AlanÄ± AktifleÅŸtir</span>
                          <span className="block text-[10px] text-stone-400 mt-0.5">Bu yeni alan anasayfanÄ±zÄ±n en altÄ±nda listelensin mi?</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={area4Enabled}
                          onChange={(e) => {
                            setArea4Enabled(e.target.checked);
                            localStorage.setItem("villabungalov_area4_enabled", e.target.checked ? "true" : "false");
                          }}
                          className="h-5 w-5 text-blue-600 border-stone-300 rounded focus:ring-blue-500 focus:outline-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Ãœst KÃ¼Ã§Ã¼k Kategori AdÄ± (Ã–rn: AKTÄ°VÄ°TELER)</label>
                        <input
                          type="text"
                          value={area4Subtitle}
                          onChange={(e) => {
                            setArea4Subtitle(e.target.value);
                            localStorage.setItem("villabungalov_area4_subtitle", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Blok BaÅŸlÄ±ÄŸÄ±</label>
                        <input
                          type="text"
                          value={area4Title}
                          onChange={(e) => {
                            setArea4Title(e.target.value);
                            localStorage.setItem("villabungalov_area4_title", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Blok DetaylÄ± YazÄ±sÄ±</label>
                        <textarea
                          rows={3}
                          value={area4Text}
                          onChange={(e) => {
                            setArea4Text(e.target.value);
                            localStorage.setItem("villabungalov_area4_text", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-850 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Buton YazÄ±sÄ±</label>
                          <input
                            type="text"
                            value={area4ButtonText}
                            onChange={(e) => {
                              setArea4ButtonText(e.target.value);
                              localStorage.setItem("villabungalov_area4_btn_text", e.target.value);
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Buton Linki</label>
                          <input
                            type="text"
                            value={area4ButtonUrl}
                            onChange={(e) => {
                              setArea4ButtonUrl(e.target.value);
                              localStorage.setItem("villabungalov_area4_btn_url", e.target.value);
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-600 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">GÃ¶rsel Adresi (URL)</label>
                        <input
                          type="text"
                          value={area4ImageUrl}
                          onChange={(e) => {
                            setArea4ImageUrl(e.target.value);
                            localStorage.setItem("villabungalov_area4_image_url", e.target.value);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs font-mono text-stone-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          
              {/* Social Channels and Direct Support Management Panel */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs font-sans">
                <h3 className="text-sm font-bold text-[#FF385C] mb-1 font-display flex items-center gap-1.5 uppercase">
                  <Phone className="h-4 w-4 text-emerald-500" />
                  <span>Ä°letiÅŸim &amp; Sosyal Medya YÃ¶netimi</span>
                </h3>
                <p className="text-[11px] text-stone-500 leading-relaxed mb-4">
                  Sitede yer alan doÄŸrudan iletiÅŸim ve sosyal medya kanallarÄ±nÄ± (EkranÄ±n saÄŸ altÄ±ndaki robot butonunda listelenir) ekleyebilir, deÄŸiÅŸtirebilir veya silebilirsiniz.
                </p>

                <div className="space-y-4">
                  {/* Channels list with inline editing inputs */}
                  {socialChannels.map((chan, idx) => (
                    <div key={chan.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#FF385C] uppercase tracking-wide">
                          Kanal #{idx + 1} ({chan.type})
                        </span>
                        <button
                          onClick={() => {
                            const filtered = socialChannels.filter(c => c.id !== chan.id);
                            handleUpdateSocialChannels(filtered);
                          }}
                          className="text-[10px] text-rose-500 hover:text-rose-700 font-bold hover:underline"
                          title="Bu kanalÄ± kaldÄ±r"
                        >
                          SÄ°L
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8px] font-bold text-stone-400 uppercase mb-0.5">Kanal Tipi</label>
                          <select
                            value={chan.type}
                            onChange={(e) => {
                              const updated = socialChannels.map(c => c.id === chan.id ? { ...c, type: e.target.value } : c);
                              handleUpdateSocialChannels(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-850 focus:outline-none"
                          >
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Telefon">Telefon</option>
                            <option value="Instagram">Instagram</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Telegram">Telegram</option>
                            <option value="TikTok">TikTok</option>
                            <option value="X">X (Twitter)</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Web">Web Sitesi</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-stone-400 uppercase mb-0.5 font-sans">Kanal BaÅŸlÄ±ÄŸÄ± / Etiket</label>
                          <input
                            type="text"
                            value={chan.label}
                            onChange={(e) => {
                              const updated = socialChannels.map(c => c.id === chan.id ? { ...c, label: e.target.value } : c);
                              handleUpdateSocialChannels(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-850 focus:outline-none"
                            placeholder="Ã–rn: 7/24 Teknik Destek"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8px] font-bold text-stone-400 uppercase mb-0.5 font-sans">GÃ¶rÃ¼nen DeÄŸer</label>
                          <input
                            type="text"
                            value={chan.value}
                            onChange={(e) => {
                              const updated = socialChannels.map(c => c.id === chan.id ? { ...c, value: e.target.value } : c);
                              handleUpdateSocialChannels(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-[11px] font-mono text-stone-800 focus:outline-none"
                            placeholder="Ã–rn: +90 541 246..."
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-stone-400 uppercase mb-0.5 font-sans">YÃ¶nlendirme Linki (URL)</label>
                          <input
                            type="text"
                            value={chan.url}
                            onChange={(e) => {
                              const updated = socialChannels.map(c => c.id === chan.id ? { ...c, url: e.target.value } : c);
                              handleUpdateSocialChannels(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-[11px] text-stone-600 font-mono focus:outline-none"
                            placeholder="Ã–rn: https://wa.me/90541..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add button */}
                  <button
                    onClick={() => {
                      const newChan = {
                        id: Math.random().toString(36).substring(2, 9),
                        type: 'WhatsApp',
                        label: 'Yeni Destek KanalÄ±',
                        value: '+90 000 000 00 00',
                        url: 'https://wa.me/900000000000'
                      };
                      handleUpdateSocialChannels([...socialChannels, newChan]);
                    }}
                    className="w-full border-2 border-dashed border-stone-200 hover:border-[#FF385C] rounded-2xl p-3 text-stone-500 hover:text-[#FF385C] text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <span>+ Yeni Ä°letiÅŸim / Sosyal Medya KanalÄ± Ekle</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
                <h3 className="text-base font-bold text-stone-950 mb-4 font-display">
                  YÃ¶netici TanÄ±lama ve Tesis Ekleme
                </h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                SÃ¼per yÃ¶netici olarak tÃ¼m platform envanterini anÄ±nda yÃ¶netin.
              </p>

              <div className="space-y-4">
                {/* Admin Quick Options */}
                <div className="bg-stone-50 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-stone-850">
                    TÃ¼m Ä°lanlarÄ± SÄ±fÄ±rla
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    TÃ¼m ilanlarÄ± ve rezervasyon verilerini silebilecek ve
                    fabrika ayarlarÄ±na Ã§ekebileceksiniz.
                  </p>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Uyan! TÃ¼m yerel eklemeleri ve simÃ¼lasyon rezervasyonlarÄ± silmek ve ilk duruma sÄ±fÄ±rlamak istiyor musunuz?",
                        )
                      ) {
                        localStorage.removeItem("airbnb_villas");
                        localStorage.removeItem("villabungalov_bookings");
                        localStorage.removeItem("villabungalov_favs");
                        setVillas(VILLA_DATA);
                        setBookings([]);
                        setFavorites([]);
                        alert("Platform ilk durumuna baÅŸarÄ±yla dÃ¶ndÃ¼rÃ¼ldÃ¼.");
                      }
                    }}
                    className="w-full bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold py-2 rounded-xl"
                  >
                    Platform Verilerini SÄ±fÄ±rla
                  </button>
                </div>

                {/* Simulated bookings generator */}
                <div className="bg-stone-50 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-stone-850">
                    SimÃ¼lasyon Rezervasyonu Yarat
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Analizler ve host kazanÃ§ tablolarÄ±nÄ± test etmek iÃ§in yapay
                    zeka ile otomatik test verisi oluÅŸturur.
                  </p>
                  <button
                    onClick={() => {
                      const randomVilla =
                        villas[Math.floor(Math.random() * villas.length)];
                      if (!randomVilla) return;
                      const names = [
                        "Caner",
                        "Zeynep",
                        "Buse",
                        "Murat",
                        "Merve",
                        "Efe",
                      ];
                      const randomName =
                        names[Math.floor(Math.random() * names.length)];
                      const mockBooking: Booking = {
                        id:
                          "SIM-" +
                          Math.random()
                            .toString(36)
                            .substring(2, 7)
                            .toUpperCase(),
                        villaId: randomVilla.id,
                        villaName: randomVilla.name,
                        villaImage: randomVilla.images[0],
                        guestName: randomName + " GeliÅŸtirici",
                        guestPhone:
                          "0555 " +
                          Math.floor(1000000 + Math.random() * 9000000),
                        guestEmail:
                          randomName.toLowerCase() + "@simulasyon.com",
                        checkIn: "2026-06-15",
                        checkOut: "2026-06-18",
                        guestsCount: 2,
                        totalDays: 3,
                        totalPrice: randomVilla.pricePerNight * 3,
                        basePrice: randomVilla.pricePerNight * 3,
                        discountAmount: 0,
                        servicesCost: 0,
                        selectedServicesList: [],
                        prepaymentAmount: Math.round(randomVilla.pricePerNight * 3 * 0.1),
                        status: "pending",
                        createdAt: new Date().toISOString(),
                      };
                      saveBookingsState([mockBooking, ...bookings]);
                      alert("Yeni test rezervasyonu eklendi!");
                    }}
                    className="w-full bg-[#FF385C] text-white hover:bg-[#E02647] text-xs font-bold py-2 rounded-xl"
                  >
                    Rastgele Test Rezervasyonu Ekle
                  </button>
                </div>
              </div>
            </div>
            </div>
          )}

          {currentPath === "/admin/users" && (
            <AdminUsers users={users} setUsers={setUsers} />
          )}

          {currentPath === "/admin/hosts" && (
            <AdminHosts villas={villas} bookings={bookings} />
          )}

          {currentPath === "/admin/campaigns" && (
            <AdminCampaigns villas={villas} />
          )}

          {currentPath === "/admin/pictures" && (
            <AdminPictures villas={villas} />
          )}
        </main>
      )}

      {/* ----------------- PROPERTY DETAILS SCREEN MODAL ----------------- */}
      {selectedVilla && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          id="property-detail-modal"
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setSelectedVilla(null)}
            />

            <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-4xl my-8 animate-in zoom-in-95 duration-200 border border-stone-200">
              {/* Close Button sticky overlay */}
              <button
                onClick={() => setSelectedVilla(null)}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md text-stone-700 hover:text-[#FF385C] font-bold scale-105 active:scale-95 transition"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Images layout column */}
                <div className="p-6 flex flex-col justify-between border-b border-stone-100 lg:border-b-0 lg:border-r">
                  <div>
                    {/* Primary large image state */}
                    <div className="relative aspect-3/2 rounded-2xl overflow-hidden bg-stone-100 shadow-sm border border-stone-200 cursor-zoom-in group">
                      <img
                        src={
                          selectedVilla.images[selectedDetailImageIndex] ||
                          "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800"
                        }
                        alt={selectedVilla.name}
                        referrerPolicy="no-referrer"
                        onClick={() => {
                          setZoomVilla(selectedVilla);
                          setZoomImageIndex(selectedDetailImageIndex);
                        }}
                        className="h-full w-full object-cover transition-transform hover:scale-[1.01]"
                      />
                      <span className="absolute bottom-3 left-3 rounded-lg bg-stone-950/80 text-white text-[10px] font-bold px-2 py-0.5">
                        FotoÄŸraf {selectedDetailImageIndex + 1} /{" "}
                        {selectedVilla.images.length}
                      </span>
                    </div>

                    {/* Thumbnail sub-lists slider */}
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {selectedVilla.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedDetailImageIndex(i)}
                          className={`relative h-14 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                            selectedDetailImageIndex === i
                              ? "border-[#FF385C]"
                              : "border-transparent"
                          }`}
                        >
                          <img
                            src={img}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Informational security text without TÃœRSAB */}
                  <div className="mt-6 bg-stone-50 p-4 rounded-xl text-xs space-y-1.5 text-stone-600 border border-stone-100">
                    <h5 className="font-bold text-stone-800 flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-[#FF385C]" />
                      DoÄŸrudan Ev Sahibi Teyidi
                    </h5>
                    <p>
                      Bu konut, ev sahibi tarafÄ±ndan doÄŸrudan doÄŸrulanmÄ±ÅŸ olup;
                      temizlik standartlarÄ± ve havuz Ä±sÄ±tmalarÄ± Villa Bungalov
                      Tatil gÃ¼vencesiyle kontrol edilmiÅŸtir.
                    </p>
                  </div>
                </div>

                {/* Details information column */}
                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    {/* Badge type label */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase bg-rose-50 text-[#FF385C] border border-rose-100 px-2.5 py-0.5 rounded-md">
                        {selectedVilla.type === "bungalow"
                          ? "Bungalov"
                          : "LÃ¼ks Villa"}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
                        <MapPin className="h-3 w-3 text-[#FF385C]" />
                        {selectedVilla.region}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-stone-950 tracking-tight font-display">
                      {selectedVilla.name}
                    </h2>
                    <p className="text-xs text-stone-400 font-semibold mt-0.5">
                      {selectedVilla.title}
                    </p>

                    {/* Airbnb Host Section */}
                    <div className="flex items-center gap-3 my-4 p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-xs text-stone-400">
                          Ev Sahibi
                        </span>
                        <span className="text-xs font-extrabold text-stone-800">
                          {selectedVilla.hostName}
                        </span>
                      </div>
                      <div className="ml-auto bg-stone-100 px-2 py-1 rounded text-[10px] font-bold text-stone-750 flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{selectedVilla.rating.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Stats details layout */}
                    {/* Stats details layout with explicit minNights */}
                    <div className="my-4 grid grid-cols-4 gap-2 bg-stone-50/70 rounded-xl p-3 text-center text-xs text-stone-600 font-semibold">
                      <div>
                        <span className="block text-[9px] text-stone-400 font-bold">
                          KAPASÄ°TE
                        </span>
                        <span className="text-stone-800 text-[11px]">
                          {selectedVilla.capacity} Misafir
                        </span>
                      </div>
                      <div className="border-x border-stone-200/60 font-medium">
                        <span className="block text-[9px] text-stone-400 font-bold">
                          YATAK ODASI
                        </span>
                        <span className="text-stone-800 text-[11px]">
                          {selectedVilla.bedrooms} Oda
                        </span>
                      </div>
                      <div className="border-r border-stone-200/60 font-medium">
                        <span className="block text-[9px] text-stone-400 font-bold">
                          BANYO
                        </span>
                        <span className="text-stone-800 text-[11px]">
                          {selectedVilla.bathrooms} Banyo
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-rose-500 font-extrabold uppercase">
                          MÄ°N. STAY
                        </span>
                        <span className="text-rose-700 text-[11px] font-black">
                          {selectedVilla.minNights || 2} Gece
                        </span>
                      </div>
                    </div>

                    {/* Description detailed panel */}
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5 font-sans">
                      AÃ§Ä±klama
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4 max-h-36 overflow-y-auto no-scrollbar">
                      {selectedVilla.description}
                    </p>

                    {/* All Features mapped as tag bubbles */}
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 font-sans">
                      Sunulan DonanÄ±mlar
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-stone-700">
                      {selectedVilla.features.map((feat) => {
                        const m = FEATURE_MAP[feat];
                        if (!m) return null;
                        return (
                          <div
                            key={feat}
                            className="flex items-center gap-1.5 p-1 rounded-md bg-stone-50/50"
                          >
                            <span className="text-xs shrink-0">{m.icon}</span>
                            <span className="font-medium">{m.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Extra services details section */}
                    <h4 className="text-[11px] font-extrabold text-stone-400 tracking-wider mb-2 font-display">
                      EV SAHÄ°BÄ° EKSTRA HÄ°ZMETLERÄ°
                    </h4>
                    <div className="mb-6 animate-in fade-in duration-300">
                      {(selectedVilla.extraServices || []).length === 0 ? (
                        <p className="text-[11px] text-[#A6A6A6] font-sans italic">
                          Bu konut iÃ§in ev sahibi henÃ¼z bir ekstra yemek veya
                          transfer hizmeti tanÄ±mlamadÄ±.
                        </p>
                      ) : (
                        <div className="bg-stone-50 border border-stone-200/85 p-4 rounded-2xl">
                          <ul className="space-y-2 font-sans">
                            {selectedVilla.extraServices.map((srv) => {
                              return (
                                <li
                                  key={srv.id}
                                  className="text-stone-800 text-[12px] sm:text-[13px] font-extrabold flex items-center gap-2"
                                >
                                  <span className="text-[#FF385C] font-black shrink-0 text-md">
                                    â€¢
                                  </span>
                                  <span className="text-stone-900">
                                    {srv.name}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Trigger Footer modal */}
                  <div className="border-t border-stone-100 pt-5 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-stone-400 font-semibold uppercase">
                        Gecelik FiyatÄ±
                      </span>
                      <span className="font-mono text-md sm:text-lg font-black text-stone-900">
                        â‚º{selectedVilla.pricePerNight.toLocaleString("tr-TR")}
                        <span className="text-[10px] sm:text-xs text-stone-400 font-normal">
                          {" "}
                          / gece
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => {
                          const msg = `Merhaba, *${selectedVilla.name}* (${selectedVilla.region}) eviniz hakkÄ±nda detaylÄ± bilgi almak istiyorum.`;
                          const url = `https://wa.me/${AGENCY_DETAILS.whatsapp.replace("+", "")}?text=${encodeURIComponent(msg)}`;
                          window.open(url, "_blank");
                        }}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-2.5 text-xs font-bold transition active:scale-95 flex items-center gap-1 shrink-0"
                      >
                        <span>ğŸ’¬</span> <span>WhatsAPP ile Sor</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedVilla(null);
                          const slug = getVillaSlug(
                            selectedVilla.name,
                            selectedVilla.region,
                          );
                          window.history.pushState(null, "", slug);
                          window.dispatchEvent(new PopStateEvent("popstate"));
                        }}
                        className="rounded-xl border border-stone-250 bg-white hover:bg-stone-55 text-stone-800 px-3 py-2.5 text-xs font-extrabold active:scale-95 transition whitespace-nowrap shrink-0"
                      >
                        DetaylÄ± Ä°ncele
                      </button>

                      <button
                        onClick={() => handleOpenFromDetail(selectedVilla)}
                        className="rounded-xl bg-[#FF385C] hover:bg-rose-600 text-white px-3.5 py-2.5 text-xs font-extrabold active:scale-95 transition shadow-sm whitespace-nowrap shrink-0"
                      >
                        Rezervasyon Yap
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- RESERVATION REQUEST FORM DIALOG ----------------- */}
      {quickBookVilla && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          id="quick-book-dialog"
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div
              className="fixed inset-0 bg-stone-950/65 backdrop-blur-xs transition-opacity"
              onClick={() => setQuickBookVilla(null)}
            />

            <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-md my-8 p-6 sm:p-8 animate-in zoom-in-95 duration-200 border border-stone-200">
              {/* Close Button overlay */}
              <button
                onClick={() => setQuickBookVilla(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {formSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4 border border-emerald-150">
                    <Check className="h-8 w-8 text-emerald-600 stroke-[3px]" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Talebiniz AlÄ±ndÄ±!
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 max-w-xs mx-auto leading-relaxed">
                    Ã–n rezervasyon isteÄŸiniz baÅŸarÄ±yla oluÅŸturuldu. Ev sahibine
                    iletilmek Ã¼zere WhatsApp yÃ¶nlendirmeniz hazÄ±rlanÄ±yor...
                  </p>

                  <div className="mt-6 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100 text-left text-xs space-y-1.5 text-stone-600 font-medium">
                    <p>
                      â€¢ <strong>Konut:</strong> {quickBookVilla.name}
                    </p>
                    <p>
                      â€¢ <strong>Tarihler:</strong> {bookingForm.checkIn} /{" "}
                      {bookingForm.checkOut}
                    </p>
                    <p>
                      â€¢ <strong>Ad Soyad:</strong> {bookingForm.name}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-extrabold text-stone-900 tracking-tight flex items-center gap-2 font-display">
                    <Calendar className="h-5 w-5 text-stone-950" />
                    Ã–n Rezervasyon Talebi
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 mb-6">
                    SeÃ§tiÄŸiniz <strong>{quickBookVilla.name}</strong> iÃ§in kolay
                    iletiÅŸim bilgilerinizi giriniz.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!currentUser) {
                        // Handle quick registration first
                        const nameInput = (
                          e.currentTarget.elements.namedItem(
                            "regName",
                          ) as HTMLInputElement
                        )?.value;
                        const tcInput = (
                          e.currentTarget.elements.namedItem(
                            "regTc",
                          ) as HTMLInputElement
                        )?.value;
                        const phoneInput = (
                          e.currentTarget.elements.namedItem(
                            "regPhone",
                          ) as HTMLInputElement
                        )?.value;
                        const emailInput = (
                          e.currentTarget.elements.namedItem(
                            "regEmail",
                          ) as HTMLInputElement
                        )?.value;

                        if (!nameInput || !tcInput || !phoneInput) {
                          alert(
                            "LÃ¼tfen tÃ¼m zorunlu Ã¼yelik ve iletiÅŸim alanlarÄ±nÄ± doldurunuz.",
                          );
                          return;
                        }

                        if (tcInput.length !== 11 || !/^\d+$/.test(tcInput)) {
                          alert(
                            "LÃ¼tfen geÃ§erli bir 11 haneli T.C. Kimlik NumarasÄ± giriniz.",
                          );
                          return;
                        }

                        const userObj = {
                          name: nameInput,
                          tcNo: tcInput,
                          phone: phoneInput,
                          email: emailInput || "",
                        };
                        setCurrentUser(userObj);
                        localStorage.setItem(
                          "guest_user_profile",
                          JSON.stringify(userObj),
                        );

                        setBookingForm((prev) => ({
                          ...prev,
                          name: userObj.name,
                          phone: userObj.phone,
                          email: userObj.email,
                        }));

                        alert(
                          "ÃœyeliÄŸiniz ve T.C. Kimlik beyanÄ±nÄ±z baÅŸarÄ±yla kaydedildi! Åimdi rezervasyonunuzu onaylamaya hazÄ±rsÄ±nÄ±z.",
                        );
                        return;
                      }
                      handleSubmitBooking(e);
                    }}
                    className="space-y-4"
                  >
                    {!currentUser ? (
                      <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-3.5 my-3">
                        <span className="text-[10px] font-extrabold uppercase bg-rose-150 text-[#FF385C] border border-rose-200 px-2.5 py-0.5 rounded-md inline-block">
                          KÄ°MLÄ°K BÄ°LDÄ°RÄ°MÄ° GEREKLÄ°
                        </span>
                        <p className="text-[11px] text-stone-605 leading-relaxed font-semibold">
                          Yasal mevzuat gereÄŸi (KBBS) tÃ¼m konaklayanlarÄ±n T.C.
                          Kimlik NumarasÄ± kaydÄ± zorunludur. Devam etmek iÃ§in
                          lÃ¼tfen bilgilerinizi bir defaya mahsus beyan edin:
                        </p>

                        <div className="space-y-2.5">
                          <div>
                            <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                              ADINIZ SOYADINIZ{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="regName"
                              required
                              placeholder="Ã–rn: Ahmet YÄ±lmaz"
                              className="w-full rounded-xl border border-stone-250 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#FF385C]"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                              T.C. KÄ°MLÄ°K NUMARANIZ{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="regTc"
                              required
                              maxLength={11}
                              placeholder="11 haneli kimlik numarasÄ±"
                              className="w-full rounded-xl border border-stone-250 bg-white px-3 py-2 text-xs text-stone-850 focus:outline-none focus:border-[#FF385C] font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                                CEP TELEFONU{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                name="regPhone"
                                required
                                placeholder="0532 123 4567"
                                className="w-full rounded-xl border border-stone-250 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#FF385C] font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                                E-POSTA ADRESÄ°
                              </label>
                              <input
                                type="email"
                                name="regEmail"
                                placeholder="ahmet@example.com"
                                className="w-full rounded-xl border border-stone-250 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#FF385C] font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold py-2.5 text-xs transition active:scale-95 mt-2"
                        >
                          KÄ°MLÄ°K BÄ°LGÄ°LERÄ°NÄ° KAYDET
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="bg-emerald-55/10 p-3 rounded-2xl border border-emerald-100 flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <div>
                            <span className="block text-[9px] text-stone-400 font-bold uppercase">
                              Rezervasyon Sahibi
                            </span>
                            <span className="text-xs font-bold text-stone-800">
                              {currentUser.name}
                            </span>
                            <span className="text-[10px] text-stone-500 ml-1.5 font-mono">
                              (T.C.: {currentUser.tcNo.substring(0, 3)}*****
                              {currentUser.tcNo.substring(
                                currentUser.tcNo.length - 3,
                              )}
                              )
                            </span>
                          </div>
                        </div>

                        {/* Selected Dates Display (Airbnb style) */}
                        <div className="grid grid-cols-2 gap-2.5 mt-4">
                          <div className="text-left bg-stone-50 p-3 rounded-2xl border border-stone-200 shadow-3xs">
                            <span className="block text-[11px] font-extrabold text-stone-400 uppercase mb-0.5">
                              GiriÅŸ Tarihi
                            </span>
                            <span className="text-[13px] sm:text-sm font-black text-stone-850 font-mono">
                              {bookingForm.checkIn
                                ? formatTurkishDate(bookingForm.checkIn)
                                : "SeÃ§iniz"}
                            </span>
                          </div>
                          <div className="text-left bg-stone-50 p-3 rounded-2xl border border-stone-200 shadow-3xs">
                            <span className="block text-[11px] font-extrabold text-stone-400 uppercase mb-0.5">
                              Ã‡Ä±kÄ±ÅŸ Tarihi
                            </span>
                            <span className="text-[13px] sm:text-sm font-black text-[#FF385C] font-mono">
                              {bookingForm.checkOut
                                ? formatTurkishDate(bookingForm.checkOut)
                                : "SeÃ§iniz"}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Single-Month Range Calendar Picker */}
                        {(() => {
                          const today = new Date();
                          const todayStr = today.toISOString().substring(0, 10);

                          const getDaysInMonth = (y: number, m: number) => {
                            return new Date(y, m + 1, 0).getDate();
                          };

                          const getFirstDayOfWeek = (y: number, m: number) => {
                            const d = new Date(y, m, 1).getDay();
                            return d === 0 ? 6 : d - 1; // 0 for Monday, 6 for Sunday
                          };

                          const padZero = (n: number) =>
                            n.toString().padStart(2, "0");

                          const totalDays = getDaysInMonth(
                            calendarYear,
                            calendarMonth,
                          );
                          const firstDayIdx = getFirstDayOfWeek(
                            calendarYear,
                            calendarMonth,
                          );

                          const pYear =
                            calendarMonth === 0
                              ? calendarYear - 1
                              : calendarYear;
                          const pMonth =
                            calendarMonth === 0 ? 11 : calendarMonth - 1;
                          const nYear =
                            calendarMonth === 11
                              ? calendarYear + 1
                              : calendarYear;
                          const nMonth =
                            calendarMonth === 11 ? 0 : calendarMonth + 1;

                          const turkishMonths = [
                            "Ocak",
                            "Åubat",
                            "Mart",
                            "Nisan",
                            "MayÄ±s",
                            "Haziran",
                            "Temmuz",
                            "AÄŸustos",
                            "EylÃ¼l",
                            "Ekim",
                            "KasÄ±m",
                            "AralÄ±k",
                          ];

                          const isDateBooked = (dateStr: string) => {
                            return bookings.some((b) => {
                              if (
                                b.villaId !== quickBookVilla.id ||
                                b.status === "cancelled"
                              )
                                return false;
                              return (
                                dateStr >= b.checkIn && dateStr < b.checkOut
                              );
                            });
                          };

                          // Render days
                          const daySlots = [];
                          for (let i = 0; i < firstDayIdx; i++) {
                            daySlots.push(null);
                          }
                          for (let d = 1; d <= totalDays; d++) {
                            daySlots.push(
                              `${calendarYear}-${padZero(calendarMonth + 1)}-${padZero(d)}`,
                            );
                          }

                          const handleDayClick = (dateStr: string) => {
                            if (dateStr < todayStr) return; // past days are closed
                            if (isDateBooked(dateStr)) return; // booked days are closed

                            if (
                              !bookingForm.checkIn ||
                              (bookingForm.checkIn && bookingForm.checkOut)
                            ) {
                              setBookingForm((prev) => ({
                                ...prev,
                                checkIn: dateStr,
                                checkOut: "",
                              }));
                            } else {
                              if (dateStr < bookingForm.checkIn) {
                                // Reset check-in to newer date
                                setBookingForm((prev) => ({
                                  ...prev,
                                  checkIn: dateStr,
                                  checkOut: "",
                                }));
                              } else {
                                // Set check-out
                                setBookingForm((prev) => ({
                                  ...prev,
                                  checkOut: dateStr,
                                }));
                              }
                            }
                          };

                          return (
                            <div className="bg-white border border-stone-200 rounded-3xl p-4 space-y-3 font-sans shadow-xs my-2.5">
                              <div className="flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCalendarMonth(pMonth);
                                    setCalendarYear(pYear);
                                  }}
                                  className="p-1.5 rounded-full hover:bg-stone-50 border border-stone-200 text-stone-600 transition active:scale-95 cursor-pointer"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>
                                <span className="font-extrabold text-[12px] text-stone-800 uppercase tracking-tight">
                                  {turkishMonths[calendarMonth]} {calendarYear}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCalendarMonth(nMonth);
                                    setCalendarYear(nYear);
                                  }}
                                  className="p-1.5 rounded-full hover:bg-stone-50 border border-stone-200 text-stone-600 transition active:scale-95 cursor-pointer"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Weekdays names */}
                              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-stone-400 uppercase">
                                {["Pt", "Sa", "Ã‡a", "Pe", "Cu", "Ct", "Pz"].map(
                                  (w, idx) => (
                                    <div key={idx} className="py-1">
                                      {w}
                                    </div>
                                  ),
                                )}
                              </div>

                              {/* Days view list */}
                              <div className="grid grid-cols-7 gap-1 text-center">
                                {daySlots.map((dateStr, idx) => {
                                  if (!dateStr) {
                                    return <div key={`empty-${idx}`} />;
                                  }

                                  const dayNum = parseInt(
                                    dateStr.split("-")[2],
                                  );
                                  const isPast = dateStr < todayStr;
                                  const isBooked = isDateBooked(dateStr);

                                  const isCheckIn =
                                    bookingForm.checkIn === dateStr;
                                  const isCheckOut =
                                    bookingForm.checkOut === dateStr;
                                  const isInRange =
                                    bookingForm.checkIn &&
                                    bookingForm.checkOut &&
                                    dateStr > bookingForm.checkIn &&
                                    dateStr < bookingForm.checkOut;

                                  let classNames =
                                    "h-8 w-8 text-[11px] font-bold flex items-center justify-center rounded-full mx-auto transition ";

                                  if (isPast) {
                                    classNames +=
                                      "text-stone-300 cursor-not-allowed select-none line-through opacity-40";
                                  } else if (isBooked) {
                                    classNames +=
                                      "text-stone-400 bg-stone-100 line-through cursor-not-allowed select-none";
                                  } else if (isCheckIn || isCheckOut) {
                                    classNames +=
                                      "bg-[#FF385C] text-white font-extrabold shadow-xs scale-105";
                                  } else if (isInRange) {
                                    classNames +=
                                      "bg-rose-50 text-[#FF385C] font-extrabold rounded-none w-full";
                                  } else {
                                    classNames +=
                                      "text-stone-700 hover:bg-stone-100 cursor-pointer active:scale-95";
                                  }

                                  return (
                                    <div
                                      key={dateStr}
                                      onClick={() => handleDayClick(dateStr)}
                                      className="py-0.5 relative flex items-center justify-center"
                                    >
                                      <div className={classNames}>{dayNum}</div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Status Info Lines */}
                              <div className="text-[10px] text-center text-stone-500 font-sans border-t border-stone-100 pt-2 flex flex-col gap-1">
                                {!bookingForm.checkIn && (
                                  <span className="text-stone-400 font-medium">
                                    ğŸ’¡ LÃ¼tfen GiriÅŸ Tarihi seÃ§mek iÃ§in
                                    yukarÄ±daki gÃ¼nlerden birine tÄ±klayÄ±n.
                                  </span>
                                )}
                                {bookingForm.checkIn &&
                                  !bookingForm.checkOut && (
                                    <span className="text-[#FF385C] font-extrabold animate-pulse">
                                      ğŸ‘‰ Åimdi lÃ¼tfen Ã‡Ä±kÄ±ÅŸ Tarihiniz olacak
                                      gÃ¼nÃ¼ seÃ§iniz.
                                    </span>
                                  )}
                                {bookingForm.checkIn &&
                                  bookingForm.checkOut && (
                                    <span className="text-[15px] sm:text-[16px] text-emerald-900 font-extrabold bg-emerald-50 border-2 border-emerald-350 px-4 py-2.5 rounded-2xl animate-fade-in block my-2 shadow-xs text-center leading-relaxed">
                                      âœ“{" "}
                                      {
                                        getCalculatePriceInfo(
                                          quickBookVilla,
                                          bookingForm.checkIn,
                                          bookingForm.checkOut,
                                        ).days
                                      }{" "}
                                      Gece Rezervasyon AralÄ±ÄŸÄ± SeÃ§ildi!
                                    </span>
                                  )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Kademeli fiyat uygulamasÄ± bilgisi ve Minimum stay condition info box */}
                        <div className="space-y-2 font-sans pt-1">
                          <p className="text-[11px] font-bold text-stone-600 leading-snug">
                            kademeli fiyat uygulamasÄ± olabilir ev sahibi farklÄ± tarihlerde farklÄ± fiyatlar uygulayabilir..
                          </p>
                          <div className="text-[12px] text-blue-800 bg-blue-50 border border-blue-150 px-3.5 py-3 rounded-2xl font-bold flex items-start gap-2 shadow-xs">
                            <span className="text-blue-550 text-[14px]">â„¹ï¸</span>
                            <span>
                              En az konaklama kuralÄ±: Bu ev iÃ§in en az {quickBookVilla.minNights || 2} gece seÃ§ilmelidir.
                            </span>
                          </div>
                        </div>

                        {/* Minimum nights duration conflict alert */}
                        {(() => {
                          const { days } = getCalculatePriceInfo(
                            quickBookVilla,
                            bookingForm.checkIn,
                            bookingForm.checkOut,
                          );
                          const minN = quickBookVilla.minNights || 2;
                          if (days > 0 && days < minN) {
                            return (
                              <div className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2.5 rounded-xl font-black">
                                âš ï¸ Yetersiz SÃ¼re: Ev sahibi bu ev iÃ§in en az{" "}
                                {minN} gece konaklama ÅŸartÄ± koymuÅŸtur. Sizin
                                seÃ§iminiz {days} gece. Rezervasyonu
                                tamamlayabilmek iÃ§in lÃ¼tfen en az {minN} gece
                                olacak ÅŸekilde bir tarih aralÄ±ÄŸÄ± seÃ§iniz.
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {/* Guests selection and additional items */}
                        <div>
                          <label className="block text-[11px] font-extrabold text-stone-405 uppercase tracking-wide mb-1.5">
                            MÄ°SAFÄ°R SAYISI{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={bookingForm.guestsCount}
                            onChange={(e) =>
                              setBookingForm((prev) => ({
                                ...prev,
                                guestsCount: Number(e.target.value),
                              }))
                            }
                            className="w-full rounded-xl border border-stone-250 bg-stone-50 px-3.5 py-3 text-[13px] sm:text-sm text-stone-850 font-bold focus:outline-none focus:border-[#FF385C] cursor-pointer"
                          >
                            {Array.from(
                              { length: quickBookVilla.capacity },
                              (_, i) => i + 1,
                            ).map((num) => (
                              <option
                                key={num}
                                value={num}
                                className="font-sans font-bold"
                              >
                                {num} KiÅŸi (Konaklayacak)
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Companions listing selector */}
                        {bookingForm.guestsCount > 1 && (
                          <div className="space-y-2.5 bg-stone-50/70 p-3.5 rounded-2xl border border-stone-150">
                            <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block">
                              DÄ°ÄER KONAKLAYACAK MÄ°SAFÄ°R BEYANLARI
                            </span>

                            {(() => {
                              const needed = bookingForm.guestsCount - 1;
                              let filled = 0;
                              for (let i = 0; i < needed; i++) {
                                if (bookingForm.selectedCompanionIds[i]) {
                                  filled++;
                                }
                              }
                              if (filled < needed) {
                                return (
                                  <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-2.5 font-bold leading-normal">
                                    âš ï¸ DiÄŸer konaklayacak {needed - filled}{" "}
                                    kiÅŸiyi henÃ¼z seÃ§mediniz! LÃ¼tfen aÅŸaÄŸÄ±daki
                                    listeden seÃ§im yapÄ±n veya yeni refakatÃ§i
                                    ekleyin.
                                  </div>
                                );
                              }
                              return (
                                <div className="text-[11px] text-emerald-850 bg-emerald-50 border border-emerald-150 rounded-xl p-2.5 font-bold">
                                  âœ“ Harika! TÃ¼m konaklayacak refakatÃ§iler
                                  baÅŸarÄ±yla belirlendi.
                                </div>
                              );
                            })()}

                            {Array.from({
                              length: bookingForm.guestsCount - 1,
                            }).map((_, idx) => {
                              const companionIdx = idx;
                              const selectedVal =
                                bookingForm.selectedCompanionIds[
                                  companionIdx
                                ] || "";
                              return (
                                <div key={companionIdx} className="space-y-1">
                                  <label className="block text-[11px] text-stone-650 font-extrabold">
                                    RefakatÃ§i {companionIdx + 2} Kimlik SeÃ§imi:
                                  </label>
                                  <select
                                    value={selectedVal}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setBookingForm((prev) => {
                                        const copy = [
                                          ...prev.selectedCompanionIds,
                                        ];
                                        copy[companionIdx] = val;
                                        return {
                                          ...prev,
                                          selectedCompanionIds: copy,
                                        };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-stone-250 bg-white px-3 py-2 text-[13px] text-stone-850 font-semibold focus:outline-none focus:border-[#FF385C]"
                                  >
                                    <option value="" className="font-semibold">
                                      -- SeÃ§eceÄŸiniz KiÅŸi --
                                    </option>
                                    <option
                                      value="later"
                                      className="font-semibold text-[#FF385C]"
                                    >
                                      Daha sonra eklenecek (KayÄ±t SonrasÄ±)
                                    </option>
                                    {companions.map((comp) => (
                                      <option
                                        key={comp.id}
                                        value={comp.id}
                                        className="font-mono"
                                      >
                                        {comp.name} (T.C.: {comp.tcNo})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}
                            {/* Inline Companion Addition Form */}
                            <div className="border-t border-stone-200/60 pt-2.5 mt-2">
                              {!showCompanionInlineForm ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCompanionInlineForm(true)
                                  }
                                  className="text-[11px] text-[#FF385C] hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
                                >
                                  + Listeye Yeni RefakatÃ§i (EÅŸ, Ã‡ocuk vb.)
                                  TanÄ±mla
                                </button>
                              ) : (
                                <div className="bg-stone-100/80 p-3 text-[12px] rounded-2xl border border-stone-200 text-stone-700 space-y-2.5">
                                  <div className="font-extrabold text-[10px] text-stone-400 uppercase">
                                    HÄ±zlÄ± RefakatÃ§i GiriÅŸi
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <input
                                        type="text"
                                        placeholder="Ad SoyadÄ±"
                                        value={inlineCompanionName}
                                        onChange={(e) =>
                                          setInlineCompanionName(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-stone-250 bg-white px-2.5 py-1.5 text-[11px] sm:text-xs focus:outline-none"
                                      />
                                    </div>
                                    <div>
                                      <input
                                        type="text"
                                        maxLength={11}
                                        placeholder="11 Haneli T.C."
                                        value={inlineCompanionTc}
                                        onChange={(e) =>
                                          setInlineCompanionTc(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-stone-250 bg-white px-2.5 py-1.5 text-[11px] sm:text-xs focus:outline-none font-mono"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2 text-[10px]">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setShowCompanionInlineForm(false);
                                        setInlineCompanionName("");
                                        setInlineCompanionTc("");
                                      }}
                                      className="px-2.5 py-1.5 text-stone-500 font-extrabold hover:underline cursor-pointer"
                                    >
                                      Ä°ptal
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (
                                          !inlineCompanionName ||
                                          inlineCompanionTc.length !== 11
                                        ) {
                                          alert(
                                            "LÃ¼tfen ad soyadÄ± doldurun ve 11 haneli T.C. Kimlik numarasÄ±nÄ± doÄŸru girin.",
                                          );
                                          return;
                                        }
                                        const newComp = {
                                          id: Date.now().toString(),
                                          name: inlineCompanionName,
                                          tcNo: inlineCompanionTc,
                                        };
                                        const updatedComps = [
                                          ...companions,
                                          newComp,
                                        ];
                                        setCompanions(updatedComps);
                                        localStorage.setItem(
                                          "guest_companions",
                                          JSON.stringify(updatedComps),
                                        );

                                        // Auto select this newly added companion for the first empty companion slot
                                        setBookingForm((prev) => {
                                          const copy = [
                                            ...prev.selectedCompanionIds,
                                          ];
                                          const firstEmptyIdx = copy.findIndex(
                                            (id) => !id,
                                          );
                                          if (firstEmptyIdx !== -1) {
                                            copy[firstEmptyIdx] = newComp.id;
                                          } else {
                                            copy.push(newComp.id);
                                          }
                                          return {
                                            ...prev,
                                            selectedCompanionIds: copy,
                                          };
                                        });

                                        setInlineCompanionName("");
                                        setInlineCompanionTc("");
                                        setShowCompanionInlineForm(false);
                                      }}
                                      className="bg-stone-900 hover:bg-[#FF385C] text-white rounded-lg px-3 py-1.5 font-extrabold transition font-sans cursor-pointer"
                                    >
                                      Eklemeyi Tamamla
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Interactive Extra Services Selection */}
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-[#FF385C] tracking-wider">
                            EKSTRA HÄ°ZMETLERÄ° SEÃ‡Ä°MÄ°
                          </label>
                          <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl space-y-3">
                            {(quickBookVilla.extraServices || []).length ===
                            0 ? (
                              <p className="text-[11px] text-[#A6A6A6] font-sans italic">
                                Bu konut iÃ§in ev sahibi henÃ¼z bir ekstra yemek,
                                gezi veya transfer hizmeti tanÄ±mlamadÄ±.
                              </p>
                            ) : (
                              <div className="space-y-2.5 font-sans">
                                {quickBookVilla.extraServices.map((srv) => {
                                  const currentQty =
                                    bookingForm.serviceQuantities?.[srv.id] ||
                                    0;
                                  const isPersonBased =
                                    srv.type === "per_person_daily" ||
                                    srv.type === "per_person_flat";
                                  const explanation = isPersonBased
                                    ? `(KiÅŸi BaÅŸÄ± â‚º${srv.price.toLocaleString("tr-TR")} â€¢ Toplam: â‚º${(srv.price * bookingForm.guestsCount).toLocaleString("tr-TR")} x ${currentQty})`
                                    : `(Paket â‚º${srv.price.toLocaleString("tr-TR")} x ${currentQty})`;

                                  return (
                                    <div
                                      key={srv.id}
                                      className="flex items-center justify-between p-2.5 bg-white border border-stone-200 hover:border-[#FF385C]/35 rounded-xl transition shadow-xs"
                                    >
                                      <div className="flex flex-col select-none max-w-[65%]">
                                        <span className="text-stone-900 font-bold text-xs">
                                          {srv.name}
                                        </span>
                                        <span className="text-stone-500 text-[10px] sm:text-[11px] font-medium leading-none mt-1">
                                          {explanation}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setBookingForm((prev) => {
                                              const newQuantities = {
                                                ...prev.serviceQuantities,
                                              };
                                              const current =
                                                newQuantities[srv.id] || 0;
                                              if (current > 0) {
                                                newQuantities[srv.id] =
                                                  current - 1;
                                              }
                                              return {
                                                ...prev,
                                                serviceQuantities:
                                                  newQuantities,
                                              };
                                            });
                                          }}
                                          className="h-7 w-7 bg-stone-100 hover:bg-stone-200 text-stone-750 font-black rounded-lg flex items-center justify-center text-xs transition cursor-pointer select-none"
                                        >
                                          -
                                        </button>
                                        <span className="font-mono text-xs font-black min-w-[18px] text-center text-stone-900 select-none">
                                          {currentQty}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setBookingForm((prev) => {
                                              const newQuantities = {
                                                ...prev.serviceQuantities,
                                              };
                                              newQuantities[srv.id] =
                                                (newQuantities[srv.id] || 0) +
                                                1;
                                              return {
                                                ...prev,
                                                serviceQuantities:
                                                  newQuantities,
                                              };
                                            });
                                          }}
                                          className="h-7 w-7 bg-stone-900 hover:bg-[#FF385C] text-white font-black rounded-lg flex items-center justify-center text-xs transition cursor-pointer select-none"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ğŸ·ï¸ Promosyon Kodu / Kampanya Uygulama Paneli */}
                        <div className="mt-4 border border-stone-200 bg-stone-50/50 rounded-2xl p-4">
                          <span className="text-[10px] sm:text-[11px] font-extrabold text-[#FF385C] uppercase tracking-wider block mb-2 font-display">
                            ğŸ·ï¸ Promosyon / Kampanya Kodunuz varsa yazÄ±nÄ±z..
                          </span>
                          
                          {appliedCampaign ? (
                            <div className="flex items-center justify-between bg-emerald-55/15 border border-emerald-200 p-2.5 rounded-xl font-sans">
                              <div>
                                <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                                  KUPON UYGULANDI ğŸ‰
                                </span>
                                <span className="text-xs font-bold text-stone-850">
                                  {appliedCampaign.code} ({appliedCampaign.name})
                                </span>
                                <span className="block text-[10px] text-emerald-600 font-bold mt-0.5">
                                  {appliedCampaign.discountType === "percentage" 
                                    ? `-%${appliedCampaign.discountValue} Ä°ndirim`
                                    : `-â‚º${appliedCampaign.discountValue.toLocaleString("tr-TR")} Sabit Ä°ndirim`}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setAppliedCampaign(null)}
                                className="text-[10px] uppercase font-black tracking-wider text-rose-600 hover:text-rose-800 transition px-2.5 py-1 bg-white hover:bg-rose-50 border border-stone-200 rounded-lg shrink-0 cursor-pointer"
                              >
                                Ä°ptal Et
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex gap-2 font-sans">
                                <input
                                  type="text"
                                  value={couponCodeInput}
                                  onChange={(e) => {
                                    setCouponCodeInput(e.target.value.toUpperCase());
                                    setCouponError("");
                                  }}
                                  placeholder="Kodunuzu YazÄ±nÄ±z"
                                  className="flex-1 rounded-xl border border-stone-250 bg-white px-3 py-2 text-xs font-bold font-mono placeholder-stone-405 focus:outline-none focus:border-[#FF385C]"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!couponCodeInput.trim()) {
                                      setCouponError("LÃ¼tfen bir promosyon kodu giriniz.");
                                      return;
                                    }
                                    const match = campaigns.find(
                                      (c) =>
                                        c.code.toUpperCase() === couponCodeInput.trim().toUpperCase() &&
                                        c.isActive
                                    );
                                    if (!match) {
                                      setCouponError("GeÃ§ersiz veya sÃ¼resi geÃ§miÅŸ promosyon kodu.");
                                      return;
                                    }
                                    // Make sure targets either this villa or all villas
                                    if (match.targetVillaId !== "all" && match.targetVillaId !== quickBookVilla.id) {
                                      setCouponError("Bu kupon bu konut iÃ§in geÃ§erli deÄŸildir.");
                                      return;
                                    }
                                    setAppliedCampaign(match);
                                    setCouponError("");
                                  }}
                                  className="px-4 py-2 bg-stone-900 border border-stone-905 text-white hover:bg-[#FF385C] hover:border-[#FF385C] text-xs font-black rounded-xl transition cursor-pointer font-sans"
                                >
                                  Uygula
                                </button>
                              </div>
                              {couponError && (
                                <span className="block text-[10px] text-rose-600 font-bold mt-1.5 font-sans">
                                  âš ï¸ {couponError}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Pricing and calculation breakdown table */}
                        {(() => {
                          const { days, total } = getCalculatePriceInfo(
                            quickBookVilla,
                            bookingForm.checkIn,
                            bookingForm.checkOut,
                          );
                          if (days <= 0) return null;

                          let servicesCost = 0;
                          const breakDownServices: {
                            name: string;
                            cost: number;
                          }[] = [];
                          if (quickBookVilla.extraServices) {
                            quickBookVilla.extraServices.forEach((srv) => {
                              const qty =
                                bookingForm.serviceQuantities?.[srv.id] || 0;
                              if (qty > 0) {
                                let cost = 0;
                                if (
                                  srv.type === "per_person_daily" ||
                                  srv.type === "per_person_flat"
                                ) {
                                  cost =
                                    srv.price * bookingForm.guestsCount * qty;
                                } else {
                                  cost = srv.price * qty;
                                }
                                servicesCost += cost;
                                breakDownServices.push({
                                  name: `${srv.name} (x${qty})`,
                                  cost,
                                });
                              }
                            });
                          }

                          let campaignDiscountAmount = 0;
                          if (appliedCampaign) {
                            if (appliedCampaign.discountType === "percentage") {
                              campaignDiscountAmount = Math.round(total * (appliedCampaign.discountValue / 100));
                            } else {
                              campaignDiscountAmount = Math.round(appliedCampaign.discountValue);
                            }
                          }
                          const rentalAfterDiscount = Math.max(0, total - campaignDiscountAmount);
                          const finalTotal = rentalAfterDiscount + servicesCost;
                          const kaparo = Math.round(rentalAfterDiscount * 0.1);
                          const prePaymentRate =
                            quickBookVilla.prePaymentRate || 0;
                          const kesinPayment =
                            prePaymentRate > 0
                              ? Math.round(rentalAfterDiscount * (prePaymentRate / 100))
                              : 0;
                          const remainingPercent = 90 - prePaymentRate;
                          const onRezOdenecek = kaparo + kesinPayment + servicesCost;
                          const kalanKapida = finalTotal - onRezOdenecek;

                          return (
                            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-700 space-y-2 mt-4 font-sans">
                              <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 tracking-wide border-b border-stone-250 pb-1.5">
                                <span>HESAPLAMA TABLOSU</span>
                                <span className="font-mono">
                                  SÃ¼re: {days} Gece
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Kiralama Bedeli ({days} Gece):</span>
                                <span className={`font-bold ${appliedCampaign ? "line-through text-stone-400" : "text-stone-850"}`}>
                                  â‚º{total.toLocaleString("tr-TR")}
                                </span>
                              </div>
                              {appliedCampaign && (
                                <div className="flex justify-between text-emerald-800 font-bold bg-emerald-500/5 p-1 rounded">
                                  <span>â†³ Kupon Ä°ndirimi ({appliedCampaign.code}):</span>
                                  <span>
                                    -â‚º{campaignDiscountAmount.toLocaleString("tr-TR")}
                                  </span>
                                </div>
                              )}
                              {appliedCampaign && (
                                <div className="flex justify-between font-bold text-stone-850 pt-0.5 border-b border-stone-200/50 pb-1">
                                  <span>KampanyalÄ± Kira Bedeli:</span>
                                  <span className="text-emerald-700 font-mono">
                                    â‚º{rentalAfterDiscount.toLocaleString("tr-TR")}
                                  </span>
                                </div>
                              )}
                              {breakDownServices.map((srv, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="flex justify-between text-stone-605"
                                >
                                  <span>+ {srv.name}:</span>
                                  <span className="font-semibold text-emerald-800">
                                    â‚º{srv.cost.toLocaleString("tr-TR")}
                                  </span>
                                </div>
                              ))}

                              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-sm text-stone-900">
                                <span>Toplam Ã–deme:</span>
                                <span className="font-mono text-stone-950 text-base">
                                  â‚º{finalTotal.toLocaleString("tr-TR")}
                                </span>
                              </div>

                              <div className="space-y-1.5 pt-1.5 border-t border-dashed border-stone-200">
                                <div className="flex justify-between items-center text-rose-600 bg-rose-50/50 p-2 rounded-xl border border-rose-105 font-bold">
                                  <span>
                                    Ã–n Rezervasyon Kaparo %10 (Ã–n Ã–deme):
                                  </span>
                                  <span className="font-mono">
                                    â‚º{kaparo.toLocaleString("tr-TR")}
                                  </span>
                                </div>

                                {prePaymentRate > 0 && (
                                  <div className="flex justify-between items-center text-amber-700 bg-amber-50/55 p-2 rounded-xl border border-amber-105 font-bold">
                                    <span>
                                      Kesin Rezervasyon ile Ã¶deme %
                                      {prePaymentRate} (Ã–n Ã–deme):
                                    </span>
                                    <span className="font-mono">
                                      â‚º{kesinPayment.toLocaleString("tr-TR")}
                                    </span>
                                  </div>
                                )}

                                <div className="flex justify-between items-center text-stone-700 bg-stone-100/50 p-2 rounded-xl border border-stone-200 font-bold">
                                  <span>
                                    KapÄ±da Kalan (%{remainingPercent} Kalan):
                                  </span>
                                  <span className="font-mono">
                                    â‚º{kalanKapida.toLocaleString("tr-TR")}
                                  </span>
                                </div>

                                {servicesCost > 0 && (
                                  <div className="flex justify-between items-center text-emerald-800 bg-emerald-55/10 p-2 rounded-xl border border-emerald-150 font-semibold">
                                    <span>Ek Hizmetler ToplamÄ±:</span>
                                    <span className="font-mono">
                                      â‚º{servicesCost.toLocaleString("tr-TR")}
                                    </span>
                                  </div>
                                )}

                                <div className="flex justify-between items-center text-white bg-stone-900 p-2.5 rounded-xl font-black mt-2 text-xs shadow-sm">
                                  <span>Ã–n Rezervasyonda Ã–denecek:</span>
                                  <span className="font-mono text-sm text-[#FF385C]">
                                    â‚º{onRezOdenecek.toLocaleString("tr-TR")}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2 flex items-start gap-1 p-2 bg-rose-50/30 rounded-xl border border-rose-100/40 text-[10px] text-stone-500 font-sans leading-relaxed">
                                <span className="text-rose-500 font-black shrink-0 font-mono">
                                  â„¹ï¸
                                </span>
                                <span>
                                  Rezervasyon sÄ±rasÄ±nda sadece %10 Kaparo
                                  Ã¶demesi tahsil edilir, kalanÄ± kapÄ±da
                                  Ã¶dersiniz. Ã–n rezervasyon ile tahsil edilen
                                  %10 rezervasyon ev sahibi tarafÄ±ndan
                                  onaylanmazsa tarafÄ±nÄ±za iade edilir,
                                  maÄŸduriyet yaÅŸamazsÄ±nÄ±z. Ek hizmetler Ã¶nden
                                  tahsil edilir.
                                </span>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Dynamic Validation Warnings before Submit Button */}
                        {(() => {
                          const warnings: string[] = [];

                          // 1. Companion missing check
                          if (bookingForm.guestsCount > 1) {
                            const needed = bookingForm.guestsCount - 1;
                            let filled = 0;
                            for (let i = 0; i < needed; i++) {
                              if (bookingForm.selectedCompanionIds[i]) {
                                filled++;
                              }
                            }
                            if (filled < needed) {
                              warnings.push(
                                `âš ï¸ DiÄŸer konaklayacak ${needed - filled} kiÅŸiyi eklemediniz! Bildirim mevzuatÄ± gereÄŸi tÃ¼m misafir seÃ§imi zorunludur.`,
                              );
                            }
                          }

                          // 2. Min nights check
                          const { days } = getCalculatePriceInfo(
                            quickBookVilla,
                            bookingForm.checkIn,
                            bookingForm.checkOut,
                          );
                          const minN = quickBookVilla.minNights || 2;
                          if (days > 0 && days < minN) {
                            warnings.push(
                              `âš ï¸ SeÃ§iminiz ${days} gece. Bu ev sahibi iÃ§in asgari konaklama sÃ¼resi ${minN} gecedir.`,
                            );
                          }

                          // 3. Date overlap check
                          const hasOverlap = bookings.some((b) => {
                            if (
                              b.villaId !== quickBookVilla.id ||
                              b.status === "cancelled"
                            )
                              return false;
                            return (
                              bookingForm.checkIn < b.checkOut &&
                              bookingForm.checkOut > b.checkIn
                            );
                          });
                          if (hasOverlap) {
                            warnings.push(
                              `âš ï¸ SeÃ§ili tarihler arasÄ±nda dolu/rezervasyonu yapÄ±lmÄ±ÅŸ gÃ¼nler bulunmaktadÄ±r.`,
                            );
                          }

                          if (warnings.length === 0) return null;

                          return (
                            <div className="bg-rose-50 border-2 border-rose-300 text-rose-850 text-[12px] sm:text-[13px] p-4 rounded-2xl space-y-2 font-bold my-4 shadow-sm animate-pulse-subtle">
                              <div className="font-black text-[11px] sm:text-xs uppercase text-rose-950 tracking-wider flex items-center gap-1 border-b border-rose-200 pb-1.5 mb-1.5">
                                <span>âš ï¸</span>
                                <span>Ã–n Rezervasyon Tamamlama UyarÄ±larÄ±:</span>
                              </div>
                              {warnings.map((w, wIdx) => (
                                <div
                                  key={wIdx}
                                  className="flex items-start gap-2 leading-relaxed"
                                >
                                  <span className="shrink-0 text-red-600">
                                    â€¢
                                  </span>
                                  <span>{w}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })()}

                        {/* Submit Actions */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#FF385C] hover:bg-rose-600 py-4 text-[14px] font-black text-white transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                          >
                            <Calendar className="h-5 w-5" />
                            <span>Ã–n Rezervasyonu Tamamla</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 justify-center text-[10px] text-stone-400">
                          <Lock className="h-3.5 w-3.5" />
                          <span>
                            Rezervasyon talebiniz doÄŸrudan ev sahibine
                            aktarÄ±lÄ±r.
                          </span>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer view */}
      {(currentPath === "/" || !!matchedVilla) && <Footer />}

      {/* ----------------- UNIVERSAL LIGHTBOX ZOOM COMPONENT (Popup + Global images) ----------------- */}
      {zoomVilla !== null && zoomImageIndex !== null && (
        <div
          className="fixed inset-0 z-55 bg-stone-950/98 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200"
          id="universal-lightbox"
        >
          <div className="flex items-center justify-between text-white py-2 px-4 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            <span className="text-xs font-mono tracking-widest font-black uppercase">
              {zoomVilla.name} â€¢ RESÄ°M {zoomImageIndex + 1} /{" "}
              {zoomVilla.images.length}
            </span>
            <button
              onClick={() => {
                setZoomVilla(null);
                setZoomImageIndex(null);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-90"
              title="Kapat (X)"
              id="btn-close-global-zoom"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative select-none">
            {/* Left Nav */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomImageIndex((prev) =>
                  prev === null
                    ? null
                    : prev === 0
                      ? zoomVilla.images.length - 1
                      : prev - 1,
                );
              }}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 backdrop-blur-sm active:scale-90 transition shadow-md"
              title="Ã–nceki GÃ¶rsel"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            {/* Central Expanded Image */}
            <img
              src={
                zoomVilla.images[zoomImageIndex] ||
                "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800"
              }
              alt=""
              className="max-h-[82vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-white/5 animate-in zoom-in-95 duration-200"
              referrerPolicy="no-referrer"
            />

            {/* Right Nav */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomImageIndex((prev) =>
                  prev === null
                    ? null
                    : prev === zoomVilla.images.length - 1
                      ? 0
                      : prev + 1,
                );
              }}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 backdrop-blur-sm active:scale-90 transition shadow-md"
              title="Sonraki GÃ¶rsel"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>

          <div className="text-center text-white/50 text-[10px] pb-4">
            Gezinmek iÃ§in yanlardaki oklarÄ± kullanabilirsiniz. Kapatmak iÃ§in X
            butonuna basÄ±n.
          </div>
        </div>
      )}

      {/* Chat Bot floating bubble (Loaded with server memory capability) */}
      <AiAssistant />

      {/* Reservations Slide over Drawer for misafirler */}
      <ReservationPanel
        isOpen={showReservations}
        onClose={() => setShowReservations(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
      />

      {/* ==================== INTERACTIVE NAV MODALS & OVERLAYS ==================== */}

      {/* 1. GÄ°RÄ°Å POP-UP MODALI (KullanÄ±cÄ±, Ev Sahibi, Admin GiriÅŸleri) */}
      {activeLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-stone-200 shadow-2xl relative overflow-hidden animate-in zoom-in duration-150">
            {/* Modal color coded headers */}
            <div
              className={`p-5 text-white ${
                activeLoginPopup === "guest"
                  ? "bg-[#FF385C]"
                  : activeLoginPopup === "host"
                    ? "bg-stone-900 border-b-2 border-amber-500"
                    : "bg-blue-800"
              }`}
            >
              <span className="block text-[9px] font-black uppercase tracking-widest text-white/70">
                GÃœVENLÄ° ERÄ°ÅÄ°M PORTALI
              </span>
              <h3 className="text-base font-extrabold font-display mt-0.5">
                {activeLoginPopup === "guest" && "KullanÄ±cÄ± GiriÅŸi"}
                {activeLoginPopup === "host" && "Ev Sahibi GiriÅŸi"}
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const pStr = inputPhone.replace(/\s+/g, "");
                const pass = inputPassword;
                if (!pStr || !pass) {
                  alert("LÃ¼tfen alanlarÄ± giriniz.");
                  return;
                }

                let authed: any = null;
                if (
                  activeLoginPopup === "guest" &&
                  pStr === "5555555555" &&
                  pass === "123456"
                ) {
                  authed = {
                    name: "Hakan YalÃ§Ä±n",
                    phone: "0555 555 55 55",
                    tcNo: "33122144322",
                    email: "hakan@gmail.com",
                  };
                } else if (
                  activeLoginPopup === "host" &&
                  pStr === "5325323232" &&
                  pass === "123456"
                ) {
                  authed = {
                    name: "Ahmet YÄ±lmaz",
                    phone: "0532 532 32 32",
                    tcNo: "44211234566",
                  };
                } else if (
                  activeLoginPopup === "admin" &&
                  pStr === "5445444444" &&
                  pass === "123456"
                ) {
                  authed = {
                    name: "Zeynep Kaya (BaÅŸ YÃ¶netici)",
                    phone: "0544 544 44 44",
                    tcNo: "99122343211",
                  };
                } else {
                  // local check
                  const listKey = `registered_users_${activeLoginPopup}`;
                  const saved = localStorage.getItem(listKey);
                  if (saved) {
                    try {
                      const parsed = JSON.parse(saved);
                      const match = parsed.find(
                        (u: any) =>
                          u.phone.replace(/\s+/g, "") === pStr &&
                          u.password === pass,
                      );
                      if (match) authed = match;
                    } catch (e) {}
                  }
                }

                if (authed) {
                  if (activeLoginPopup === "guest") {
                    setCurrentUser(authed);
                    localStorage.setItem(
                      "guest_user_profile",
                      JSON.stringify(authed),
                    );
                    setActiveLoginPopup(null);
                    navigateTo("/kullanici");
                  } else if (activeLoginPopup === "host") {
                    setCurrentHost(authed);
                    localStorage.setItem(
                      "host_user_profile",
                      JSON.stringify(authed),
                    );
                    setActiveLoginPopup(null);
                    navigateTo("/evsahibi");
                  } else if (activeLoginPopup === "admin") {
                    setCurrentAdmin(authed);
                    localStorage.setItem(
                      "admin_user_profile",
                      JSON.stringify(authed),
                    );
                    setActiveLoginPopup(null);
                    navigateTo("/admin");
                  }
                  setInputPhone("");
                  setInputPassword("");
                } else {
                  alert(
                    "GiriÅŸ baÅŸarÄ±sÄ±z! Girilen telefon veya ÅŸifre uyuÅŸmuyor. LÃ¼tfen kayÄ±tlÄ± bilgileriniz ile tekrar deneyin.",
                  );
                }
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                  TelNo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-medium font-sans">
                    TR (+90)
                  </span>
                  <input
                    type="text"
                    required
                    value={inputPhone}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      let fmt = raw;
                      if (raw.length > 3 && raw.length <= 6) {
                        fmt = `${raw.slice(0, 3)} ${raw.slice(3)}`;
                      } else if (raw.length > 6 && raw.length <= 8) {
                        fmt = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
                      } else if (raw.length > 8) {
                        fmt = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6, 8)} ${raw.slice(8, 10)}`;
                      }
                      setInputPhone(fmt);
                    }}
                    placeholder="5XX XXX XX XX"
                    maxLength={13}
                    className="w-full rounded-xl border border-stone-250 bg-white pl-18 pr-3 py-2.5 text-xs text-stone-850 font-sans focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide">
                    Åifre <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          "Åifre sÄ±fÄ±rlama talebiniz baÅŸarÄ±yla oluÅŸturulmuÅŸtur. KayÄ±tlÄ± cep telefonu numaranÄ±za tek kullanÄ±mlÄ±k geÃ§ici ÅŸifre SMS olarak iletilecektir.",
                        )
                      ) {
                        setInputPassword("123456");
                      }
                    }}
                    className="text-[10px] text-stone-400 hover:text-stone-800 underline font-medium"
                  >
                    Åifremi Unuttum?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={inputShowPass ? "text" : "password"}
                    required
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    className="w-full rounded-xl border border-stone-250 bg-white px-3.5 py-2.5 text-xs text-stone-850 font-sans focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setInputShowPass(!inputShowPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] uppercase font-black text-stone-400 hover:text-stone-700"
                  >
                    {inputShowPass ? "Gizle" : "GÃ¶ster"}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full text-center rounded-xl py-3 text-xs font-black text-white transition-all active:scale-95 cursor-pointer shadow-md ${
                    activeLoginPopup === "guest"
                      ? "bg-[#FF385C] hover:bg-rose-600"
                      : activeLoginPopup === "host"
                        ? "bg-stone-900 border border-amber-500/30 hover:bg-stone-850 text-amber-400"
                        : "bg-blue-800 hover:bg-blue-700"
                  }`}
                >
                  GÄ°RÄ°Å YAP
                </button>
              </div>



              <div className="text-center text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                <span>HesabÄ±nÄ±z yok mu? </span>
                <button
                  type="button"
                  onClick={() => {
                    const currentRole = activeLoginPopup;
                    setActiveLoginPopup(null);
                    setActiveRegisterPopup(currentRole);
                  }}
                  className="text-stone-900 border-b border-stone-900 font-extrabold hover:text-[#FF385C]"
                >
                  Hemen Kaydolun
                </button>
              </div>
            </form>

            {/* Absolute close button */}
            <button
              onClick={() => {
                setActiveLoginPopup(null);
                setInputPhone("");
                setInputPassword("");
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1 rounded-full hover:bg-stone-100 text-xs font-bold font-sans cursor-pointer"
            >
              âœ•
            </button>
          </div>
        </div>
      )}

      {/* 2. KAYIT OLMA POP-UP MODALI */}
      {activeRegisterPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-stone-200 shadow-2xl relative overflow-hidden animate-in zoom-in duration-150">
            <div
              className={`p-5 text-white ${
                activeRegisterPopup === "guest"
                  ? "bg-[#FF385C]"
                  : activeRegisterPopup === "host"
                    ? "bg-stone-900 border-b-2 border-amber-500"
                    : "bg-blue-800"
              }`}
            >
              <span className="block text-[9px] font-black uppercase tracking-widest text-white/70">
                ÃœYELÄ°K BAÅVURU MERKEZÄ°
              </span>
              <h3 className="text-base font-extrabold font-display mt-0.5">
                {activeRegisterPopup === "guest" && "KullanÄ±cÄ± KayÄ±t Formu"}
                {activeRegisterPopup === "host" && "Ev Sahibi BaÅŸvuru KaydÄ±"}
                {activeRegisterPopup === "admin" && "YÃ¶netici Sicil KaydÄ±"}
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const pStr = regPhone.replace(/\s+/g, "");
                if (!regName.trim() || !pStr || !regPass || !regPassConfirm) {
                  alert("LÃ¼tfen tÃ¼m zorunlu alanlarÄ± doldurunuz.");
                  return;
                }
                if (regPass !== regPassConfirm) {
                  alert("Åifreler uyuÅŸmuyor!");
                  return;
                }

                // Save to lists
                const listKey = `registered_users_${activeRegisterPopup}`;
                let existing: any[] = [];
                const saved = localStorage.getItem(listKey);
                if (saved) {
                  try {
                    existing = JSON.parse(saved);
                  } catch (e) {}
                }

                const formatPhone = regPhone;
                const newUser = {
                  name: regName,
                  phone: formatPhone,
                  tcNo:
                    "111" +
                    Math.floor(10000000 + Math.random() * 90000000).toString(), // mock tc numbers
                  email: regEmail,
                  password: regPass,
                };

                existing.push(newUser);
                localStorage.setItem(listKey, JSON.stringify(existing));

                alert(
                  "Cihaz tescil kaydÄ±nÄ±z baÅŸarÄ±yla tamamlanmÄ±ÅŸtÄ±r! GiriÅŸ yapabilirsiniz.",
                );
                const origRole = activeRegisterPopup;
                setActiveRegisterPopup(null);
                setActiveLoginPopup(origRole);

                // clear signup text inputs
                setRegName("");
                setRegPhone("");
                setRegEmail("");
                setRegPass("");
                setRegPassConfirm("");
              }}
              className="p-5 space-y-3.5"
            >
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                  AdÄ±nÄ±z SoyadÄ±nÄ±z <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ã–rn: Hakan YalÃ§Ä±n"
                  className="w-full rounded-xl border border-stone-250 bg-white px-3 py-2 text-xs text-stone-850 font-sans focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                  ğŸ”’ Cep Telefon NumaranÄ±z{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-semibold">
                    TR (+90)
                  </span>
                  <input
                    type="text"
                    required
                    value={regPhone}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      let fmt = raw;
                      if (raw.length > 3 && raw.length <= 6) {
                        fmt = `${raw.slice(0, 3)} ${raw.slice(3)}`;
                      } else if (raw.length > 6 && raw.length <= 8) {
                        fmt = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
                      } else if (raw.length > 8) {
                        fmt = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6, 8)} ${raw.slice(8, 10)}`;
                      }
                      setRegPhone(fmt);
                    }}
                    placeholder="5XX XXX XX XX"
                    maxLength={13}
                    className="w-full rounded-xl border border-stone-250 bg-white pl-18 pr-3 py-2 text-xs text-stone-850 font-sans focus:outline-none"
                  />
                </div>
              </div>

              {activeRegisterPopup === "guest" && (
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                    E-Posta Adresi
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="hakan@Ã¶rnek.com"
                    className="w-full rounded-xl border border-stone-250 bg-white px-3 py-2 text-xs text-stone-850 font-sans focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                    Åifre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={regShowPass ? "text" : "password"}
                    required
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    className="w-full rounded-xl border border-stone-250 bg-white px-3 py-2 text-xs text-stone-850 font-sans focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                    Åifre Tekrar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={regShowPass ? "text" : "password"}
                    required
                    value={regPassConfirm}
                    onChange={(e) => setRegPassConfirm(e.target.value)}
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    className="w-full rounded-xl border border-stone-250 bg-white px-3 py-2 text-xs text-stone-850 font-sans focus:outline-none"
                  />
                </div>
              </div>

              {/* Show/hide checkbox exact design */}
              <div className="flex items-center gap-1.5 py-1">
                <input
                  type="checkbox"
                  id="regShow"
                  checked={regShowPass}
                  onChange={(e) => setRegShowPass(e.target.checked)}
                  className="rounded text-[#FF385C]"
                />
                <label
                  htmlFor="regShow"
                  className="text-[10px] font-bold text-stone-500 uppercase cursor-pointer"
                >
                  Åifreyi GÃ¶ster
                </label>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className={`w-full text-center rounded-xl py-2.5 text-xs font-black text-white transition-all active:scale-95 cursor-pointer shadow-md ${
                    activeRegisterPopup === "guest"
                      ? "bg-[#FF385C] hover:bg-rose-600"
                      : activeRegisterPopup === "host"
                        ? "bg-stone-900 border border-amber-500/30 hover:bg-stone-850 text-amber-400"
                        : "bg-blue-800 hover:bg-blue-700"
                  }`}
                >
                  HEMEN KAYDOL
                </button>
              </div>

              <div className="text-center text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                <span>Zaten hesabÄ±nÄ±z var mÄ±? </span>
                <button
                  type="button"
                  onClick={() => {
                    const currentRole = activeRegisterPopup;
                    setActiveRegisterPopup(null);
                    setActiveLoginPopup((origRole) => currentRole);
                  }}
                  className="text-stone-900 border-b border-stone-900 font-extrabold hover:text-[#FF385C]"
                >
                  Buradan GiriÅŸ YapÄ±n
                </button>
              </div>
            </form>

            <button
              onClick={() => {
                setActiveRegisterPopup(null);
                setRegName("");
                setRegPhone("");
                setRegEmail("");
                setRegPass("");
                setRegPassConfirm("");
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1 rounded-full hover:bg-stone-100 text-xs font-bold font-sans cursor-pointer"
            >
              âœ•
            </button>
          </div>
        </div>
      )}

      {/* 3. INTERACTIVE CITIES (ÅEHÄ°RLER) MODAL */}
      {showCitiesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-stone-200 shadow-2xl p-6 relative overflow-hidden animate-in zoom-in duration-150">
            <div className="mb-5">
              <span className="text-[9px] font-black uppercase text-[#FF385C] tracking-widest block">
                SAPANCA BÃ–LGELERÄ° VE CIVARI
              </span>
              <h3 className="text-lg font-black text-stone-950 font-display">
                Tesis Bulunan PopÃ¼ler Konumlar
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Ä°stediÄŸiniz bÃ¶lgeyi seÃ§erek hemen o bÃ¶lgedeki popÃ¼ler bungalov
                ve villalarÄ± listeleme paneline taÅŸÄ±yÄ±n.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: "Sapanca Merkez",
                  desc: "Sahil yÃ¼rÃ¼me yollarÄ±, kafeler ve gÃ¶l manzaralÄ± bungalov turlarÄ±.",
                  bg: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=300",
                },
                {
                  name: "KÄ±rkpÄ±nar",
                  desc: "Tarihi Ã§Ä±narlÄ± sokaklar, nezih bahÃ§eli villalar ve geniÅŸ araziler.",
                  bg: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=300",
                },
                {
                  name: "MaÅŸukiye",
                  desc: "GÃ¼rÃ¼l gÃ¼rÃ¼l akan ÅŸelaleler, alabalÄ±k nehirleri ve daÄŸ etekleri.",
                  bg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=300",
                },
                {
                  name: "YanÄ±k",
                  desc: "Sessiz doÄŸa, sakin ortam ve doÄŸa ile bÃ¼tÃ¼nleÅŸmiÅŸ geniÅŸ gÃ¶l Ã§iftlikleri.",
                  bg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=300",
                },
              ].map((loc, index) => {
                const count = villas.filter(
                  (v) => v.region === loc.name,
                ).length;
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setFilterRegion(loc.name);
                      setShowCitiesModal(false);
                      navigateTo("/");
                      setTimeout(() => {
                        const target = document.getElementById(
                          "villas-list-section",
                        );
                        if (target)
                          target.scrollIntoView({ behavior: "smooth" });
                      }, 120);
                    }}
                    className="flex gap-4 p-3 rounded-2xl border border-stone-200 hover:border-[#FF385C] hover:bg-rose-50/20 cursor-pointer transition-all shadow-xs group"
                  >
                    <img
                      src={loc.bg}
                      alt=""
                      className="h-16 w-16 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-stone-900 group-hover:text-[#FF385C]">
                          {loc.name}
                        </span>
                        <span className="bg-stone-100 text-stone-600 text-[9px] font-black px-2 py-0.5 rounded-md font-mono">
                          {count} Tesis
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                        {loc.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-stone-150 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setFilterRegion("Hepsi");
                  setShowCitiesModal(false);
                }}
                className="rounded-xl border border-stone-200 text-stone-600 font-extrabold px-4 py-2 text-xs hover:bg-stone-50 transition cursor-pointer"
              >
                TÃ¼mÃ¼nÃ¼ GÃ¶ster ve Kapat
              </button>
            </div>

            <button
              onClick={() => setShowCitiesModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1 rounded-full hover:bg-stone-100 text-xs font-bold font-sans cursor-pointer"
            >
              âœ•
            </button>
          </div>
        </div>
      )}

      {/* 4. KÄ°RALIK TEKNE ARA MODALI */}
      {showBoatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-stone-200 shadow-2xl p-6 relative overflow-hidden animate-in zoom-in duration-150">
            <div className="mb-5 flex items-center gap-2">
              <div className="h-10 w-10 text-amber-500 bg-amber-50 rounded-xl flex items-center justify-center font-bold">
                â›µ
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-amber-600 tracking-widest block">
                  SAPANCA GÃ–LÃœ PREMÄ°UM YAT KÄ°RALAMA
                </span>
                <h3 className="text-lg font-black text-stone-950 font-display">
                  LÃ¼ks Skippered Tekne Kiralama
                </h3>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {[
                {
                  name: "Sapanca Sky Cruiser",
                  d: "12 KiÅŸi Kapasiteli | SÃ¼rat ve KamaralÄ± LÃ¼ks Tekne",
                  h: "â‚º4.500/saat",
                  img: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=400",
                },
                {
                  name: "Lake Sunset Serenity",
                  d: "8 KiÅŸi Kapasiteli | GÃ¼neÅŸlenmeli KÄ±Ã§ Havuzlu Keyif Teknesi",
                  h: "â‚º3.800/saat",
                  img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=400",
                },
                {
                  name: "Water Wind Speedboat",
                  d: "6 KiÅŸi Kapasiteli | Su SporlarÄ± ve SÃ¼rat Turu Teknesi",
                  h: "â‚º2.900/saat",
                  img: "https://images.unsplash.com/photo-1473877995111-e4075af384ec?auto=format&fit=crop&q=80&w=400",
                },
              ].map((boat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-4 p-3 rounded-2xl border border-stone-150 hover:border-amber-400 bg-stone-50/40 hover:bg-amber-50/10 transition-all shadow-xs"
                >
                  <img
                    src={boat.img}
                    alt=""
                    className="h-28 sm:h-20 w-full sm:w-28 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                        {boat.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1">
                        {boat.d}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 sm:mt-0">
                      <span className="font-mono text-xs font-black text-stone-900 bg-amber-100/60 text-amber-900 px-2.5 py-0.5 rounded-lg border border-amber-200/50">
                        {boat.h}
                      </span>
                      <a
                        href={`https://wa.me/905300000000?text=${encodeURIComponent(`Merhaba, Sapanca gÃ¶lÃ¼nde ${boat.name} teknesi kiralama hakkÄ±nda fiyat ve uygunluk sormak istiyorum.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-black px-3.5 py-1.5 text-[10px] tracking-wide transition uppercase shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>REZERVASYON AL</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowBoatsModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1 rounded-full hover:bg-stone-100 text-xs font-bold font-sans cursor-pointer"
            >
              âœ•
            </button>
          </div>
        </div>
      )}

      {/* 5. TUR ETKÄ°NLÄ°KLERÄ° MODALI */}
      {showToursModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-stone-200 shadow-2xl p-6 relative overflow-hidden animate-in zoom-in duration-150">
            <div className="mb-5 flex items-center gap-2">
              <div className="h-10 w-10 text-emerald-500 bg-emerald-50 rounded-xl flex items-center justify-center font-bold">
                ğŸ€
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest block">
                  SAPANCA REHBERLÄ° ETKÄ°NLÄ°KLERÄ°
                </span>
                <h3 className="text-lg font-black text-stone-950 font-display">
                  Sapanca Macera & DoÄŸa TurlarÄ±
                </h3>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {[
                {
                  name: "Sapanca DaÄŸlarÄ± ATV Safari Turu",
                  d: "Ã‡amurlu yollar, orman geÃ§iÅŸli nehir sÃ¼rprizleri ve gÃ¶let manzarasÄ±.",
                  h: "â‚º1.200 / Havuzlu Atv",
                  img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=400",
                },
                {
                  name: "GÃ¶l Sunset Kano & KÃ¼rek TurlarÄ±",
                  d: "GÃ¶l ortasÄ±nda batarken kano keyfi, can yeleÄŸi ve rehber hocalar dahil.",
                  h: "â‚º800 / KiÅŸi",
                  img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=400",
                },
                {
                  name: "SamanlÄ± DaÄŸlarÄ± Trekking & Åelale KeÅŸfi",
                  d: "DoÄŸa yÃ¼rÃ¼yÃ¼ÅŸÃ¼, taze nehir sularÄ±, MaÅŸukiye orman pikniÄŸi.",
                  h: "â‚º950 / KiÅŸi",
                  img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400",
                },
              ].map((tour, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-4 p-3 rounded-2xl border border-stone-150 hover:border-emerald-400 bg-stone-50/40 hover:bg-emerald-50/10 transition-all shadow-xs"
                >
                  <img
                    src={tour.img}
                    alt=""
                    className="h-28 sm:h-20 w-full sm:w-28 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                        {tour.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                        {tour.d}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 sm:mt-0 pt-2 border-t border-stone-200/50">
                      <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        {tour.h}
                      </span>
                      <a
                        href={`https://wa.me/905300000000?text=${encodeURIComponent(`Merhaba, Sapanca'da ${tour.name} turu iÃ§in rezervasyon ve kontenjan durumu sormak istiyorum.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-1.5 text-[10px] tracking-wide transition uppercase shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>WHATSAPP REZERVASYON</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowToursModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1 rounded-full hover:bg-stone-100 text-xs font-bold font-sans cursor-pointer"
            >
              âœ•
            </button>
          </div>
        </div>
      )}

      {/* 6. Ä°LETÄ°ÅÄ°M VE ADRES MODALI */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-stone-200 shadow-2xl p-6 relative overflow-hidden animate-in zoom-in duration-150">
            <div className="mb-5 text-center">
              <span className="text-[9px] font-black uppercase text-[#FF385C] tracking-widest block">
                Ä°NTERAKTÄ°F Ä°LETÄ°ÅÄ°M MERKEZÄ°
              </span>
              <h3 className="text-md font-black text-stone-950 font-display">
                Acente Ä°rtibat Bilgileri
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60 text-xs">
                <span className="block text-stone-400 font-bold uppercase text-[9px] mb-1">
                  MÃ¼ÅŸteri Hizmetleri Telefon
                </span>
                <a
                  href={`tel:${AGENCY_DETAILS.phone}`}
                  className="font-mono font-bold text-stone-900 text-sm hover:text-[#FF385C] flex items-center gap-1.5"
                >
                  ğŸ“ {AGENCY_DETAILS.phone}
                </a>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60 text-xs">
                <span className="block text-stone-400 font-bold uppercase text-[9px] mb-1">
                  E-Posta Grubu
                </span>
                <b className="font-sans text-stone-900">
                  {AGENCY_DETAILS.email}
                </b>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60 text-xs">
                <span className="block text-stone-400 font-bold uppercase text-[9px] mb-1">
                  Merit Acente Adresi
                </span>
                <span className="font-sans text-stone-700 leading-normal block">
                  {AGENCY_DETAILS.address}
                </span>
              </div>

              <a
                href={`https://wa.me/905300000000?text=${encodeURIComponent(`Merhaba, Sapanca gÃ¶lÃ¼nde villa veya bungalov kiralama hakkÄ±nda canlÄ± destek desteÄŸi almak istiyorum.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 text-xs transition shadow shadow-emerald-500/10 active:scale-95 cursor-pointer mt-2"
              >
                <span>ğŸ’¬ CANLI WHATSAPP DESTEÄÄ°</span>
              </a>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1 rounded-full hover:bg-stone-100 text-xs font-bold font-sans cursor-pointer"
            >
              âœ•
            </button>
          </div>
        </div>
      )}

      {/* ğŸ·ï¸ YENÄ° KAMPANYA EKLE MODALI */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="add-campaign-dialog">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div
              className="fixed inset-0 bg-stone-950/65 backdrop-blur-xs transition-opacity animate-fade-in"
              onClick={() => setShowAddCampaignModal(false)}
            />
            
            <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-sm my-8 p-6 sm:p-7 border border-stone-200 duration-200 font-sans">
              <button
                onClick={() => setShowAddCampaignModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-sm font-black text-stone-900 tracking-tight flex items-center gap-2 font-display uppercase border-b border-stone-100 pb-3 mb-5">
                <span>ğŸ·ï¸ Yeni Kampanya TanÄ±mlama</span>
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCampaignForm.name.trim() || !newCampaignForm.code.trim()) {
                    alert("LÃ¼tfen kampanya adÄ±nÄ± ve kupon kodunu doldurunuz.");
                    return;
                  }
                  
                  // Validation of campaigns code duplicates
                  const isDup = campaigns.some(c => c.code.toUpperCase() === newCampaignForm.code.trim().toUpperCase());
                  if (isDup) {
                    alert("Hata: Bu promosyon kupon kodu zaten mevcuttur. LÃ¼tfen Ã¶zgÃ¼n bir kod yazÄ±nÄ±z.");
                    return;
                  }

                  const newCamp = {
                    id: "camp-" + Date.now(),
                    name: newCampaignForm.name.trim(),
                    code: newCampaignForm.code.trim().toUpperCase(),
                    discountType: newCampaignForm.discountType,
                    discountValue: Number(newCampaignForm.discountValue),
                    targetVillaId: newCampaignForm.targetVillaId,
                    isActive: true,
                    startDate: newCampaignForm.startDate,
                    endDate: newCampaignForm.endDate,
                  };

                  const updated = [...campaigns, newCamp];
                  saveCampaignsState(updated);
                  setShowAddCampaignModal(false);
                }}
                className="space-y-4"
              >
                {/* Kampanya AdÄ± */}
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1">
                    Kampanya AdÄ± (Genel TanÄ±m)
                  </label>
                  <input
                    type="text"
                    required
                    value={newCampaignForm.name}
                    onChange={(e) => setNewCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ã–rn: Hafta Sonu Erken Rezervasyon FÄ±rsatÄ±"
                    className="w-full rounded-xl border border-stone-250 bg-white px-3 py-1.5 text-xs font-bold text-stone-850 placeholder-stone-400 focus:outline-none focus:border-stone-450"
                  />
                </div>

                {/* Kampanya Promosyon Kodu */}
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1">
                    Promosyon / Kupon Kodu
                  </label>
                  <input
                    type="text"
                    required
                    value={newCampaignForm.code}
                    onChange={(e) => setNewCampaignForm(prev => ({ ...prev, code: e.target.value.toUpperCase().replace(/\s/g, "") }))}
                    placeholder="Ã–rn: SEZON10"
                    className="w-full rounded-xl border border-stone-250 bg-white px-3 py-1.5 text-xs font-black font-mono text-stone-850 placeholder-stone-400 focus:outline-none focus:border-stone-450"
                  />
                  <span className="block text-[9px] text-stone-400 mt-1">
                    BoÅŸluksuz harf ve rakamlar kullanabilirsiniz.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Ä°ndirim TÃ¼rÃ¼ */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1">
                      Ä°ndirim TÃ¼rÃ¼
                    </label>
                    <select
                      value={newCampaignForm.discountType}
                      onChange={(e) => setNewCampaignForm(prev => ({ ...prev, discountType: e.target.value as "percentage" | "fixed" }))}
                      className="w-full rounded-xl border border-stone-250 bg-white px-3 py-1.5 text-xs font-bold text-stone-850 focus:outline-none"
                    >
                      <option value="percentage">YÃ¼zde (%) Indirimi</option>
                      <option value="fixed">Sabit Tutar (â‚º) Indirimi</option>
                    </select>
                  </div>

                  {/* Ä°ndirim DeÄŸeri */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1">
                      Ä°ndirim DeÄŸeri
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={newCampaignForm.discountValue}
                      onChange={(e) => setNewCampaignForm(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                      className="w-full rounded-xl border border-stone-250 bg-white px-3 py-1.5 text-xs font-bold font-mono text-stone-850 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Uygulanacak Konut */}
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1">
                    GeÃ§erli OlacaÄŸÄ± Tesis
                  </label>
                  <select
                    value={newCampaignForm.targetVillaId}
                    onChange={(e) => setNewCampaignForm(prev => ({ ...prev, targetVillaId: e.target.value }))}
                    className="w-full rounded-xl border border-stone-250 bg-white px-3 py-1.5 text-xs font-bold text-stone-850 focus:outline-none"
                  >
                    <option value="all">TÃ¼m Tesislerde GeÃ§erli (Genel)</option>
                    {villas.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.region})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* BaÅŸlangÄ±Ã§ Tarihi */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1">
                      BaÅŸlangÄ±Ã§ Tarihi
                    </label>
                    <input
                      type="date"
                      required
                      value={newCampaignForm.startDate}
                      onChange={(e) => setNewCampaignForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full rounded-xl border border-stone-250 bg-white px-3 py-1.5 text-xs font-bold text-stone-850 focus:outline-none"
                    />
                  </div>

                  {/* BitiÅŸ Tarihi */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1">
                      BitiÅŸ Tarihi
                    </label>
                    <input
                      type="date"
                      required
                      value={newCampaignForm.endDate}
                      onChange={(e) => setNewCampaignForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full rounded-xl border border-stone-250 bg-white px-3 py-1.5 text-xs font-bold text-stone-850 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-2 font-sans text-xs">
                  <button
                    type="button"
                    onClick={() => setShowAddCampaignModal(false)}
                    className="flex-1 text-center py-2 rounded-xl border border-stone-250 text-stone-500 font-bold hover:bg-stone-50 transition cursor-pointer"
                  >
                    VazgeÃ§
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-center py-2 rounded-xl bg-stone-900 text-amber-400 hover:bg-amber-500 hover:text-stone-950 font-black transition cursor-pointer shadow-sm"
                  >
                    YayÄ±nla ğŸš€
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 7. YENÄ° Ä°LAN EKLE MODALI */}
      {showAddVillaModal && (
        <AddVillaModal
          onClose={() => setShowAddVillaModal(false)}
          onSave={async (newVilla) => {
            const villaWithHost = { 
               ...newVilla, 
               hostId: currentHost?.id,
               hostName: currentHost?.name.replace(" (Bungalov Sahibi)", ""),
               approvalStatus: "pending" 
            };
            const updated = [villaWithHost, ...villas];
            saveVillasState(updated);
            try {
               await fetch('/api/villas', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(villaWithHost)
               });
            } catch (err) {}
            setShowAddVillaModal(false);
          }}
        />
      )}

      {/* 8. Ä°LAN DÃœZENLEME MODALI */}
      {editingVilla && (
        <EditVillaModal
          isAdmin={currentRole === "admin"}
          villa={editingVilla}
          onClose={() => setEditingVilla(null)}
          onSave={(updatedVilla) => {
            const isHostEdit = currentRole !== "admin";
            
            let updatedVillaWithStatus = updatedVilla;
            
            if (isHostEdit && editingVilla) {
              const changes: Partial<Villa> = {};
              Object.keys(updatedVilla).forEach((k) => {
                const key = k as keyof Villa;
                if (JSON.stringify(updatedVilla[key]) !== JSON.stringify(editingVilla[key])) {
                  changes[key] = updatedVilla[key] as any;
                }
              });
              
              if (Object.keys(changes).length > 0) {
                updatedVillaWithStatus = {
                  ...editingVilla,
                  pendingChanges: changes,
                  approvalStatus: "pending_edit" as const
                };
              } else {
                updatedVillaWithStatus = editingVilla;
              }
            } else if (!isHostEdit) {
              updatedVillaWithStatus = {
                ...updatedVilla,
                approvalStatus: "approved" as const,
                pendingChanges: undefined
              };
            }

            const updated = villas.map((v) =>
              v.id === updatedVillaWithStatus.id ? updatedVillaWithStatus : v,
            );
            saveVillasState(updated);
            
            if (isHostEdit && Object.keys(updatedVillaWithStatus.pendingChanges || {}).length > 0) {
              fetch(`/api/villas/${updatedVillaWithStatus.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pendingChanges: updatedVillaWithStatus.pendingChanges, approvalStatus: 'pending_edit' })
              }).catch(() => {});
            }

            setEditingVilla(null);
          }}
        />
      )}

      {/* 9. KADEMELÄ° FÄ°YAT MODALI */}
      {tierEditingVilla && (
        <KademeliFiyatModal
          villa={tierEditingVilla}
          onClose={() => setTierEditingVilla(null)}
          onSave={(updatedVilla) => {
            const updated = villas.map((v) =>
              v.id === updatedVilla.id ? updatedVilla : v,
            );
            saveVillasState(updated);
            setTierEditingVilla(null);
          }}
        />
      )}

      {showLegalWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => {
                sessionStorage.setItem("legalWarningSeen", "true");
                setShowLegalWarning(false);
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition"
            >
              <X className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-black text-stone-900 mb-4 pr-6">
              YASAL UYARI
            </h1>
            <div className="text-sm text-stone-600 space-y-4 leading-relaxed font-medium">
              <p>
                5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Hakkında Kanun ve 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ile ilgili mevzuat gereğince; platformumuzda yayınlanan ilanlardaki bilgilerin, fiyatların, görsellerin doğruluğu ve hukuki sorumluluğu tamamen ilanı veren kullanıcıya aittir.
              </p>
              <p>
                İlan girişlerinde kimlik/yetki doğrulaması zorunlu olup; yetkisiz, yanıltıcı veya gerçeğe aykırı ilan girişlerinde yasal yaptırımlar uygulanmakta ve ilanlar derhal yayından kaldırılmaktadır.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  sessionStorage.setItem("legalWarningSeen", "true");
                  setShowLegalWarning(false);
                }}
                className="bg-[#FF385C] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#E02647] transition-colors"
              >
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// KADEMELÄ° FÄ°YAT MODALI COMPONENT
// ==========================================
interface KademeliFiyatModalProps {
  villa: Villa;
  onClose: () => void;
  onSave: (updatedVilla: Villa) => void;
}

function KademeliFiyatModal({ villa, onClose, onSave }: KademeliFiyatModalProps) {
  const [defaultPrice, setDefaultPrice] = useState(villa.pricePerNight);
  const [tiers, setTiers] = useState<TieredPrice[]>(villa.kademeliFiyatlar || []);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handleAddTier = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!startDate || !endDate || !price) {
      setError("LÃ¼tfen Ã¶zel tarih aralÄ±ÄŸÄ± ve gecelik fiyat alanlarÄ±nÄ± eksiksiz doldurunuz.");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError("GiriÅŸ tarihi, Ã§Ä±kÄ±ÅŸ tarihinden Ã¶nce olmalÄ±dÄ±r.");
      return;
    }

    if (tiers.length >= 3) {
      setError("En fazla 3 adet kademeli (Ã¶zel) fiyat tanÄ±mlayabilirsiniz.");
      return;
    }

    // Check overlaps
    const isOverlapping = tiers.some(tier => {
      return (
        (startDate >= tier.startDate && startDate <= tier.endDate) ||
        (endDate >= tier.startDate && endDate <= tier.endDate) ||
        (startDate <= tier.startDate && endDate >= tier.endDate)
      );
    });

    if (isOverlapping) {
      setError("SeÃ§tiÄŸiniz tarih aralÄ±ÄŸÄ± mevcut bir kademeli fiyat aralÄ±ÄŸÄ±yla Ã§akÄ±ÅŸÄ±yor.");
      return;
    }

    const newTier: TieredPrice = {
      id: "tier_" + Date.now(),
      startDate,
      endDate,
      price: Number(price),
    };

    setTiers([...tiers, newTier]);
    setStartDate("");
    setEndDate("");
    setPrice("");
  };

  const handleRemoveTier = (id: string) => {
    setTiers(tiers.filter(t => t.id !== id));
  };

  const handleSaveAll = () => {
    const updatedVilla: Villa = {
      ...villa,
      pricePerNight: Number(defaultPrice),
      kademeliFiyatlar: tiers,
    };
    onSave(updatedVilla);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in font-sans">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform scale-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 bg-stone-50/50">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
              <span className="text-xl">ğŸ“…</span> Kademeli Fiyat YÃ¶netimi
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">{villa.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-200/60 rounded-xl transition cursor-pointer text-stone-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Default Price Section */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-150">
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wide mb-1.5">
              VarsayÄ±lan Gecelik Fiyat
            </label>
            <div className="relative rounded-xl shadow-xs max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-stone-500 text-sm">â‚º</span>
              </div>
              <input
                type="number"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(Number(e.target.value))}
                className="block w-full rounded-xl border border-stone-300 pl-8 pr-4 py-2.5 text-sm focus:border-rose-500 focus:ring-rose-500 font-bold"
                placeholder="Ã–rn: 5000"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              Ã–zel bir tarih aralÄ±ÄŸÄ± tanÄ±mlanmayan tÃ¼m gÃ¼nler iÃ§in bu gecelik Ã¼cret geÃ§erli olacaktÄ±r.
            </p>
          </div>

          {/* Current Tiers Section */}
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 mb-2">
              Aktif Kademeli Fiyatlar ({tiers.length} / 3)
            </h3>
            {tiers.length === 0 ? (
              <div className="text-stone-400 text-xs py-3 px-4 border border-dashed border-stone-200 rounded-xl bg-stone-50/40 text-center">
                HenÃ¼z Ã¶zel kiralama fiyata sahip bir dÃ¶nem eklenmemiÅŸ. Ä°lan iÃ§in her zaman varsayÄ±lan fiyat geÃ§erlidir.
              </div>
            ) : (
              <div className="space-y-2">
                {tiers.map((tier, idx) => (
                  <div
                    key={tier.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-stone-150 bg-stone-50/80 hover:bg-stone-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-rose-50 border border-rose-100 text-[#FF385C] text-xs font-black">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-extrabold text-stone-900">
                          {new Date(tier.startDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })} -{" "}
                          {new Date(tier.endDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          TanÄ±mlÄ± Kademeli Fiyat AralÄ±ÄŸÄ±
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-[#FF385C]">
                        â‚º{tier.price.toLocaleString("tr-TR")} / gece
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTier(tier.id)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                        title="DÃ¶nemi Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Tier Form */}
          {tiers.length < 3 ? (
            <form onSubmit={handleAddTier} className="p-4 rounded-2xl border border-stone-250 bg-white space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100">
                <span className="text-xs font-black text-[#FF385C] uppercase tracking-wide">
                  â• Yeni Kademeli Fiyat / Ã–zel DÃ¶nem Ekle
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-600">GiriÅŸ Tarihi</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full rounded-xl border border-stone-300 px-3 py-2 text-xs focus:border-rose-500 focus:ring-rose-500 bg-stone-50/50 hover:bg-stone-50 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-600">Ã‡Ä±kÄ±ÅŸ Tarihi</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full rounded-xl border border-stone-300 px-3 py-2 text-xs focus:border-rose-500 focus:ring-rose-500 bg-stone-50/50 hover:bg-stone-50 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-600">Gecelik DÃ¶nem FiyatÄ± (â‚º)</label>
                  <input
                    type="number"
                    placeholder="Ã–rn: 10000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="block w-full rounded-xl border border-stone-300 px-3 py-2 text-xs focus:border-rose-500 focus:ring-rose-500 font-bold"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-amber-50 text-amber-800 text-xs border border-amber-150">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-850 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md cursor-pointer"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Tarih AralÄ±ÄŸÄ± & Fiyat Ekle</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <div className="text-xs text-amber-800 font-medium">
                Kademeli fiyat kotasÄ±na ulaÅŸtÄ±nÄ±z (Maksimum 3 adet). Yeni eklemek iÃ§in mevcut dÃ¶nemsel fiyat listesinden en az bir tanesini silmelisiniz.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-stone-100 px-6 py-4 bg-stone-50/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 px-4 py-2.5 text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            VazgeÃ§
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="rounded-xl bg-[#FF385C] hover:bg-[#E02647] text-white px-5 py-2.5 text-xs font-black transition active:scale-95 shadow-lg shadow-rose-500/10 cursor-pointer"
          >
            Kaydet ve GÃ¼ncelle ğŸ’¾
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 1. AD-HOC STATEFUL ADD LISTING DIALOG COMPONENT
// ==========================================
function AddVillaModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (villa: any) => void;
}) {
  const [isBoat, setIsBoat] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("bungalow");
  const [region, setRegion] = useState("Ä°stanbul");
  const [capacity, setCapacity] = useState(4);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [pricePerNight, setPricePerNight] = useState(5000);
  const [minNights, setMinNights] = useState(2);
  const [prePaymentRate, setPrePaymentRate] = useState(0);
  const [description, setDescription] = useState("");

  // Boat Options
  const [boatType, setBoatType] = useState("Katamaran");
  const [skipper, setSkipper] = useState("KaptanlÄ±");
  const [concept, setConcept] = useState("GÃ¼nlÃ¼k Koy Gezisi");
  const [port, setPort] = useState("KuruÃ§eÅŸme MarinasÄ±, Ä°stanbul");

  // Custom Extra Services
  const [customExtraServices, setCustomExtraServices] = useState<any[]>([]);
  const [srvName, setSrvName] = useState("");
  const [srvPrice, setSrvPrice] = useState("");
  const [srvType, setSrvType] = useState("per_person_daily");

  // Features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "wifi",
    "garden",
  ]);

  // Slogans (Max 4 selection)
  const [selectedSlogans, setSelectedSlogans] = useState<string[]>([
    "entry",
    "peaceful",
  ]);

  // Classified Images States
  const [classifiedImages, setClassifiedImages] = useState<
    Array<{
      id: string;
      url: string;
      name: string;
      category: "vitrin" | "dis" | "ic" | "hizmet";
    }>
  >([]);
  const [imgName, setImgName] = useState("");
  const [imgCategory, setImgCategory] = useState<
    "vitrin" | "dis" | "ic" | "hizmet"
  >("vitrin");
  const [imgFile, setImgFile] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImgFile(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClassifiedImg = () => {
    let finalUrl = "";
    if (imgFile) {
      finalUrl = imgFile;
    } else if (imgUrl.trim()) {
      finalUrl = imgUrl.trim();
    } else {
      const categoryPlaceholders = {
        vitrin:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
        dis: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        ic: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800",
        hizmet:
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
      };
      finalUrl = categoryPlaceholders[imgCategory];
    }

    if (!imgName.trim()) {
      alert("LÃ¼tfen resim iÃ§in bir isim yazÄ±nÄ±z (Ã–rn: Mutfak, Salon, Havuz)");
      return;
    }

    const inCategoryCount = classifiedImages.filter(
      (img) => img.category === imgCategory,
    ).length;
    if (imgCategory === "vitrin" && inCategoryCount >= 1) {
      alert("Vitrin fotosu en fazla 1 adet olabilir!");
      return;
    }
    if (imgCategory === "dis" && inCategoryCount >= 4) {
      alert("DÄ±ÅŸ gÃ¶rÃ¼nÃ¼m resimleri en fazla 4 adet olabilir!");
      return;
    }
    if (imgCategory === "ic" && inCategoryCount >= 8) {
      alert("Ä°Ã§ gÃ¶rÃ¼nÃ¼m resimleri en fazla 8 adet olabilir!");
      return;
    }
    if (imgCategory === "hizmet" && inCategoryCount >= 4) {
      alert("Ek hizmet resimleri en fazla 4 adet olabilir!");
      return;
    }

    setClassifiedImages((prev) => [
      ...prev,
      {
        id: "img-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
        url: finalUrl,
        name: imgName.trim(),
        category: imgCategory,
      },
    ]);

    setImgName("");
    setImgFile(null);
    setImgUrl("");

    const fileInput = document.getElementById(
      "villa-img-file-inputs",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleAddSrv = () => {
    if (!srvName.trim()) {
      alert("Hizmet adÄ± girmelisiniz!");
      return;
    }
    const priceNum = parseFloat(srvPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("GeÃ§erli bir fiyat girmelisiniz!");
      return;
    }
    if (customExtraServices.length >= 5) {
      alert("En fazla 5 hizmet ekleyebilirsiniz!");
      return;
    }
    setCustomExtraServices((prev) => [
      ...prev,
      {
        id: "srv_" + Date.now(),
        name: srvName.trim(),
        price: priceNum,
        type: srvType,
      },
    ]);
    setSrvName("");
    setSrvPrice("");
  };

  const handleToggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat],
    );
  };

  const handleToggleSlogan = (slog: string) => {
    setSelectedSlogans((prev) => {
      if (prev.includes(slog)) {
        return prev.filter((s) => s !== slog);
      } else {
        if (prev.length >= 4) {
          alert("En fazla 4 slogan seÃ§ebilirsiniz!");
          return prev;
        }
        return [...prev, slog];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = isBoat ? "boat" : type;
    const finalImages =
      classifiedImages.length > 0
        ? classifiedImages.map((img) => img.url)
        : [
            isBoat
              ? "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800"
              : "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800",
          ];

    const villaObj = {
      id: "villa-added-" + Date.now(),
      name: name || (isBoat ? `${boatType} Azure` : "Ã–zel Bungalov Evi"),
      title:
        title ||
        (isBoat
          ? "KaptanlÄ± MuhteÅŸem Yat Kiralama"
          : "LÃ¼ks YaÅŸam ve DoÄŸa KaÃ§amaÄŸÄ±"),
      type: finalType,
      region,
      capacity,
      bedrooms: isBoat ? 3 : bedrooms,
      bathrooms: isBoat ? 2 : bathrooms,
      pricePerNight,
      minNights,
      prePaymentRate,
      description:
        description ||
        "DoÄŸa ile iÃ§ iÃ§e, tÃ¼m detaylarÄ± Ã¶zenle dÃ¼ÅŸÃ¼nÃ¼lmÃ¼ÅŸ unutulmaz tatil seÃ§eneÄŸi.",
      images: finalImages,
      classifiedImages: classifiedImages,
      features: selectedFeatures,
      extraServices: customExtraServices,
      slogans: selectedSlogans,
      rating: 5.0,
      reviewCount: 1,
      hostName: "Siz (Ev Sahibi)",
      hostAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      badge: isBoat ? "â›µ Yat Kiralama" : "Yeni Ä°lan",
      whatsappMessage: "Merhaba! Yeni ilanÄ±nÄ±z hakkÄ±nda bilgi alabilir miyim?",
      catFeatures: [
        "view_mountain",
        "bath_hairdryer",
        "bath_soap",
        "bath_hotwater",
        "bed_essentials",
        "bed_sheets",
        "temp_ac",
        "net_wifi",
        "kit_kitchen",
        "kit_fridge",
        "out_balcony",
        "park_free_prem",
        "park_pool",
      ],
      isBoat,
      boatDetails: isBoat
        ? {
            boatType,
            skipper,
            concept,
            port,
          }
        : undefined,
    };
    onSave(villaObj);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-stone-200 shadow-2xl p-6 relative my-8 max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-stone-900 font-display">
            Ä°lan OluÅŸtur, Evin BoÅŸ KalmasÄ±n ğŸ¡
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Gerekli alanlarÄ± doldurarak ilanÄ±nÄ±zÄ± anÄ±nda yayÄ±na verin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* BOAT TOGGLE ROW */}
          <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-stone-900 text-xs block">
                âš“ Yat / Tekne Kiralama SeÃ§eneÄŸi
              </span>
              <span className="text-[11px] text-stone-500">
                EÄŸer listelediÄŸiniz mÃ¼lk bir tekne ise bu kutucuÄŸu iÅŸaretleyin.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isBoat}
                onChange={(e) => setIsBoat(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF385C]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                MÃ¼lk / Ä°lan AdÄ± <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={
                  isBoat ? "Ã–rn: Princess Katamaran" : "Ã–rn: Sapanca Green Dome"
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-stone-250 px-3 py-2 text-xs focus:outline-none focus:border-[#FF385C]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                Ä°lan BaÅŸlÄ±ÄŸÄ± / Slogan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ã–rn: Dere KenarÄ±nda MuhteÅŸem Panoramik Kabin"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-stone-250 px-3 py-2 text-xs focus:outline-none focus:border-[#FF385C]"
              />
            </div>
          </div>

          {/* DYNAMIC BOAT / HOUSING MODE DETAILS */}
          {isBoat ? (
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-150 grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-in fade-in slide-in-from-top-1">
              <div>
                <label className="block text-[10px] font-bold text-sky-800 uppercase tracking-wider mb-1">
                  Tekne Tipi
                </label>
                <select
                  value={boatType}
                  onChange={(e) => setBoatType(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="Katamaran">â›µ Katamaran</option>
                  <option value="Yelkenli">â›µ Yelkenli</option>
                  <option value="Motor Yat">ğŸš¤ Motor Yat</option>
                  <option value="Gulet">âš“ AhÅŸap Gulet</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sky-800 uppercase tracking-wider mb-1">
                  Kaptan SeÃ§eneÄŸi
                </label>
                <select
                  value={skipper}
                  onChange={(e) => setSkipper(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="KaptanlÄ±">KaptanlÄ± (Fiyata Dahil)</option>
                  <option value="KaptansÄ±z">KaptansÄ±z Kiralanabilir</option>
                  <option value="Full MÃ¼rettebatlÄ±">Full MÃ¼rettebatlÄ±</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sky-800 uppercase tracking-wider mb-1">
                  Konsept / KullanÄ±m
                </label>
                <select
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="GÃ¼nlÃ¼k Koy Gezisi">GÃ¼nlÃ¼k Koy Gezisi</option>
                  <option value="HaftalÄ±k Mavi Yolculuk">
                    HaftalÄ±k Mavi Yolculuk
                  </option>
                  <option value="Yat Konaklama">Yat Konaklama</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sky-800 uppercase tracking-wider mb-1">
                  Limandaki Yeri / Marina
                </label>
                <input
                  type="text"
                  required
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                  Konut TÃ¼rÃ¼
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-stone-250 bg-stone-50 px-3 py-2 text-xs text-stone-850 font-bold focus:outline-none"
                >
                  <option value="bungalow">ğŸ¡ Bungalov</option>
                  <option value="villa">ğŸ¡ LÃ¼ks Villa</option>
                  <option value="mansion">ğŸ° MÃ¼stakil Ev</option>
                  <option value="summer_house">ğŸ–ï¸ YazlÄ±k</option>
                  <option value="apartment">ğŸ¢ Daire</option>
                  <option value="chalet">ğŸ‡ DaÄŸ Evi</option>
                  <option value="farmhouse">ğŸ„ Ã‡iftlik Evi</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                  Hizmet BÃ¶lgesi / Åehir
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border border-stone-250 bg-stone-50 px-3 py-2 text-xs text-stone-850 font-bold focus:outline-none"
                >
                  {REGIONS.filter((r) => r !== "Hepsi").map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                Kapasite <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-250 px-3 py-1.5 text-xs font-bold font-mono"
              />
            </div>
            {!isBoat && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                    Oda <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-250 px-3 py-1.5 text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                    Banyo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-250 px-3 py-1.5 text-xs font-bold font-mono"
                  />
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                Gecelik Kira Bedeli (TL) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1000}
                required
                value={pricePerNight}
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-250 px-3 py-2 text-xs font-extrabold focus:border-[#FF385C] font-mono text-stone-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                En Az Konaklama (Gece) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={minNights}
                onChange={(e) => setMinNights(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-250 px-3 py-2 text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#FF385C] uppercase tracking-wider mb-1">
                Kesin Ã–n Ã–deme OranÄ±
              </label>
              <select
                value={prePaymentRate}
                onChange={(e) => setPrePaymentRate(Number(e.target.value))}
                className="w-full rounded-xl border border-[#FF385C]/30 bg-stone-50 px-2 py-2 text-xs font-black text-stone-850"
              >
                <option value={0}>KapÄ±da Ã¶deme (Sadece %10 kaparo)</option>
                <option value={10}>%10 Kesin Ã–n Ã–demeli</option>
                <option value={20}>%20 Kesin Ã–n Ã–demeli</option>
                <option value={30}>%30 Kesin Ã–n Ã–demeli</option>
                <option value={50}>%50 Kesin Ã–n Ã–demeli</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
              DetaylÄ± AÃ§Ä±klama <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Misafirlerinize donanÄ±m, konum Ã¶zellikleri ve diÄŸer detaylardan bahsedin..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-stone-250 px-3 py-2 text-xs text-stone-800"
            />
          </div>

          {/* AMENITIES */}
          <div>
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-2">
              Sunulan Olanaklar (Ã–zellikler)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                "heated_pool",
                "jacuzzi",
                "fireplace",
                "lake_view",
                "pet_friendly",
                "garden",
                "barbeque",
                "wifi",
              ].map((feat) => (
                <label
                  key={feat}
                  className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent p-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feat)}
                    onChange={() => handleToggleFeature(feat)}
                    className="rounded border-stone-300 text-[#FF385C] focus:ring-[#FF385C] h-3.5 w-3.5"
                  />
                  <span className="text-[11px] text-stone-705 font-medium shrink-0">
                    {FEATURE_MAP[feat]?.icon} {FEATURE_MAP[feat]?.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* SLOGANS */}
          <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-200">
            <h4 className="text-[10px] font-black text-[#FF385C] uppercase tracking-wider mb-2">
              Ã–ne Ã‡Ä±kan Slogan SeÃ§imi (Maksimum 4 Adet)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {AVAILABLE_SLOGANS.map((item) => {
                const isChecked = selectedSlogans.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className="flex items-start gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSlogan(item.id)}
                      className="rounded border-stone-300 text-[#FF385C] mt-0.5"
                    />
                    <div>
                      <span className="font-extrabold text-[#FF385C] text-[11px] block">
                        {item.icon} {item.title}
                      </span>
                      <span className="text-[10px] text-stone-500 line-clamp-1">
                        {item.desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* CUSTOM EXTRA SERVICES WITH INFORMATIONAL NOTE */}
          <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20">
            <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              âœ¨ Ã–zel Ev Sahibi Ekstra Hizmetlerinizi Ekleyin (En Fazla 5 Adet)
            </h4>

            {customExtraServices.length > 0 && (
              <div className="space-y-2 mb-3">
                {customExtraServices.map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200 text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900">
                        {srv.name}
                      </span>
                      <span className="text-[9px] text-stone-400 block font-bold uppercase">
                        {srv.type === "per_person_daily"
                          ? "KiÅŸi BaÅŸÄ± / GÃ¼nlÃ¼k"
                          : srv.type === "per_person_flat"
                            ? "KiÅŸi BaÅŸÄ± Sabit"
                            : "Sabit Ãœcret"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-600">
                        â‚º{srv.price}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCustomExtraServices((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        className="text-red-500 hover:bg-red-50 font-bold px-2 py-0.5 rounded border border-stone-200"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {customExtraServices.length < 5 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                <div>
                  <label className="block text-[8px] text-stone-400 font-bold uppercase mb-0.5">
                    Hizmet AdÄ±
                  </label>
                  <input
                    type="text"
                    placeholder="Ã–rn: Serpme KahvaltÄ±"
                    value={srvName}
                    onChange={(e) => setSrvName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[8px] text-stone-400 font-bold uppercase mb-0.5">
                    Ãœcret (â‚º)
                  </label>
                  <input
                    type="number"
                    placeholder="150"
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white font-mono"
                  />
                </div>
                <div className="flex gap-1.5">
                  <div className="flex-1">
                    <label className="block text-[8px] text-stone-400 font-bold uppercase mb-0.5">
                      Tipi
                    </label>
                    <select
                      value={srvType}
                      onChange={(e) => setSrvType(e.target.value)}
                      className="w-full text-xs px-1.5 py-1.5 border border-stone-200 rounded-lg bg-white"
                    >
                      <option value="per_person_daily">KiÅŸi / GÃ¼n</option>
                      <option value="per_person_flat">KiÅŸi / Sabit</option>
                      <option value="flat">Sabit Ãœcret</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSrv}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold p-2 text-xs rounded-lg shrink-0"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            )}
            <p className="text-[10px] text-amber-700/80 mt-3 font-semibold bg-white p-2 rounded-xl border border-amber-500/10 leading-relaxed">
              ğŸ’¡ <strong>Bilgilendirme Notu:</strong> Ekstra hizmetler
              dilediÄŸiniz gibi fiyatlandÄ±rÄ±larak misafirin toplam sepet
              faturasÄ±na opsiyonel olarak ilave edilir.
            </p>
          </div>

          {/* FOTOÄRAF EKLEME BÃ–LÃœMÃœ */}
          <div className="p-5 bg-stone-50 border border-stone-200 rounded-3xl space-y-4">
            <div>
              <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                ğŸ“· Ä°lan FotoÄŸraflarÄ± Ekleme BÃ¶lÃ¼mÃ¼
              </h4>
              <p className="text-[11px] text-stone-500 mt-1">
                Ä°lanÄ±nÄ±z iÃ§in resimleri yÃ¼kleyin ve ait olduÄŸu kategoriyi
                tanÄ±mlayarak sÄ±nÄ±rlarÄ± yÃ¶netin.
              </p>
            </div>

            {/* FOTOÄRAFLARIN KATEGORÄ°SÄ° VE BÄ°LGÄ° PANELÄ° */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-white border border-stone-150 text-center">
                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1 text-center">
                  Vitrin Fotosu
                </span>
                <span className="font-mono font-black text-stone-800 text-sm">
                  {
                    classifiedImages.filter((img) => img.category === "vitrin")
                      .length
                  }{" "}
                  / 1
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-150 text-center">
                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1 text-center font-sans">
                  DÄ±ÅŸ GÃ¶rÃ¼nÃ¼m
                </span>
                <span className="font-mono font-black text-stone-800 text-sm border-t border-stone-100 pt-1 block mt-1">
                  {
                    classifiedImages.filter((img) => img.category === "dis")
                      .length
                  }{" "}
                  / 4
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-150 text-center">
                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1 text-center font-sans">
                  Ä°Ã§ GÃ¶rÃ¼nÃ¼m
                </span>
                <span className="font-mono font-black text-stone-800 text-sm border-t border-stone-100 pt-1 block mt-1">
                  {
                    classifiedImages.filter((img) => img.category === "ic")
                      .length
                  }{" "}
                  / 8
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-150 text-center">
                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1 text-center font-sans">
                  Ek Hizmet
                </span>
                <span className="font-mono font-black text-stone-800 text-sm border-t border-stone-100 pt-1 block mt-1">
                  {
                    classifiedImages.filter((img) => img.category === "hizmet")
                      .length
                  }{" "}
                  / 4
                </span>
              </div>
            </div>

            {/* YENÄ° RESÄ°M TANIMLAYICI FORMU */}
            <div className="p-4 bg-white rounded-2xl border border-stone-250 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1">
                    Resim Ä°smi / BaÅŸlÄ±ÄŸÄ± <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ã–rn: Mutfak, BahÃ§e, Havuz"
                    value={imgName}
                    onChange={(e) => setImgName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#FF385C]"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1">
                    Kategori / BÃ¶lÃ¼m <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={imgCategory}
                    onChange={(e) => setImgCategory(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 border border-stone-200 rounded-xl font-bold bg-stone-50"
                  >
                    <option value="vitrin">
                      â­ Vitrin Fotosu (En Fazla 1 Adet)
                    </option>
                    <option value="dis">
                      ğŸŒ² DÄ±ÅŸ GÃ¶rÃ¼nÃ¼m (En Fazla 4 Adet)
                    </option>
                    <option value="ic">ğŸ›‹ï¸ Ä°Ã§ GÃ¶rÃ¼nÃ¼m (En Fazla 8 Adet)</option>
                    <option value="hizmet">
                      ğŸ³ Ek Hizmet Resimleri (En Fazla 4 Adet)
                    </option>
                  </select>
                </div>
              </div>

              {/* DOSYA SEÃ‡ / YÃœKLE VE URL */}
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1">
                  Resim YÃ¼kleme (Dosya SeÃ§in veya Link YapÄ±ÅŸtÄ±rÄ±n)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="relative border border-dashed border-stone-250 hover:border-[#FF385C]/60 rounded-xl p-2 bg-stone-50/50 flex items-center justify-center cursor-pointer">
                    <input
                      id="villa-img-file-inputs"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="text-center">
                      <span className="block text-[11px] font-bold text-stone-600">
                        {imgFile
                          ? "âœ… Dosya SeÃ§ildi"
                          : "ğŸ“‚ Bilgisayardan FotoÄŸraf SeÃ§"}
                      </span>
                      {imgFile && (
                        <span className="text-[9px] font-mono text-stone-400 truncate max-w-[200px] block mt-0.5">
                          Base64 GÃ¶rsel Verisi YÃ¼klendi
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Veya URL YapÄ±ÅŸtÄ±rÄ±n (Ã–rn: https://...)"
                      value={imgUrl}
                      onChange={(e) => {
                        setImgUrl(e.target.value);
                        if (e.target.value.trim()) {
                          setImgFile(null); // Clear file upload if they write url
                        }
                      }}
                      className="w-full text-xs px-3 py-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#FF385C]"
                    />
                  </div>
                </div>
              </div>

              {/* EKLEME BUTONU */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddClassifiedImg}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-sm cursor-pointer"
                >
                  <span>â• Listeye FotoÄŸraf Ekle</span>
                </button>
              </div>
            </div>

            {/* EKLENMÄ°Å RESÄ°MLERÄ°N Ã–NÄ°ZLEMESÄ° */}
            {classifiedImages.length > 0 ? (
              <div className="space-y-2">
                <span className="block text-[10px] font-black text-stone-400 uppercase tracking-wider">
                  Mevcut Resim KataloÄŸu ({classifiedImages.length} adet)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {classifiedImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative group rounded-2xl overflow-hidden border border-stone-200 aspect-video shadow-xs bg-stone-105"
                    >
                      <img
                        src={img.url}
                        className="w-full h-full object-cover"
                        alt=""
                        referrerPolicy="no-referrer"
                      />

                      {/* Name Superimposed / Overlayed directly on the image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-2">
                        <div className="flex justify-between items-start">
                          <span className="bg-stone-900/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                            {img.category === "vitrin"
                              ? "Vitrin"
                              : img.category === "dis"
                                ? "DÄ±ÅŸ"
                                : img.category === "ic"
                                  ? "Ä°Ã§"
                                  : "Ek Hizmet"}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setClassifiedImages((prev) =>
                                prev.filter((x) => x.id !== img.id),
                              )
                            }
                            className="h-5 w-5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-full flex items-center justify-center text-xs shadow"
                          >
                            &times;
                          </button>
                        </div>
                        <span className="text-white text-xs font-black tracking-wide truncate pr-2">
                          {img.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-center">
                <p className="text-[11px] text-stone-500 font-medium">
                  HenÃ¼z fotoÄŸraf eklemediniz. VarsayÄ±lan katalog gÃ¶rselleri
                  kullanÄ±lacaktÄ±r.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-stone-200 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-500 text-xs font-bold hover:bg-stone-50 rounded-xl cursor-pointer"
            >
              Ä°ptal Et
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#FF385C] hover:bg-[#E02647] font-black text-xs text-white rounded-xl shadow-xs cursor-pointer"
            >
              Ä°lanÄ± Onayla ve YayÄ±nlağŸš€
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. AD-HOC STATEFUL EDIT LISTING DIALOG COMPONENT
// ==========================================
function EditVillaModal({
  isAdmin,
  villa,
  onClose,
  onSave,
}: {
  isAdmin?: boolean;
  villa: any;
  onClose: () => void;
  onSave: (villa: any) => void;
}) {
  const pending = isAdmin && villa.pendingChanges ? villa.pendingChanges : {};
  const [isBoat, setIsBoat] = useState(!!(pending.isBoat ?? villa.isBoat));
  const [name, setName] = useState(pending.name ?? villa.name);
  const [title, setTitle] = useState(pending.title ?? villa.title);
  const [type, setType] = useState(pending.type ?? villa.type);
  const [region, setRegion] = useState(pending.region ?? villa.region);
  const [capacity, setCapacity] = useState(pending.capacity ?? villa.capacity);
  const [bedrooms, setBedrooms] = useState(pending.bedrooms ?? (villa.bedrooms || 2));
  const [bathrooms, setBathrooms] = useState(pending.bathrooms ?? (villa.bathrooms || 1));
  const [pricePerNight, setPricePerNight] = useState(pending.pricePerNight ?? villa.pricePerNight);
  const [minNights, setMinNights] = useState(pending.minNights ?? (villa.minNights || 2));
  const [prePaymentRate, setPrePaymentRate] = useState(
    pending.prePaymentRate ?? (villa.prePaymentRate || 0)
  );
  const [description, setDescription] = useState(pending.description ?? villa.description);

  // Boat Options
  const [boatType, setBoatType] = useState(
    pending.boatDetails?.boatType ?? (villa.boatDetails?.boatType || "Katamaran")
  );
  const [skipper, setSkipper] = useState(
    pending.boatDetails?.skipper ?? (villa.boatDetails?.skipper || "Kaptanlı")
  );
  const [concept, setConcept] = useState(
    pending.boatDetails?.concept ?? (villa.boatDetails?.concept || "Günlük Koy Gezisi")
  );
  const [port, setPort] = useState(
    pending.boatDetails?.port ?? (villa.boatDetails?.port || "Kuruçeşme Marinası, İstanbul")
  );

  // Custom Extra Services
  const [customExtraServices, setCustomExtraServices] = useState<any[]>(
    pending.extraServices ?? (villa.extraServices || [])
  );
  const [srvName, setSrvName] = useState("");
  const [srvPrice, setSrvPrice] = useState("");
  const [srvType, setSrvType] = useState("per_person_daily");

  // Features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    pending.features ?? (villa.features || [])
  );

  // Slogans
  const [selectedSlogans, setSelectedSlogans] = useState<string[]>(
    pending.slogans ?? (villa.slogans || [])
  );

  // Images
  const [imagesStr, setImagesStr] = useState<string>(
    (pending.images ?? (villa.images || [])).join('\n')
  );

  const handleAddSrv = () => {
    if (!srvName.trim()) {
      alert("Hizmet adÄ± girmelisiniz!");
      return;
    }
    const priceNum = parseFloat(srvPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("GeÃ§erli bir fiyat girmelisiniz!");
      return;
    }
    if (customExtraServices.length >= 5) {
      alert("En fazla 5 hizmet ekleyebilirsiniz!");
      return;
    }
    setCustomExtraServices((prev) => [
      ...prev,
      {
        id: "srv_" + Date.now(),
        name: srvName.trim(),
        price: priceNum,
        type: srvType,
      },
    ]);
    setSrvName("");
    setSrvPrice("");
  };

  const handleToggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat],
    );
  };

  const handleToggleSlogan = (slog: string) => {
    setSelectedSlogans((prev) => {
      if (prev.includes(slog)) {
        return prev.filter((s) => s !== slog);
      } else {
        if (prev.length >= 4) {
          alert("En fazla 4 slogan seÃ§ebilirsiniz!");
          return prev;
        }
        return [...prev, slog];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = isBoat ? "boat" : type;
    const villaObj = {
      ...villa,
      name,
      title,
      type: finalType,
      region,
      capacity,
      bedrooms: isBoat ? 3 : bedrooms,
      bathrooms: isBoat ? 2 : bathrooms,
      pricePerNight,
      minNights,
      prePaymentRate,
      description,
      features: selectedFeatures,
      extraServices: customExtraServices,
      slogans: selectedSlogans,
      images: imagesStr.split('\n').map(s => s.trim()).filter(Boolean),
      isBoat,
      boatDetails: isBoat
        ? {
            boatType,
            skipper,
            concept,
            port,
          }
        : undefined,
    };
    onSave(villaObj);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-955/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-stone-200 shadow-2xl p-6 relative my-8 max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-extrabold text-stone-900 font-display">
              Ä°lan DÃ¼zenleme Paneli ğŸ“
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {villa.name} ilanÄ±nÄ±za ait tÃ¼m verileri anlÄ±k olarak gÃ¼ncelleyin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-3 text-stone-400 hover:text-stone-850 bg-stone-50 border border-stone-200 text-xs rounded-xl font-mono"
          >
            &times; Kapat
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* BOAT TOGGLE ROW */}
          <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-stone-900 text-xs block">
                âš“ Yat / Tekne Kiralama SeÃ§eneÄŸi
              </span>
              <span className="text-[11px] text-stone-500">
                Ilan tekne ise isBoat parametresini aktif hale getirin.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isBoat}
                onChange={(e) => setIsBoat(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF385C]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                MÃ¼lk / Ä°lan AdÄ±
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-stone-250 px-3 py-2 text-xs focus:outline-none focus:border-[#FF385C]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                Ä°lan BaÅŸlÄ±ÄŸÄ±
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-stone-250 px-3 py-2 text-xs focus:outline-none focus:border-[#FF385C]"
              />
            </div>
          </div>

          {/* DYNAMIC BOAT DETAILS */}
          {isBoat ? (
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-150 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold text-sky-800 uppercase tracking-wider mb-1">
                  Tekne Tipi
                </label>
                <select
                  value={boatType}
                  onChange={(e) => setBoatType(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="Katamaran">â›µ Katamaran</option>
                  <option value="Yelkenli">â›µ Yelkenli</option>
                  <option value="Motor Yat">ğŸš¤ Motor Yat</option>
                  <option value="Gulet">âš“ AhÅŸap Gulet</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sky-800 uppercase tracking-wider mb-1">
                  Kaptan SeÃ§eneÄŸi
                </label>
                <select
                  value={skipper}
                  onChange={(e) => setSkipper(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="KaptanlÄ±">KaptanlÄ± (Fiyata Dahil)</option>
                  <option value="KaptansÄ±z">KaptansÄ±z Kiralanabilir</option>
                  <option value="Full MÃ¼rettebatlÄ±">Full MÃ¼rettebatlÄ±</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sky-800 uppercase tracking-wider mb-1">
                  Konsept / KullanÄ±m
                </label>
                <select
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="GÃ¼nlÃ¼k Koy Gezisi">GÃ¼nlÃ¼k Koy Gezisi</option>
                  <option value="HaftalÄ±k Mavi Yolculuk">
                    HaftalÄ±k Mavi Yolculuk
                  </option>
                  <option value="Yat Konaklama">Yat Konaklama</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sky-800 uppercase tracking-wider mb-1">
                  Limandaki Yeri
                </label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                  Konut TÃ¼rÃ¼
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-stone-250 bg-stone-50 px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  <option value="bungalow">ğŸ¡ Bungalov</option>
                  <option value="villa">ğŸ¡ LÃ¼ks Villa</option>
                  <option value="mansion">ğŸ° MÃ¼stakil Ev</option>
                  <option value="summer_house">ğŸ–ï¸ YazlÄ±k</option>
                  <option value="apartment">ğŸ¢ Daire</option>
                  <option value="chalet">ğŸ‡ DaÄŸ Evi</option>
                  <option value="farmhouse">ğŸ„ Ã‡iftlik Evi</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                  Konum BÃ¶lgesi
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border border-stone-250 bg-stone-50 px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  {REGIONS.filter((r) => r !== "Hepsi").map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                Kapasite
              </label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-250 px-3 py-1.5 text-xs font-bold font-mono"
              />
            </div>
            {!isBoat && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                    Oda
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-250 px-3 py-1.5 text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                    Banyo
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-250 px-3 py-1.5 text-xs font-bold font-mono"
                  />
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                Gecelik Kira Bedeli (TL)
              </label>
              <input
                type="number"
                min={1000}
                value={pricePerNight}
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-250 px-3 py-2 text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
                En Az Konaklama (Gece)
              </label>
              <input
                type="number"
                min={1}
                value={minNights}
                onChange={(e) => setMinNights(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-250 px-3 py-2 text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#FF385C] uppercase tracking-wider mb-1">
                Ã–deme KoÅŸullarÄ±
              </label>
              <select
                value={prePaymentRate}
                onChange={(e) => setPrePaymentRate(Number(e.target.value))}
                className="w-full rounded-xl border border-[#FF385C]/35 bg-white px-2 py-2 text-xs font-bold"
              >
                <option value={0}>KapÄ±da Ã¶deme (Sadece %10 kaparo)</option>
                <option value={10}>%10 Kesin Ã–n Ã–demeli</option>
                <option value={20}>%20 Kesin Ã–n Ã–demeli</option>
                <option value={30}>%30 Kesin Ã–n Ã–demeli</option>
                <option value={50}>%50 Kesin Ã–n Ã–demeli</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">
              DetaylÄ± AÃ§Ä±klama
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-stone-250 px-3 py-2 text-xs text-stone-850"
            />
          </div>

          {/* AMENITIES */}
          <div>
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-2">
              Sunulan Olanaklar (Ã–zellikler)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                "heated_pool",
                "jacuzzi",
                "fireplace",
                "lake_view",
                "pet_friendly",
                "garden",
                "barbeque",
                "wifi",
              ].map((feat) => (
                <label
                  key={feat}
                  className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent p-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feat)}
                    onChange={() => handleToggleFeature(feat)}
                    className="rounded border-stone-300 text-[#FF385C] focus:ring-[#FF385C] h-3.5 w-3.5"
                  />
                  <span className="text-[11px] text-stone-705 font-medium shrink-0">
                    {FEATURE_MAP[feat]?.icon} {FEATURE_MAP[feat]?.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* SLOGANS */}
          <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-250">
            <h4 className="text-[10px] font-black text-[#FF385C] uppercase tracking-wider mb-2">
              Ã–ne Ã‡Ä±kan Slogan SeÃ§imi (Maksimum 4 Adet)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {AVAILABLE_SLOGANS.map((item) => {
                const isChecked = selectedSlogans.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className="flex items-start gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSlogan(item.id)}
                      className="rounded border-stone-300 text-[#FF385C] mt-0.5"
                    />
                    <div>
                      <span className="font-extrabold text-[#FF385C] text-[11px] block">
                        {item.icon} {item.title}
                      </span>
                      <span className="text-[10px] text-stone-500 line-clamp-1">
                        {item.desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* CUSTOM SERVICES */}
          <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20">
            <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-2">
              Ã–zel Ev Sahibi Ekstra Hizmetlerinizi Ekleyin (En Fazla 5 Adet)
            </h4>

            {customExtraServices.length > 0 && (
              <div className="space-y-2 mb-3">
                {customExtraServices.map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200 text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-850">
                        {srv.name}
                      </span>
                      <span className="text-[9px] text-stone-400 block font-bold uppercase">
                        {srv.type === "per_person_daily"
                          ? "KiÅŸi BaÅŸÄ± / GÃ¼nlÃ¼k"
                          : srv.type === "per_person_flat"
                            ? "KiÅŸi BaÅŸÄ± Sabit"
                            : "Sabit Ãœcret"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-600">
                        â‚º{srv.price}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCustomExtraServices((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        className="text-red-500 hover:bg-rose-50 px-2 py-0.5 rounded border border-stone-150"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {customExtraServices.length < 5 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                <div>
                  <label className="block text-[8px] text-stone-450 uppercase font-bold mb-0.5">
                    Hizmet AdÄ±
                  </label>
                  <input
                    type="text"
                    placeholder="Ã–rn: AkÅŸam YemeÄŸi"
                    value={srvName}
                    onChange={(e) => setSrvName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[8px] text-stone-440 uppercase font-bold mb-0.5">
                    Ãœcret (â‚º)
                  </label>
                  <input
                    type="number"
                    placeholder="450"
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white font-mono"
                  />
                </div>
                <div className="flex gap-1.5">
                  <div className="flex-1">
                    <label className="block text-[8px] text-stone-400 uppercase font-bold mb-0.5">
                      Tipi
                    </label>
                    <select
                      value={srvType}
                      onChange={(e) => setSrvType(e.target.value)}
                      className="w-full text-xs px-1.5 py-1.5 border border-stone-200 rounded-lg bg-white"
                    >
                      <option value="per_person_daily">KiÅŸi / GÃ¼n</option>
                      <option value="per_person_flat">KiÅŸi / Sabit</option>
                      <option value="flat">Sabit Ãœcret</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSrv}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold p-2 text-xs rounded-lg shrink-0"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            )}
            <p className="text-[10px] text-amber-700/80 mt-3 font-semibold bg-white p-2 rounded-xl border border-amber-500/10 leading-relaxed">
              ğŸ’¡ <strong>Bilgilendirme Notu:</strong> Ekstra hizmetler
              dilediÄŸiniz gibi fiyatlandÄ±rÄ±larak misafirin toplam sepet
              faturasÄ±na opsiyonel olarak ilave edilir.
            </p>
          </div>

          {/* RESÄ°M BÃ–LÃœMÃœ / UYARI */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
            <h4 className="text-xs font-black text-stone-700 uppercase tracking-wider mb-2">
              ğŸ“· Resim (Her satÄ±ra bir resim URL'si giriniz)
            </h4>
            <textarea
              rows={4}
              value={imagesStr}
              onChange={(e) => setImagesStr(e.target.value)}
              placeholder="https://resim-url-1.jpg&#10;https://resim-url-2.jpg"
              className="w-full rounded-xl border border-stone-250 px-3 py-2 text-xs text-stone-850 font-mono"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-stone-200 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-500 text-xs font-bold hover:bg-stone-50 rounded-xl cursor-pointer"
            >
              Kapat
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#FF385C] hover:bg-[#E02647] font-black text-xs text-white rounded-xl shadow-xs cursor-pointer"
            >
              DeÄŸiÅŸiklikleri Kaydet ğŸ’¾
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



