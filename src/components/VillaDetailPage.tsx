import React, { useState } from 'react';
import { 
  X, Star, MapPin, ShieldCheck, Heart, ChevronLeft, ChevronRight, Share2, 
  ArrowLeft, Calendar, HelpCircle, Check, Sparkles, Sliders, PlayCircle, Eye, User
} from 'lucide-react';
import { 
  Villa, 
  getVillaSlug, 
  AVAILABLE_SLOGANS, 
  CATEGORIZED_AMENITIES, 
  AGENCY_DETAILS,
  VILLA_TYPES_MAP,
  getVillaPricePerNightForDisplay
} from '../data';

interface VillaDetailPageProps {
  villa: Villa;
  onBack: () => void;
  onQuickBook: (villa: Villa) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function VillaDetailPage({
  villa,
  onBack,
  onQuickBook,
  isFavorite,
  onToggleFavorite
}: VillaDetailPageProps) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  
  // Lightbox Zoom state
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  
  // Categorized amenities modal/expand state
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Fallback for slogans if not specifically assigned by host
  const activeSlogans = (villa.slogans && villa.slogans.length > 0) 
    ? villa.slogans.slice(0, 4) 
    : ['entry', 'outdoor', 'peaceful']; // default first 3 slogans

  // Fallback for rich categorized feature IDs if not configured
  const getVillaCatFeatures = () => {
    if (villa.catFeatures && villa.catFeatures.length > 0) {
      return villa.catFeatures;
    }
    // Pre-populate with standard fallback set
    const fallbackList = [
      'bath_hairdryer', 'bath_soap', 'bath_hotwater',
      'bed_essentials', 'bed_sheets', 'bed_hangers',
      'temp_ac', 'temp_central', 'net_wifi', 'kit_kitchen',
      'kit_fridge', 'kit_basics', 'kit_dinnerware', 'loc_entrance'
    ];
    // Adapt based on legacy features
    if (villa.features.includes('heated_pool')) fallbackList.push('park_pool');
    if (villa.features.includes('jacuzzi')) fallbackList.push('park_jacuzzi');
    if (villa.features.includes('fireplace')) fallbackList.push('temp_fireplace');
    if (villa.features.includes('lake_view')) fallbackList.push('view_lake');
    if (villa.features.includes('pet_friendly')) fallbackList.push('srv_pet');
    if (villa.features.includes('garden')) {
      fallbackList.push('view_garden');
      fallbackList.push('out_backyard');
    }
    if (villa.features.includes('barbeque')) {
      fallbackList.push('out_barbeque');
      fallbackList.push('kit_bbq_util');
    }
    return fallbackList;
  };

  const currentCatFeatures = getVillaCatFeatures();

  // Helper lists for lightboxes
  const nextZoomImage = () => {
    if (zoomIndex !== null && villa.images) {
      setZoomIndex((prev) => (prev === villa.images.length - 1 ? 0 : prev! + 1));
    }
  };

  const prevZoomImage = () => {
    if (zoomIndex !== null && villa.images) {
      setZoomIndex((prev) => (prev === 0 ? villa.images.length - 1 : prev! - 1));
    }
  };

  // Find all amenities that are present vs not present
  const presentAmenitiesCount = CATEGORIZED_AMENITIES.reduce((count, cat) => {
    if (cat.category === 'Mevcut olmayan olanaklar') return count;
    const availableItems = cat.items.filter(item => currentCatFeatures.includes(item.id));
    return count + availableItems.length;
  }, 0);

  return (
    <div className="w-full bg-[#FAFAFA]" id="villa-detail-page">
      {villa.approvalStatus === "pending" && (
        <div className="bg-amber-100 text-amber-800 text-xs font-bold text-center py-2 px-4 shadow-sm border-b border-amber-200">
          Bu ilan ÅŸu anda onay bekliyor. Sadece sizin (veya sistem yÃ¶neticisinin) Ã¶nizleme yapabilmesi iÃ§in gÃ¶sterilmektedir.
        </div>
      )}
      
      {/* Detail upper subheader / breadcrumb bar */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-700 px-4 py-2 text-xs font-bold transition active:scale-95"
            id="btn-back-to-listings"
          >
            <ArrowLeft className="h-4 w-4 text-[#FF385C] group-hover:-translate-x-0.5 transition-transform" />
            <span>TÃ¼m Ä°lanlara Geri DÃ¶n</span>
          </button>

          <div className="flex gap-2">
            {/* Toggle favorites icon status */}
            <button
              onClick={() => onToggleFavorite(villa.id)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-50 border border-stone-200 hover:bg-rose-50 text-stone-700 hover:text-[#FF385C] transition active:scale-95"
              title="Favorilere Ekle / KaldÄ±r"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : ''}`} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Ä°lan baÄŸlantÄ±sÄ± panoya kopyalandÄ±!");
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-50 border border-stone-200 hover:bg-sky-50 text-stone-700 hover:text-sky-600 transition active:scale-95"
              title="PaylaÅŸ"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="rounded-md bg-[#FF385C] px-2.5 py-0.7 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
              {VILLA_TYPES_MAP[villa.type]?.icon || 'ğŸ¡'} {VILLA_TYPES_MAP[villa.type]?.label || 'LÃ¼ks Konut'}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-stone-500">
              <MapPin className="h-3.5 w-3.5 text-[#FF385C]" />
              {villa.region}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3.5xl font-black text-stone-950 tracking-tight font-display mb-1.5">
            {villa.name}
          </h1>
          <p className="text-sm text-stone-500 font-medium">{villa.title}</p>
        </div>

        {/* Dynamic Image Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Main big image Column */}
          <div className="lg:col-span-2 relative aspect-3/2 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm group">
            <img 
              src={villa.images[selectedImgIndex] || 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800'}
              alt={villa.name}
              referrerPolicy="no-referrer"
              onClick={() => setZoomIndex(selectedImgIndex)}
              className="h-full w-full object-cover cursor-zoom-in transition-transform duration-500 hover:scale-[1.01]"
              id="main-villa-img"
            />
            
            {/* If there's classified image name, display it on the top left of the image */}
            {(() => {
              const currentUrl = villa.images[selectedImgIndex];
              const match = villa.classifiedImages?.find((img) => img.url === currentUrl);
              if (match) {
                return (
                  <div className="absolute top-4 left-4 rounded-2xl bg-stone-900/90 backdrop-blur-md text-white text-xs font-black px-4 py-2 flex items-center gap-2 shadow-lg border border-white/10 uppercase tracking-widest animation-fade-in animate-pulse">
                    <span className="text-rose-400 font-bold">ğŸ“ {match.name}</span>
                    <span className="text-[10px] text-stone-300 bg-white/15 px-2 py-0.5 rounded font-medium">
                      {match.category === 'vitrin' ? 'Vitrin' : match.category === 'dis' ? 'DÄ±ÅŸ Alan' : match.category === 'ic' ? 'Ä°Ã§ Alan' : 'Ek Hizmet'}
                    </span>
                  </div>
                );
              }
              return null;
            })()}

            <div className="absolute bottom-4 left-4 rounded-xl bg-stone-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1.5 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-rose-400" />
              <span>GÃ¶rseli bÃ¼yÃ¼tmek iÃ§in Ã¼zerine tÄ±klayÄ±n</span>
            </div>

            <div className="absolute bottom-4 right-4 rounded-xl bg-stone-950/80 text-white text-xs font-extrabold px-3 py-1.5 shadow-sm">
              FotoÄŸraf {selectedImgIndex + 1} / {villa.images.length}
            </div>
          </div>

          {/* Thumbnails list and the Guest Favorite box Column */}
          <div className="flex flex-col justify-between gap-6">
            
            {/* Small Thumbnails grid block */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <h4 className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-3">FotoÄŸraf AlbÃ¼mÃ¼ ({villa.images.length})</h4>
              <div className="grid grid-cols-3 gap-2.5">
                {villa.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImgIndex(i)}
                    className={`relative aspect-square w-full rounded-2xl overflow-hidden border-2 transition active:scale-95 flex-shrink-0 bg-stone-50 ${
                      selectedImgIndex === i ? 'border-[#FF385C] scale-102 ring-2 ring-rose-100' : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="h-full w-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* "Misafirlerin Favorisi" Box */}
            <div className="bg-gradient-to-br from-rose-50/50 to-amber-50/20 border-2 border-rose-100 p-6 rounded-3xl flex flex-col justify-between shadow-xs relative overflow-hidden" id="favorite-influence-card">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-rose-50 rounded-full opacity-50 blur-xl pointer-events-none" />
              
              <div className="relative">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF385C] text-white text-[10px] font-black uppercase tracking-wider rounded-lg mb-3 shadow-xs">
                  â˜… Misafirlerin Favorisi
                </span>
                
                <h3 className="text-[15px] font-black text-stone-900 leading-tight">
                  Misafirlere gÃ¶re sevilen evlerden biri
                </h3>
                <p className="text-xs text-stone-500 font-semibold mt-1">
                  PuanÄ± 5 Ã¼zerinden <span className="font-bold text-[#FF385C]">{villa.rating.toFixed(2)}</span> yÄ±ldÄ±z.
                </p>
              </div>

              <div className="border-t border-rose-100/80 pt-4 mt-4 flex items-center justify-between">
                <div>
                  <span className="block text-3xl font-black text-[#FF385C] leading-none">{villa.rating.toFixed(2)}</span>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">PUAN GENELÄ°</span>
                </div>
                <div className="w-px h-10 bg-rose-150" />
                <div className="text-right">
                  <span className="block text-2xl font-black text-stone-850 leading-none">{villa.reviewCount || 147}</span>
                  <span className="text-[10px] text-[#FF385C] font-extrabold uppercase tracking-wide">DeÄŸerlendirme</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Content Details Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Info Column: Slogans, Features, and Descriptions */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Description card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
              <h2 className="text-lg font-bold text-stone-950 font-display mb-4">Bu MuhteÅŸem Konaklama AlanÄ± HakkÄ±nda</h2>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line font-sans">
                {villa.description}
              </p>

              {/* Stats details grid */}
              <div className="mt-6 grid grid-cols-4 gap-2 bg-stone-50 rounded-2xl p-4 text-center text-xs text-stone-600 font-semibold border border-stone-100">
                {villa.isBoat ? (
                  <>
                    <div>
                      <span className="block text-[9px] text-stone-400 font-bold uppercase">TEKNE SINIFI</span>
                      <span className="text-stone-850 text-sm font-extrabold">{villa.boatDetails?.boatType || 'Katamaran'}</span>
                    </div>
                    <div className="border-x border-stone-200">
                      <span className="block text-[9px] text-stone-400 font-bold uppercase">KAPTAN SEÃ‡ENEÄÄ°</span>
                      <span className="text-stone-850 text-sm font-extrabold">{villa.boatDetails?.skipper || 'KaptanlÄ±'}</span>
                    </div>
                    <div className="border-r border-stone-200">
                      <span className="block text-[9px] text-stone-400 font-bold uppercase">LÄ°MAN</span>
                      <span className="text-stone-855 text-sm font-extrabold truncate block px-1">{villa.boatDetails?.port || 'Bodrum'}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-rose-500 font-black uppercase">KAPASÄ°TE</span>
                      <span className="text-rose-700 text-sm font-black">{villa.capacity} KiÅŸi</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="block text-[9px] text-stone-400 font-bold uppercase">KAPASÄ°TE</span>
                      <span className="text-stone-850 text-sm font-extrabold">{villa.capacity} Misafir</span>
                    </div>
                    <div className="border-x border-stone-200">
                      <span className="block text-[9px] text-stone-400 font-bold uppercase">YATAK ODASI</span>
                      <span className="text-stone-850 text-sm font-extrabold">{villa.bedrooms} Oda</span>
                    </div>
                    <div className="border-r border-stone-200">
                      <span className="block text-[9px] text-stone-400 font-bold uppercase">BANYO</span>
                      <span className="text-stone-855 text-sm font-extrabold">{villa.bathrooms} Banyo</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-rose-500 font-black uppercase">EN AZ KONAKLAMA</span>
                      <span className="text-rose-700 text-sm font-black">{villa.minNights || 2} Gece</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* CUSTOM SLOGANS SECTION (Required Custom Layout) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
              <h2 className="text-lg font-bold text-stone-950 font-display mb-6">Ã–ne Ã‡Ä±kan Ã–zellikler & Sloganlar</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="slogans-grid">
                {activeSlogans.map((sloganId) => {
                  const s = AVAILABLE_SLOGANS.find(item => item.id === sloganId);
                  if (!s) return null;
                  return (
                    <div key={s.id} className="flex gap-4 items-start p-4 rounded-2xl bg-stone-50/40 border border-stone-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-2xl shadow-xs shrink-0">
                        {s.icon}
                      </div>
                      <div>
                        {/* Red / pink titles for slogans */}
                        <h4 className="text-[13px] font-black text-[#FF385C] tracking-tight leading-snug">
                          {s.title}
                        </h4>
                        {/* Thick black descriptions for slogans */}
                        <p className="text-[12px] text-stone-900 font-bold mt-1 leading-normal font-sans">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CATEGORIZED AMENITIES DISPLAY ("Bu mekan size neler sunuyor?") */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs" id="categorized-amenities-section">
              <h2 className="text-lg font-bold text-stone-950 font-display mb-2">Bu mekÃ¢n size neler sunuyor?</h2>
              <p className="text-xs text-stone-400 font-semibold mb-6">MÃ¼lk sahibinin sizin iÃ§in Ã¶zel olarak sunduÄŸu olanaklar listesi</p>

              {/* Display a subset preview and a 'Daka Fazla GÃ¶ster' button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Grab only the first 6 active items of the matching config to show upfront */}
                {(() => {
                  let renderedCount = 0;
                  const elements: React.ReactNode[] = [];
                  
                  for (const cat of CATEGORIZED_AMENITIES) {
                    if (cat.items) {
                      for (const item of cat.items) {
                        if (currentCatFeatures.includes(item.id) && renderedCount < 6) {
                          renderedCount++;
                          elements.push(
                            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                              <span className="text-lg shrink-0">{item.icon}</span>
                              <span className="font-semibold text-stone-850 truncate">{item.label}</span>
                            </div>
                          );
                        }
                      }
                    }
                  }
                  
                  if (elements.length === 0) {
                    return (
                      <p className="text-stone-400 italic">Olanak bilgisi bulunamadÄ±.</p>
                    );
                  }
                  return elements;
                })()}
              </div>

              {/* Show more button */}
              <div className="mt-6 flex">
                <button
                  type="button"
                  onClick={() => setShowAllAmenities(true)}
                  className="rounded-xl border border-stone-300 hover:border-stone-400 hover:bg-stone-50 bg-white font-black text-xs text-stone-800 px-6 py-3 transition active:scale-95 shadow-xs flex items-center gap-2"
                  id="btn-show-all-amenities"
                >
                  <Sliders className="h-4 w-4 text-[#FF385C]" />
                  <span>TÃ¼m {presentAmenitiesCount} DonanÄ±mÄ± ve Ã–zelliÄŸi GÃ¶ster</span>
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Booking Widget & Host Info */}
          <div className="space-y-6">
            
            {/* Airbnb Styled Booking Widget */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md sticky top-24">
              <div className="flex items-baseline justify-[#111] gap-1.5 border-b border-stone-100 pb-4 mb-4">
                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider block">Gecelik Kira TutarÄ±</span>
                  <span className="text-2xl font-black text-stone-900 font-mono">â‚º{getVillaPricePerNightForDisplay(villa).toLocaleString('tr-TR')}</span>
                  <span className="text-xs text-stone-400 font-normal"> / gece</span>
                </div>
                
                <div className="text-right">
                  <span className="text-[10px] font-bold bg-rose-50 text-[#FF385C] border border-rose-100 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                    KOMÄ°SYONSUZ
                  </span>
                </div>
              </div>

              {/* Host profile block in booking widget */}
              <div className="flex items-center gap-3 my-4 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shrink-0 shadow-sm"><User className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <span className="block text-[10px] text-stone-400 uppercase font-bold">Ä°lan MÃ¼ellifi ev sahibi</span>
                  <span className="text-xs font-black text-stone-850 truncate block">{villa.hostName}</span>
                </div>
                <div className="ml-auto bg-white px-2 py-1 rounded-xl text-[10px] font-extrabold text-stone-750 flex items-center gap-0.5 border border-stone-150 shrink-0">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>{villa.rating.toFixed(2)}</span>
                </div>
              </div>

              {/* Extra services preview strictly inside booking card info */}
              <div className="mb-6 space-y-2.5">
                <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider block">Ev Sahibi Ekstra Hizmetleri</span>
                <div className="bg-stone-50 border border-stone-200/85 p-4 rounded-2xl">
                  {(villa.extraServices || []).length === 0 ? (
                    <p className="text-[11px] text-[#A6A6A6] font-sans italic">Bu mÃ¼lk iÃ§in ekstra yemek, temizlik veya transfer tanÄ±mlanmamÄ±ÅŸ.</p>
                  ) : (
                    <ul className="space-y-2 font-sans">
                      {villa.extraServices.map((srv) => {
                        return (
                          <li key={srv.id} className="text-stone-800 text-[12px] sm:text-[13px] font-extrabold flex items-center gap-2">
                            <span className="text-[#FF385C] font-black shrink-0 text-md">â€¢</span>
                            <span className="text-stone-900">{srv.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* Action Buttons inside booking widget */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => onQuickBook(villa)}
                  className="w-full text-center py-3.5 rounded-2xl bg-stone-950 hover:bg-stone-850 text-white text-xs font-black transition active:scale-95 shadow-md shadow-stone-950/10"
                >
                  Rezervasyon Talebi OluÅŸtur
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const msg = `Merhaba, *${villa.name}* (URL: ${window.location.host}${getVillaSlug(villa.name, villa.region)}) eviniz hakkÄ±nda doÄŸrudan bilgi alabilir miyim?`;
                    const url = `https://wa.me/${AGENCY_DETAILS.whatsapp.replace('+', '')}?text=${encodeURIComponent(msg)}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full justify-center flex items-center gap-1.5 py-3 rounded-2xl border border-emerald-250 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black transition active:scale-95"
                >
                  <span>ğŸ’¬</span>
                  <span>WhatsAPP ile Sor</span>
                </button>
              </div>

              {/* Direct Booking Gurantee Policy */}
              <div className="mt-4 bg-stone-50 border border-stone-100 p-3 rounded-xl text-[10px] text-stone-600 space-y-1">
                <span className="font-bold text-stone-800 block flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#FF385C]" />
                  DoÄŸrudan Ev Sahibi Teyiti
                </span>
                <p>Bu konutta komisyon ve aracÄ± Ã¼creti bulunmaz. Rezervasyon sÄ±rasÄ±nda yalnÄ±zca %10 oranÄ±nda gÃ¼vence kaparosu tahsil edilir.</p>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* ----------------- LIGHTBOX ZOOM VIEW MODAL (Required Images Zoom Loop) ----------------- */}
      {zoomIndex !== null && (
        <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200" id="lightbox-zoom-modal">
          
          {/* Top Bar on Zoom overlay */}
          <div className="flex items-center justify-between text-white py-2 px-4">
            <span className="text-xs font-mono tracking-widest font-bold">
              FOTOÄRAF KABÄ°NÄ° {zoomIndex + 1} / {villa.images.length}
            </span>
            <button
              onClick={() => setZoomIndex(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-90"
              title="Kapat (X)"
              id="btn-close-zoom"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Central Image Zoom stage */}
          <div className="flex-1 flex items-center justify-center relative">
            
            {/* Left Nav */}
            <button
              onClick={prevZoomImage}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 backdrop-blur-sm active:scale-90 transition"
              title="Ã–nceki GÃ¶rsel"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            {/* Main Zoomed Image */}
            <div className="relative">
              <img 
                src={villa.images[zoomIndex] || 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800'}
                alt=""
                className="max-h-[82vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-white/5 animate-in zoom-in-95 duration-200"
                referrerPolicy="no-referrer"
              />
              {(() => {
                const currentUrl = villa.images[zoomIndex];
                const match = villa.classifiedImages?.find((img) => img.url === currentUrl);
                if (match) {
                  return (
                    <div className="absolute top-4 left-4 rounded-2xl bg-stone-950/95 backdrop-blur-md text-white text-sm font-black px-4 py-2 flex items-center gap-2 shadow-2xl border border-white/10 uppercase tracking-widest">
                      <span className="text-rose-400 font-bold">ğŸ“ {match.name}</span>
                      <span className="text-xs text-stone-300 bg-white/15 px-2.5 py-0.5 rounded font-medium">
                        {match.category === 'vitrin' ? 'Vitrin' : match.category === 'dis' ? 'DÄ±ÅŸ Alan' : match.category === 'ic' ? 'Ä°Ã§ Alan' : 'Ek Hizmet'}
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Right Nav */}
            <button
              onClick={nextZoomImage}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 backdrop-blur-sm active:scale-90 transition"
              title="Sonraki GÃ¶rsel"
            >
              <ChevronRight className="h-7 w-7" />
            </button>

          </div>

          {/* Bottom Bar indicators on Zoom overlay */}
          <div className="text-center text-white/50 text-[10px] pb-4">
            Gezinmek iÃ§in yanlardaki oklarÄ± veya klavyenizi kullanabilirsiniz. Kapatmak iÃ§in X butonuna basÄ±n.
          </div>

        </div>
      )}

      {/* ----------------- ALL AMENITIES EXPANDABLE FULL SCREEN DRAWER/MODAL ----------------- */}
      {showAllAmenities && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="all-amenities-modal">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" onClick={() => setShowAllAmenities(false)} />

            <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl my-8 border border-stone-200 animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-stone-150 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-base font-black text-stone-900 font-display">Bu mekan size neler sunuyor?</h3>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">TÃ¼m donanÄ±mlar ve mevcut olmayan Ã¶zellikler</span>
                </div>
                
                <button
                  onClick={() => setShowAllAmenities(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 hover:bg-rose-50 hover:text-[#FF385C] text-stone-500 transition active:scale-90"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Body elements */}
              <div className="p-6 space-y-8 max-h-[75vh] overflow-y-auto no-scrollbar">
                
                {CATEGORIZED_AMENITIES.map((cat, idx) => {
                  const presentItems = cat.items.filter(item => currentCatFeatures.includes(item.id));
                  const missingItems = cat.items.filter(item => !currentCatFeatures.includes(item.id));
                  
                  // Don't show category in present lists if it has no present items
                  // UNLESS it is the 'Mevcut olmayan olanaklar' list which handles missing ones
                  const isMissingCategory = cat.category === 'Mevcut olmayan olanaklar';
                  
                  if (presentItems.length === 0 && !isMissingCategory) return null;

                  return (
                    <div key={idx} className="space-y-3">
                      <h4 className="text-xs font-black text-stone-950 uppercase tracking-widest border-b border-stone-100 pb-1.5">
                        {cat.category}
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {isMissingCategory ? (
                          // Explicit missing amenities display
                          // "Mevcut olmayanlarÄ± Mevcut olmayan olanaklarÄ±n altÄ±na Yok: diyerek listeleyip Ã¼zeri Ã§izgili listeleyelim"
                          cat.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-rose-50/45 border border-rose-100/60 text-stone-400 line-through select-none col-span-2">
                              <span className="text-sm">Yok: {item.icon}</span>
                              <span className="font-semibold text-stone-400">{item.label}</span>
                            </div>
                          ))
                        ) : (
                          presentItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100/65 text-stone-800">
                              <span className="text-sm">{item.icon}</span>
                              <span className="font-medium text-stone-700">{item.label}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Always include a custom missing amenities lists container under 'Mevcut olmayan olanaklar' category as well */}
                {(() => {
                  // Find all regular amenities that are genuinely missing from this villa
                  const allRegularMissing: { label: string; icon: string }[] = [];
                  CATEGORIZED_AMENITIES.forEach(cat => {
                    if (cat.category !== 'Mevcut olmayan olanaklar') {
                      cat.items.forEach(item => {
                        if (!currentCatFeatures.includes(item.id)) {
                          allRegularMissing.push({ label: item.label, icon: item.icon });
                        }
                      });
                    }
                  });

                  if (allRegularMissing.length > 0) {
                    return (
                      <div className="space-y-3 pt-4 border-t border-dashed border-stone-200">
                        <h4 className="text-xs font-bold text-stone-950 uppercase tracking-widest text-[#FF385C]">
                          Mevcut olmayan olanaklar
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Add default missing item of prompt first, then highlight others */}
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-rose-50 text-stone-400/90 line-through select-none col-span-1 sm:col-span-2 border border-rose-100">
                            <span className="text-sm shrink-0">âŒ</span>
                            <span className="font-extrabold text-stone-500">Yok: Konutta Ã§amaÅŸÄ±r kurutma makinesi (Ãœcretsiz)</span>
                          </div>

                          {allRegularMissing.slice(0, 10).map((miss, mIdx) => (
                            <div key={mIdx} className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-100/60 text-stone-400 line-through select-none">
                              <span className="text-xs shrink-0">{miss.icon}</span>
                              <span className="font-medium text-stone-400">Yok: {miss.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

              </div>

              {/* Footer */}
              <div className="bg-stone-50 px-6 py-4 border-t border-stone-150 text-right">
                <button
                  type="button"
                  onClick={() => setShowAllAmenities(false)}
                  className="rounded-xl bg-stone-900 text-white font-extrabold text-xs px-5 py-2.5 hover:bg-stone-800 transition active:scale-95"
                >
                  Penceriyi Kapat
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

