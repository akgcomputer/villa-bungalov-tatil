import React, { useState } from 'react';
import { 
  User, Calendar, Heart, ShieldAlert, Users, Trash2, 
  Clock, Plus, Mail, Phone, ShieldCheck, RefreshCw, LogOut, CheckCircle, AlertCircle, HelpCircle
} from 'lucide-react';
import { getVillaPricePerNightForDisplay } from '../data';

interface UserDashboardProps {
  currentUser: {
    name: string;
    tcNo: string;
    phone: string;
    email: string;
  };
  onUpdateProfile: (profile: { name: string; tcNo: string; phone: string; email: string }) => void;
  companions: { id: string; name: string; tcNo: string }[];
  onAddCompanion: (name: string, tcNo: string) => void;
  onDeleteCompanion: (id: string) => void;
  bookings: any[];
  onCancelBooking: (bookingId: string, reason?: string) => void;
  onUpdateBooking?: (bookingId: string, data: any) => void;
  favorites: string[];
  villas: any[];
  onSelectVilla: (villa: any) => void;
  sessionTimeout: number;
  onExtendSession: () => void;
  onLogout: () => void;
}

export default function UserDashboard({
  currentUser,
  onUpdateProfile,
  companions,
  onAddCompanion,
  onDeleteCompanion,
  bookings,
  onCancelBooking,
  onUpdateBooking,
  favorites,
  villas,
  onSelectVilla,
  sessionTimeout,
  onExtendSession,
  onLogout
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'companions' | 'favorites' | 'profile'>('bookings');
  
  // Profile Form Edit state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileTc, setProfileTc] = useState(currentUser.tcNo);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileEmail, setProfileEmail] = useState(currentUser.email || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // New Companion Form State
  const [compName, setCompName] = useState('');
  const [compTc, setCompTc] = useState('');
  const [compError, setCompError] = useState('');
  const [compSuccess, setCompSuccess] = useState('');

  // Payment & Cancel Popup states
  const [paymentPopup, setPaymentPopup] = useState<'cc' | 'iban' | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [cancelPopupOpen, setCancelPopupOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Handle companion addition
  const handleCompanionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompError('');
    setCompSuccess('');

    if (!compName.trim()) {
      setCompError('Lütfen ad soyad giriniz.');
      return;
    }
    if (compTc.trim().length !== 11 || !/^\d+$/.test(compTc)) {
      setCompError('T.C. Kimlik Numarası 11 haneli sayısal bir değer olmalıdır.');
      return;
    }

    onAddCompanion(compName.trim(), compTc.trim());
    setCompName('');
    setCompTc('');
    setCompSuccess('Refakatçi kaydı listenize başarıyla eklenmiştir!');
    setTimeout(() => setCompSuccess(''), 3000);
  };

  // Handle profile update
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);

    if (!profileName.trim()) {
      alert('İsim Alanı zorunludur!');
      return;
    }
    if (profileTc.trim().length !== 11) {
      alert('Geçerli bir T.C. Kimlik Numarası giriniz (11 Basamaklı).');
      return;
    }

    onUpdateProfile({
      name: profileName.trim(),
      tcNo: profileTc.trim(),
      phone: profilePhone.trim(),
      email: profileEmail.trim()
    });

    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  // Filter bookings belonging to this logged-in guest user (by name / phone matches)
  const myBookings = bookings.filter(b => 
    (b.phone === currentUser.phone || b.guestPhone === currentUser.phone) || 
    ((b.name || b.guestName || '').toLowerCase() === currentUser.name.toLowerCase())
  );

  // Filter bookmarked villas
  const myFavVillas = villas.filter(v => favorites.includes(v.id));

  // Format MM:SS for session countdown
  const minutes = Math.floor(sessionTimeout / 60);
  const seconds = sessionTimeout % 60;
  const formattedCountdown = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="bg-stone-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8 font-sans text-stone-900" id="user-dashboard-root">
      
      {/* Top dashboard control panel header */}
      <div className="max-w-7xl mx-auto mb-8 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF385C] text-white shadow-lg shadow-rose-500/10">
            <User className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-[10px] font-black text-[#FF385C] uppercase tracking-widest leading-none mb-1">MİSAFİR Yönetim Paneli</span>
            <h1 className="text-xl font-extrabold tracking-tight text-stone-950 leading-none">Hoş Geldiniz, {currentUser.name}</h1>
          </div>
        </div>

        {/* Dynamic Safe Session Watcher & Logout action */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          
          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-100 py-2 px-3.5 text-xs text-amber-800">
            <Clock className="h-4 w-4 animate-spin shrink-0 text-amber-600" />
            <span className="font-semibold">Güvenli Oturum: </span>
            <span className="font-mono font-bold text-amber-700 bg-amber-100/75 py-0.5 px-1.5 rounded-lg">{formattedCountdown}</span>
            <button 
              onClick={onExtendSession}
              className="ml-2 hover:text-[#FF385C] font-black underline uppercase tracking-wider text-[9px] cursor-pointer flex items-center gap-0.5"
              title="Oturum süresini sıfırla ve uzat"
            >
              <RefreshCw className="h-3 w-3 inline" />
              <span>Süreyi Uzat</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm('Sistemden çıkış yapmak istediğinize emin misiniz?')) {
                onLogout();
              }
            }}
            className="flex items-center gap-1.5 rounded-2xl bg-stone-900 hover:bg-red-650 text-white font-extrabold px-4 py-2 text-xs transition shadow-md hover:shadow active:scale-95 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Güvenli Çıkış</span>
          </button>
          
          <a
            href="/"
            className="flex items-center gap-1.5 rounded-2xl bg-[#FF385C] hover:bg-rose-600 text-white font-extrabold px-4 py-2 text-xs transition shadow-md hover:shadow active:scale-95 cursor-pointer"
          >
            Siteyi Aç
          </a>
        </div>

      </div>

      {/* Main Grid: left tabs, right contents */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Hand Navigation Grid Panel */}
        <div className="lg:col-span-1 space-y-2">
          
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl text-left text-xs font-extrabold uppercase tracking-wide transition-all border ${
              activeTab === 'bookings'
                ? 'bg-[#FF385C] border-[#FF385C] text-white shadow-md shadow-rose-500/10'
                : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4" />
              <span>Rezervasyonlarım</span>
            </div>
            {myBookings.length > 0 && (
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono leading-none ${activeTab === 'bookings' ? 'bg-white text-stone-900 font-black' : 'bg-rose-50 text-[#FF385C]'}`}>
                {myBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('companions')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl text-left text-xs font-extrabold uppercase tracking-wide transition-all border ${
              activeTab === 'companions'
                ? 'bg-[#FF385C] border-[#FF385C] text-white shadow-md shadow-rose-500/10'
                : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4" />
              <span>Yakınlarım</span>
            </div>
            {companions.length > 0 && (
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono leading-none ${activeTab === 'companions' ? 'bg-white text-stone-900 font-black' : 'bg-stone-100 text-stone-600'}`}>
                {companions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl text-left text-xs font-extrabold uppercase tracking-wide transition-all border ${
              activeTab === 'favorites'
                ? 'bg-[#FF385C] border-[#FF385C] text-white shadow-md shadow-rose-500/10'
                : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="h-4 w-4" />
              <span>Favori Tatil Evlerim</span>
            </div>
            {myFavVillas.length > 0 && (
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono leading-none ${activeTab === 'favorites' ? 'bg-white text-stone-900 font-black' : 'bg-stone-100 text-[#FF385C]'}`}>
                {myFavVillas.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 p-4 rounded-2xl text-left text-xs font-extrabold uppercase tracking-wide transition-all border ${
              activeTab === 'profile'
                ? 'bg-[#FF385C] border-[#FF385C] text-white shadow-md shadow-rose-500/10'
                : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-600'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Kişisel Bilgiler & Ayarlar</span>
          </button>

          {/* Prompt helpful guidelines box */}
          <div className="hidden lg:block bg-stone-100/60 rounded-3xl p-5 border border-stone-200 space-y-3.5 mt-6">
            <h4 className="text-xs font-extrabold text-stone-700 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>GÜVENİLİR ACENTE</span>
            </h4>
            <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
              Villa Bungalov Tatil, TÜRSAB acente standartlarında doğrudan mülk sahipleriyle doğrulanmış işlemler sağlar.
            </p>
            <div className="text-[10px] text-stone-400 font-semibold italic border-t border-stone-200/60 pt-2.5">
              <span>%10 Kaparo ile ön rezervasyon güvencesi.</span>
            </div>
          </div>

        </div>

        {/* Right Hand Information Contents Output */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-8 min-h-[480px]">
            
            {/* 1. RESERVATIONS TAB */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-stone-900 font-display">Rezervasyon Talepleriniz</h2>
                  <p className="text-xs text-stone-500 mt-1">Ön rezervasyonlarınızın güncel rezervasyon onay durumunu ve detaylarını buradan takip edin.</p>
                  <div className="mt-4 bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-xs leading-relaxed font-medium">
                    WhatsApp Hattımızla talebinizi ayrıca iletmeniz için otomatik yönlendirildiniz. Onayın ardında buradan takip edebileceksiniz, hizmet veren (ev yada tekne sahibi) ile iletişime geçebileceksiniz.
                  </div>
                </div>

                {myBookings.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-stone-200 rounded-3xl bg-stone-50">
                    <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                    <h3 className="text-sm font-extrabold text-stone-850">Henüz Bir Talebiniz Bulunmuyor</h3>
                    <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto leading-relaxed">
                      Eşsiz Sapanca Bungalov ve kiralık villalarını keşfederek hayalinizdeki tatile kapora güvencesiyle ilk adımı atın!
                    </p>
                    <button
                      onClick={() => { window.location.href = '/'; }}
                      className="mt-6 rounded-full bg-[#FF385C] hover:bg-rose-600 text-white font-extrabold px-6 py-2.5 text-xs transition shadow shadow-rose-500/10 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Bungalovları Keşfet</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myBookings.map((booking) => {
                      // Match villa logo or title
                      const bVilla = villas.find(v => v.name === booking.villaName) || { images: [''], title: 'Özel Sapanca Evi' };
                      return (
                        <div key={booking.id} className="border border-stone-150 rounded-2xl p-4 md:p-5 hover:border-stone-300 transition-all bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          <div className="flex items-start md:items-center gap-4">
                            {bVilla.images[0] && (
                              <img 
                                src={bVilla.images[0]} 
                                alt="" 
                                className="h-16 w-16 md:h-20 md:w-20 rounded-xl object-cover border border-stone-200 shrink-0 shadow-xs" 
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-extrabold text-stone-900 leading-tight">{booking.villaName}</h3>
                                {booking.status === 'pending' && (
                                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">ONAY BEKLİYOR</span>
                                )}
                                {booking.status === 'confirmed' && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">ONAYLANDI</span>
                                )}
                                {booking.status === 'cancelled' && (
                                  <div className="flex items-center gap-1 group relative">
                                    <span className="bg-stone-200 text-stone-600 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">KAYIT İPTAL</span>
                                    {booking.cancelReason && (
                                      <>
                                        <HelpCircle className="h-4 w-4 text-stone-400 cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-stone-800 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-normal">
                                          <span className="block font-bold mb-0.5 text-stone-300">İptal Gerekçesi:</span>
                                          {booking.cancelReason}
                                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800"></div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-500 font-medium mt-1 leading-normal">
                                📅 Giriş: <span className="font-semibold text-stone-850 font-mono">{booking.checkIn}</span> | Çıkış: <span className="font-semibold text-stone-850 font-mono">{booking.checkOut}</span>
                              </p>
                              <p className="text-[11px] text-stone-500 font-medium leading-normal">
                                👥 {booking.guestsCount} Kişi konaklama
                              </p>
                              <p className="text-[11px] font-medium text-stone-400 mt-1">
                                TALEP NO: <span className="font-mono text-stone-500 font-bold">#{booking.id.toUpperCase().slice(0, 6)}</span>
                              </p>
                              <div className="mt-2">
                                {booking.paymentStatus === 'paid' ? (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">Ödeme Yapıldı</span>
                                ) : booking.paymentStatus === 'iban_notified' ? (
                                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">IBAN Bildirimi Yapıldı</span>
                                ) : (
                                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-md">Ödeme Yapılmadı</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="border-t md:border-t-0 md:border-l border-stone-200 pt-3 md:pt-0 md:pl-6 text-left md:text-right flex flex-col justify-between items-stretch gap-3 shrink-0 min-w-[220px]">
                            {/* Detailed Price Breakdown */}
                            <div className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm text-xs font-medium text-stone-600 w-full text-left">
                              {/* If base price exists, show it */}
                              {(booking as any).basePrice && (
                                <div className="flex justify-between mb-1.5 text-stone-500">
                                  <span>Konaklama Bedeli:</span>
                                  <span>₺{((booking as any).basePrice).toLocaleString('tr-TR')}</span>
                                </div>
                              )}
                              
                              {/* If discount applied, show it */}
                              {(booking as any).discountAmount > 0 && (
                                <div className="flex justify-between mb-1.5 text-emerald-600 font-semibold">
                                  <span>İndirim Tutarı:</span>
                                  <span>-₺{((booking as any).discountAmount).toLocaleString('tr-TR')}</span>
                                </div>
                              )}
                              
                              {/* Service Cost */}
                              <div className="flex flex-col gap-1 mb-2 text-[10px] text-stone-400 border-b border-stone-100 pb-2">
                                {(booking as any).selectedServicesList?.map((s: any, idx: number) => (
                                  <div key={idx} className="flex justify-between">
                                    <span>Ek Hizmet: {s.name} (x{s.qty})</span>
                                    <span className="text-stone-700 font-semibold">+₺{s.cost.toLocaleString('tr-TR')}</span>
                                  </div>
                                ))}
                                {(!(booking as any).selectedServicesList || (booking as any).selectedServicesList.length === 0) && (
                                  <div className="flex justify-between">
                                    <span>Ek Hizmet:</span>
                                    <span>Yok</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between mb-1.5">
                                <span>Toplam Tutar:</span>
                                <span className="font-mono text-stone-900 font-bold">₺{booking.totalPrice.toLocaleString('tr-TR')}</span>
                              </div>
                              
                              <div className="flex justify-between items-center text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100 font-bold mb-1 mt-2">
                                <span>Ön Ödeme (Kaparo vb.):</span>
                                <span className="font-mono text-[13px]">₺{((booking as any).prepaymentAmount || booking.totalPrice * 0.1).toLocaleString('tr-TR')}</span>
                              </div>
                              <div className="flex justify-between items-center text-stone-500 bg-stone-50 p-2 rounded-lg font-semibold text-[10px]">
                                <span>Kapıda Kalan:</span>
                                <span className="font-mono">₺{(booking.totalPrice - ((booking as any).prepaymentAmount || booking.totalPrice * 0.1)).toLocaleString('tr-TR')}</span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5 mt-2">
                              {(booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'host_confirmed') && booking.paymentStatus !== 'paid' && booking.paymentStatus !== 'iban_notified' && (
                                <>
                                  <button
                                    onClick={() => { setSelectedBookingId(booking.id); setPaymentPopup('cc'); }}
                                    className="rounded-lg bg-[#FF385C] hover:bg-rose-600 text-white font-bold px-3 py-1.5 text-[10px] tracking-wide transition cursor-pointer"
                                  >
                                    Kredi Kartı ile Öde
                                  </button>
                                  <button
                                    onClick={() => { setSelectedBookingId(booking.id); setPaymentPopup('iban'); }}
                                    className="rounded-lg bg-stone-800 hover:bg-stone-900 text-white font-bold px-3 py-1.5 text-[10px] tracking-wide transition cursor-pointer"
                                  >
                                    İban EFT/Havale ile öde
                                  </button>
                                </>
                              )}

                              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <button
                                  onClick={() => {
                                    setSelectedBookingId(booking.id);
                                    setCancelReason('');
                                    setCancelPopupOpen(true);
                                  }}
                                  className="rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-500 font-bold px-3 py-1.5 text-[10px] tracking-wide transition uppercase cursor-pointer"
                                >
                                  {booking.status === 'confirmed' ? 'İptal talebinde bulun' : 'İPTAL ET'}
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. COMPANIONS TAB */}
            {activeTab === 'companions' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-black text-stone-900 font-display">Tesislerde Benimle Birlikte Kalacak Yakınlarım</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Misafir bildirim bildirim yasası gereğince, tesiste sizinle beraber kalacak misafirlerin Ad Soyad ve T.C. bilgilerini önceden ekleyebilirsiniz.
                  </p>
                </div>

                {/* Companion Adding form */}
                <form onSubmit={handleCompanionSubmit} className="bg-stone-50 p-5 rounded-2xl border border-stone-150 space-y-4">
                  <h3 className="text-xs font-black text-stone-800 uppercase tracking-widest">➕ Yeni Yakınımı Ekle</h3>
                  
                  {compError && (
                    <div className="bg-red-50 text-red-700 p-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-red-100 animate-pulse">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>{compError}</span>
                    </div>
                  )}

                  {compSuccess && (
                    <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-100">
                      <CheckCircle className="h-4 w-4 text-emerald-600 animate-bounce" />
                      <span>{compSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                        Adınız Soyadınız <span className="text-red-500 text-xs inline">*</span>
                      </label>
                      <input
                        type="text"
                        value={compName}
                        onChange={(e) => setCompName(e.target.value)}
                        placeholder="Örn: Hakan Yalçın"
                        className="w-full rounded-xl border border-stone-250 bg-white px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                        🔒 T.C. Kimlik <span className="text-red-500 text-xs inline">*</span>
                      </label>
                      <input
                        type="text"
                        value={compTc}
                        onChange={(e) => setCompTc(e.target.value)}
                        placeholder="11 Haneli T.C. Numarası"
                        maxLength={11}
                        className="w-full rounded-xl border border-stone-250 bg-white px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-xl bg-[#FF385C] hover:bg-rose-600 text-white font-extrabold px-5 py-2.5 text-xs transition active:scale-95 cursor-pointer shadow-sm hover:shadow"
                    >
                      Yeni Refakatçi Kaydet
                    </button>
                  </div>
                </form>

                {/* Companions Pool Gallery */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-stone-700 uppercase tracking-wider">Sizinle Seyahat Edecek Aktif Kişiler</h3>
                  {companions.length === 0 ? (
                    <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200/50">
                      <Users className="h-8 w-8 text-stone-300 mx-auto mb-2" />
                      <p className="text-xs text-stone-500 font-medium">Listenizde kayıtlı refakatçi bulunmuyor. Yukarıdan yeni kişi ekleyebilirsiniz.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {companions.map((comp) => (
                        <div key={comp.id} className="flex items-center justify-between bg-stone-50 px-4 py-3 rounded-2xl border border-stone-200/60 hover:border-stone-300 transition-all">
                          <div>
                            <span className="text-xs font-bold text-stone-850 block">{comp.name}</span>
                            <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">T.C. No: {comp.tcNo.substring(0, 3)}*********</span>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm('Bu refakatçiyi silmek istediğinize emin misiniz?')) {
                                onDeleteCompanion(comp.id);
                              }
                            }}
                            className="text-stone-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Listeden Kaldır"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. FAVORITES TAB */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-stone-900 font-display">Favorilerim</h2>
                  <p className="text-xs text-stone-500 mt-1">İlgilendiğiniz, beğendiğiniz bungalov ve villaları biriktirip arkadaşlarınızla paylaşın.</p>
                </div>

                {myFavVillas.length === 0 ? (
                  <div className="text-center py-16 border border-stone-200/80 rounded-3xl bg-stone-50/50">
                    <Heart className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                    <h3 className="text-sm font-extrabold text-stone-850">Favori İlanınız Yok</h3>
                    <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto leading-relaxed">
                      Hoşunuza giden bungalovların üstündeki kalp simgelerine tıklayarak onları bu hızlı listeye kaydedebilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myFavVillas.map((v) => (
                      <div 
                        key={v.id} 
                        onClick={() => onSelectVilla(v)}
                        className="group flex flex-col gap-2 cursor-pointer border border-stone-200 hover:border-stone-300 rounded-2xl p-2 pb-3.5 bg-white transition hover:shadow-xs"
                      >
                        <div className="aspect-4/3 rounded-xl overflow-hidden relative bg-stone-100">
                          <img src={v.images[0]} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300" />
                        </div>
                        <div className="px-1 mt-1">
                          <h3 className="text-xs font-black text-stone-900 leading-tight truncate">{v.name}</h3>
                          <p className="text-[11px] text-stone-400 mt-0.5 uppercase tracking-wide font-black">{v.region}</p>
                          <div className="flex items-center justify-between mt-2.5">
                            <span className="font-mono text-xs font-extrabold text-stone-900">₺{getVillaPricePerNightForDisplay(v).toLocaleString('tr-TR')}/gece</span>
                            <span className="text-[10px] bg-rose-50 border border-rose-100 text-[#FF385C] font-extrabold px-2 py-0.5 rounded-lg">Özel Teklif</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. SETTINGS & PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-stone-900 font-display">Profil Bilgileriniz & Ayarlar</h2>
                  <p className="text-xs text-stone-500 mt-1">Rezervasyon formunun otomatik olarak doldurulması için profile tescil edilmiş verileriniz.</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-xl">
                  
                  {profileSuccess && (
                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl text-xs flex items-center gap-1.5 border border-emerald-100 font-semibold shadow-xs">
                      <CheckCircle className="h-4 w-4 text-emerald-600 animate-bounce" />
                      <span>Kişisel profil bilgileriniz başarıyla güncellendi!</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1.5">
                        Adınız Soyadınız <span className="text-red-500 text-xs font-bold inline">*</span>
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full rounded-xl border border-stone-250 bg-white px-3.5 py-2.5 text-xs text-stone-850 font-medium focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1.5">
                          T.C. Kimlik Numarası <span className="text-red-500 text-xs font-bold inline">*</span>
                        </label>
                        <input
                          type="text"
                          value={profileTc}
                          onChange={(e) => setProfileTc(e.target.value)}
                          maxLength={11}
                          className="w-full rounded-xl border border-stone-250 bg-white px-3.5 py-2.5 text-xs text-stone-850 font-mono focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1.5">
                          Cep Telefon Numarası <span className="text-red-500 text-xs font-bold inline">*</span>
                        </label>
                        <input
                          type="text"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          disabled
                          title="Telefon numaraları benzersiz oturum kimliğiniz olup değiştirilemez"
                          className="w-full rounded-xl border border-stone-250 bg-stone-100 text-stone-500 px-3.5 py-2.5 text-xs font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      {/* optional email, no compulsory labels as requested */}
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1.5">
                        E-POSTA ADRESİ
                      </label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        placeholder="Örn: adiniz@domain.com"
                        className="w-full rounded-xl border border-stone-250 bg-white px-3.5 py-2.5 text-xs text-stone-850 font-medium focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-150 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-xl bg-[#FF385C] hover:bg-rose-600 text-white font-extrabold px-6 py-3 text-xs tracking-wider uppercase transition shadow-md shadow-rose-500/10 active:scale-95 cursor-pointer"
                    >
                      Değişiklikleri Profilime Kaydet
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Popups */}
      {cancelPopupOpen && selectedBookingId && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="text-lg font-black text-stone-900 mb-2">İptal Nedeni</h3>
            <p className="text-xs text-stone-500 mb-4">Lütfen rezervasyonunuzu iptal etme nedeninizi kısaca belirtin.</p>
            <textarea
              className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:ring-[#FF385C] focus:border-[#FF385C] resize-none h-24 mb-4"
              placeholder="İptal sebebiniz..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setCancelPopupOpen(false)}
                className="px-4 py-2 text-xs font-bold text-stone-500 hover:bg-stone-100 rounded-xl"
              >
                Vazgeç
              </button>
              <button 
                onClick={() => {
                  onCancelBooking(selectedBookingId, cancelReason);
                  setCancelPopupOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700"
              >
                İptal İşlemini Tamamla
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentPopup === 'cc' && selectedBookingId && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button onClick={() => setPaymentPopup(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"><Trash2 className="h-4 w-4 hidden" /> ✕</button>
            <h3 className="text-lg font-black text-stone-900 mb-4">Kredi Kartı ile Öde</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Kart Üzerindeki İsim" className="w-full border rounded-xl p-3 text-sm" />
              <input type="text" placeholder="Kart Numarası (XXXX XXXX XXXX XXXX)" className="w-full border rounded-xl p-3 text-sm font-mono" />
              <div className="flex gap-4">
                <input type="text" placeholder="AA/YY" className="w-1/2 border rounded-xl p-3 text-sm" />
                <input type="text" placeholder="CVC" className="w-1/2 border rounded-xl p-3 text-sm" />
              </div>
              <button 
                onClick={() => {
                  if (onUpdateBooking) onUpdateBooking(selectedBookingId, { paymentStatus: 'paid' });
                  setPaymentPopup(null);
                  alert('Ödeme başarıyla alındı!');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl mt-4"
              >
                Ödemeyi Tamamla
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentPopup === 'iban' && selectedBookingId && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button onClick={() => setPaymentPopup(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700">✕</button>
            <h3 className="text-lg font-black text-stone-900 mb-2">IBAN ile Ödeme</h3>
            <p className="text-xs text-stone-500 mb-4">Lütfen kaparo tutarını aşağıdaki hesaba transfer ettikten sonra bildirim butonuna tıklayınız.</p>
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl mb-4">
              <div className="text-xs text-stone-400 font-bold mb-1">Alıcı:</div>
              <div className="text-sm font-bold text-stone-800 mb-3">Villa Bungalov Tatil Turizm Tic. A.Ş.</div>
              <div className="text-xs text-stone-400 font-bold mb-1">IBAN:</div>
              <div className="text-sm font-mono font-bold text-stone-800 break-all select-all">TR12 3456 7890 0000 0000 0000 00</div>
            </div>
            <button 
              onClick={() => {
                if (onUpdateBooking) onUpdateBooking(selectedBookingId, { paymentStatus: 'iban_notified' });
                setPaymentPopup(null);
                alert('Ödeme bildiriminiz alınmıştır.');
              }}
              className="w-full bg-[#FF385C] hover:bg-rose-600 text-white font-bold py-3 rounded-xl"
            >
              Ödemeyi Yaptım
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
