import React, { useState } from 'react';
import { Compass, Phone, MessageCircle, CalendarDays, Heart, User, Plus, Grid, Info, ChevronDown, LogOut, Shield, Menu, X } from 'lucide-react';
import { AGENCY_DETAILS, REGIONS, REGIONS_MAP, VILLA_TYPES_MAP } from '../data';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser: any;
  currentHost: any;
  currentAdmin: any;
  onOpenLogin: (role: 'guest' | 'host' | 'admin') => void;
  onLogout: (role: 'guest' | 'host' | 'admin') => void;
  bookingCount: number;
  favoriteCount: number;
  onShowBoats: () => void;
  onShowTours: () => void;
  onShowContact: () => void;
  onShowCities: () => void;
  onSelectRegion?: (region: string) => void;
  onSelectType?: (type: string) => void;
}

export default function Navbar({
  currentPath,
  onNavigate,
  currentUser,
  currentHost,
  currentAdmin,
  onOpenLogin,
  onLogout,
  bookingCount,
  favoriteCount,
  onShowBoats,
  onShowTours,
  onShowContact,
  onShowCities,
  onSelectRegion,
  onSelectType
}: NavbarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [citiesDropdownOpen, setCitiesDropdownOpen] = useState(false);
  const [typesDropdownOpen, setTypesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [logoTitle, setLogoTitle] = useState(() => localStorage.getItem("villabungalov_logo_title") || "VillaBungalovTatil");
  const [logoSubtitle, setLogoSubtitle] = useState(() => localStorage.getItem("villabungalov_logo_subtitle") || "Harika Evler Muhteşem Tatiller");

  React.useEffect(() => {
    const handleLogoUpdate = () => {
      setLogoTitle(localStorage.getItem("villabungalov_logo_title") || "VillaBungalovTatil");
      setLogoSubtitle(localStorage.getItem("villabungalov_logo_subtitle") || "Harika Evler Muhteşem Tatiller");
    };
    window.addEventListener("villabungalov_logo_changed", handleLogoUpdate);
    return () => window.removeEventListener("villabungalov_logo_changed", handleLogoUpdate);
  }, []);

  // If we are currently viewing a dashboard panel (custom pathway), do not render this header.
  if (['/kullanici', '/evsahibi', '/admin'].includes(currentPath)) {
    return null;
  }

  const handleKonutEkleClick = () => {
    if (currentHost) {
      onNavigate('/evsahibi');
    } else {
      onOpenLogin('host');
    }
  };

  const handleRezervasyonlarimClick = () => {
    if (currentUser) {
      onNavigate('/kullanici');
    } else {
      onOpenLogin('guest');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/95 backdrop-blur-md shadow-xs" id="app-header">
      <div className="mx-auto flex flex-col lg:flex-row lg:h-20 max-w-7xl items-center justify-between px-2 sm:px-6 lg:px-8 py-3 lg:py-0 gap-3 lg:gap-0">
        
        {/* Brand Logo in signature Airbnb pink-rose */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('/')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF385C] text-white shadow-md shadow-rose-500/10">
            <span className="text-xl">🌴</span>
          </div>
          <div>
            <span className="block font-sans text-lg font-black tracking-tight text-stone-900 leading-none">
              {logoTitle.includes("Bungalov") ? (
                <>
                  {logoTitle.split("Bungalov")[0]}
                  <span className="text-emerald-500">Bungalov</span>
                  {logoTitle.split("Bungalov")[1]}
                </>
              ) : logoTitle}
            </span>
            <span className="block text-[9px] font-bold tracking-wider text-rose-500 uppercase mt-0.5">
              {logoSubtitle}
            </span>
          </div>
        </div>

        {/* Center menu: Şehirler, Konutlar, Kiralık Tekne Ara, Turlar */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-stone-600">
          {/* Şehirler Dropdown Container */}
          <div className="relative">
            <button
              onClick={() => {
                setCitiesDropdownOpen(!citiesDropdownOpen);
                setTypesDropdownOpen(false);
              }}
              className="flex items-center gap-1 hover:text-[#FF385C] py-2 transition-all cursor-pointer"
            >
              <Grid className="h-3.5 w-3.5" />
              <span>Şehirler</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {citiesDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setCitiesDropdownOpen(false)} 
                />
                <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-stone-200 bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-2 gap-1.5 normal-case">
                  {REGIONS.map((reg) => (
                    <button
                      key={reg}
                      onClick={() => {
                        if (onSelectRegion) onSelectRegion(reg);
                        setCitiesDropdownOpen(false);
                        onNavigate('/');
                        setTimeout(() => {
                          const element = document.getElementById('villas-list-section');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-stone-50 transition text-stone-700 font-bold text-xs cursor-pointer"
                    >
                      <span>{reg === "Hepsi" ? "🌍" : REGIONS_MAP[reg]?.icon || "📍"}</span>
                      <span className="truncate">{reg === "Hepsi" ? "Tüm Şehirler" : reg}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Konutlar Dropdown Container */}
          <div className="relative">
            <button
              onClick={() => {
                setTypesDropdownOpen(!typesDropdownOpen);
                setCitiesDropdownOpen(false);
              }}
              className="flex items-center gap-1 hover:text-[#FF385C] py-2 transition-all cursor-pointer"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Konutlar</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {typesDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setTypesDropdownOpen(false)} 
                />
                <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-stone-200 bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-2 gap-1.5 normal-case">
                  {Object.entries(VILLA_TYPES_MAP).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => {
                        if (onSelectType) onSelectType(key);
                        setTypesDropdownOpen(false);
                        onNavigate('/');
                        setTimeout(() => {
                          const element = document.getElementById('villas-list-section');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-stone-50 transition text-stone-700 font-bold text-xs cursor-pointer"
                    >
                      <span className="text-sm shrink-0">{val.icon}</span>
                      <span className="truncate">{val.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={onShowBoats}
            className="flex items-center gap-1 hover:text-amber-500 text-amber-600 font-extrabold py-1.5 px-3 rounded-full bg-amber-50 border border-amber-100 transition-all cursor-pointer shadow-xs"
          >
            <span>⛵ Kiralık Tekne Ara</span>
          </button>

          <button
            onClick={onShowTours}
            className="flex items-center gap-1 hover:text-emerald-500 text-emerald-700 font-extrabold py-1.5 px-3 rounded-full bg-emerald-50 border border-emerald-100 transition-all cursor-pointer shadow-xs"
          >
            <span>🍀 Turlar</span>
          </button>
        </nav>

        {/* Right action items */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
          
          {/* Konut Ekle (Red Button) */}
          <button
            onClick={handleKonutEkleClick}
            className="relative flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#FF385C] hover:bg-rose-600 text-white font-extrabold px-3 sm:px-3.5 py-2 text-xs shadow-md shadow-rose-500/10 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            id="nav-host-btn"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span className="hidden md:inline">Konut Ekle</span>
          </button>

          {/* Rezervasyonlarım (Black Button) */}
          <button
            onClick={handleRezervasyonlarimClick}
            className="relative flex h-9 items-center justify-center gap-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold px-3 sm:px-3.5 py-2 text-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-md"
            id="nav-reservations-btn"
          >
            <CalendarDays className="h-4 w-4" />
            <span className="hidden md:inline">Rezervasyonlarım</span>
            {bookingCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF385C] text-[9px] font-bold text-white shrink-0">
                {bookingCount}
              </span>
            )}
          </button>

          {/* Favorites Ticker */}
          <button
            onClick={() => {
              onNavigate('/');
              setTimeout(() => {
                const element = document.getElementById('villas-list-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 hover:text-[#FF385C] hover:bg-stone-50 transition-all cursor-pointer"
            title="Favorilerim"
          >
            <Heart className={`h-4 w-4 ${favoriteCount > 0 ? 'fill-[#FF385C] text-[#FF385C]' : ''}`} />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF385C] text-[8px] font-black text-white ring-2 ring-white">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* İletişim İkonu */}
          <button
            onClick={onShowContact}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
            title="İletişim Hattı"
          >
            <Phone className="h-4 w-4" />
          </button>

          {/* Profil İkonu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1 rounded-full border border-stone-200 bg-white p-1.5 hover:shadow-md transition-all cursor-pointer text-stone-600 hover:text-[#FF385C]"
              title="Profil Menüsü"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-stone-600">
                <User className="h-3.5 w-3.5" />
              </div>
              <ChevronDown className="h-3 w-3 mr-0.5" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                
                {/* Active Session Statuses */}
                {(currentUser || currentHost || currentAdmin) ? (
                  <div className="px-2.5 py-2 border-b border-stone-100 mb-1">
                    <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Aktif Oturumlar</span>
                    {currentUser && (
                      <span className="block text-xs font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                        Misafir: {currentUser.name}
                      </span>
                    )}
                    {currentHost && (
                      <span className="block text-xs font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                        Ev Sahibi: {currentHost.name}
                      </span>
                    )}
                    {currentAdmin && (
                      <span className="block text-xs font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                        Yönetici: {currentAdmin.name}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="px-2.5 py-1.5">
                    <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wide">Hesap Erişimi</span>
                  </div>
                )}

                <div className="space-y-0.5">
                  {/* Guest Session Options */}
                  {currentUser ? (
                    <button
                      onClick={() => { setProfileDropdownOpen(false); onNavigate('/kullanici'); }}
                      className="w-full text-left rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-[#FF385C]/5 hover:text-[#FF385C] font-semibold transition-colors flex items-center gap-2"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Kullanıcı Paneli</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { setProfileDropdownOpen(false); onOpenLogin('guest'); }}
                      className="w-full text-left rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-2"
                    >
                      <User className="h-3.5 w-3.5 text-[#FF385C]" />
                      <span>Kullanıcı Girişi</span>
                    </button>
                  )}

                  {/* Host Session Options */}
                  {currentHost ? (
                    <button
                      onClick={() => { setProfileDropdownOpen(false); onNavigate('/evsahibi'); }}
                      className="w-full text-left rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-amber-500/5 hover:text-amber-600 font-semibold transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Ev Sahibi Paneli</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { setProfileDropdownOpen(false); onOpenLogin('host'); }}
                      className="w-full text-left rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-3.5 w-3.5 text-amber-500" />
                      <span>Ev Sahibi Girişi</span>
                    </button>
                  )}

                  {/* Admin Session Options */}
                  {currentAdmin ? (
                    <button
                      onClick={() => { setProfileDropdownOpen(false); onNavigate('/admin'); }}
                      className="w-full text-left rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-blue-500/5 hover:text-blue-600 font-semibold transition-colors flex items-center gap-2"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>Yönetici Paneli</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { setProfileDropdownOpen(false); onOpenLogin('admin'); }}
                      className="w-full text-left rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-2 border-t border-stone-100 pt-1.5 mt-1"
                    >
                      <Shield className="h-3.5 w-3.5 text-blue-600" />
                      <span>Admin Girişi</span>
                    </button>
                  )}

                  {/* Clear All active sessions */}
                  {(currentUser || currentHost || currentAdmin) && (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (confirm('Güvenli çıkış yapmak istediğinize emin misiniz?')) {
                          if (currentUser) onLogout('guest');
                          if (currentHost) onLogout('host');
                          if (currentAdmin) onLogout('admin');
                        }
                      }}
                      className="w-full text-left rounded-xl px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-stone-100 mt-1"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Oturumları Kapat</span>
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Full Screen Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-stone-200 shadow-xl z-50 p-4 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            
            {/* Şehirler Section */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Bölgeler</span>
              <div className="grid grid-cols-2 gap-2">
                {REGIONS.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => {
                      if (onSelectRegion) onSelectRegion(reg);
                      setMobileMenuOpen(false);
                      onNavigate('/');
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl border border-stone-100 bg-stone-50 text-left hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition text-stone-700 font-bold text-xs"
                  >
                    <span>{reg === "Hepsi" ? "🌍" : REGIONS_MAP[reg]?.icon || "📍"}</span>
                    <span className="truncate">{reg === "Hepsi" ? "Tüm Şehirler" : reg}</span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-stone-100" />

            {/* Konutlar Section */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Konut Türleri</span>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(VILLA_TYPES_MAP).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (onSelectType) onSelectType(key);
                      setMobileMenuOpen(false);
                      onNavigate('/');
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl border border-stone-100 bg-stone-50 text-left hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition text-stone-700 font-bold text-xs"
                  >
                    <span>{val.icon}</span>
                    <span className="truncate">{val.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-stone-100" />

            {/* Ekstra Menüler */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { onShowBoats(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center w-full gap-2 p-3 rounded-xl border border-amber-100 bg-amber-50 text-amber-700 font-extrabold text-sm hover:bg-amber-100 transition"
              >
                ⛵ Kiralık Tekne Ara
              </button>
              <button
                onClick={() => { onShowTours(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center w-full gap-2 p-3 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 font-extrabold text-sm hover:bg-emerald-100 transition"
              >
                🍀 Günübirlik Turlar
              </button>
            </div>
            
          </div>
        </div>
      )}

    </header>
  );
}
