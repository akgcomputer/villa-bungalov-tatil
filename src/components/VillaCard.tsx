import React, { useState } from 'react';
import { Users, BedDouble, Bath, MapPin, Sparkles, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Villa, AGENCY_DETAILS, getVillaSlug, VILLA_TYPES_MAP, getVillaPricePerNightForDisplay } from '../data';

interface VillaCardProps {
  key?: string | number;
  villa: Villa;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (villa: Villa) => void;
  onQuickBook: (villa: Villa) => void;
  onGoToDetail?: (villa: Villa) => void;
}

export const FEATURE_MAP: Record<string, { label: string; icon: string; color: string }> = {
  heated_pool: { label: 'Isıtmalı Havuz', icon: '♨️', color: 'bg-rose-50 text-rose-700 border-rose-200/50' },
  jacuzzi: { label: 'Jakuzi', icon: '🛁', color: 'bg-indigo-50 text-indigo-700 border-indigo-200/50' },
  fireplace: { label: 'Şömine', icon: '🔥', color: 'bg-amber-50 text-amber-700 border-amber-200/50' },
  lake_view: { label: 'Göl Manzarası', icon: '🌅', color: 'bg-blue-50 text-blue-700 border-blue-200/50' },
  pet_friendly: { label: 'Evcil Dostu', icon: '🐾', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/50' },
  garden: { label: 'Müstakil Bahçe', icon: '🏡', color: 'bg-stone-50 text-stone-700 border-stone-200/50' },
  barbeque: { label: 'Barbekü', icon: '🍖', color: 'bg-orange-50 text-orange-700 border-orange-200/50' },
  wifi: { label: 'Ücretsiz WiFi', icon: '📶', color: 'bg-sky-50 text-sky-700 border-sky-200/50' },
  air_conditioning: { label: 'Klima', icon: '❄️', color: 'bg-teal-50 text-teal-700 border-teal-200/50' },
};

export default function VillaCard({
  villa,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onQuickBook,
  onGoToDetail
}: VillaCardProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const minSwipeDistance = 30;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const endX = e.changedTouches[0].clientX;
    const distance = touchStart - endX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      setIsSwiping(true);
      if (isLeftSwipe) {
        if (villa.images && villa.images.length > 0) {
          setCurrentImgIndex((prev) => (prev === villa.images.length - 1 ? 0 : prev + 1));
        }
      } else {
        if (villa.images && villa.images.length > 0) {
          setCurrentImgIndex((prev) => (prev === 0 ? villa.images.length - 1 : prev - 1));
        }
      }
      setTimeout(() => setIsSwiping(false), 50); // reset swiping state after click event cycle
    } else {
      setIsSwiping(false);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (villa.images && villa.images.length > 0) {
      setCurrentImgIndex((prev) => (prev === 0 ? villa.images.length - 1 : prev - 1));
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (villa.images && villa.images.length > 0) {
      setCurrentImgIndex((prev) => (prev === villa.images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div 
      className="group flex flex-col overflow-hidden bg-transparent cursor-pointer"
      id={`villa-${villa.id}`}
      onClick={(e) => {
        if (isSwiping) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onSelect(villa);
      }}
    >
      {/* Thumbnail area (Slick Airbnb slider representation) */}
      <div 
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100 shadow-sm border border-stone-100 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={villa.images[currentImgIndex] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800'}
          alt={villa.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />

        {/* Heart icon in top-right for Wishlisting */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(villa.id);
          }}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all active:scale-95 text-stone-700 hover:text-[#FF385C]"
          title="Favorilere Ekle"
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${
              isFavorite 
                ? 'fill-[#FF385C] text-[#FF385C]' 
                : 'text-stone-700 hover:text-[#FF385C]'
            }`} 
          />
        </button>

        {/* Image navigation controls */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={prevImage}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-xl hover:bg-white active:scale-90"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={nextImage}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-xl hover:bg-white active:scale-90"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Sliding dot indicators */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1">
          {villa.images.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentImgIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Top-left Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 items-center">
          <span className="rounded-md bg-[#FF385C] px-2 py-0.7 text-[10px] font-extrabold tracking-tight text-white shadow">
            {VILLA_TYPES_MAP[villa.type]?.icon || '🏡'} {VILLA_TYPES_MAP[villa.type]?.label || 'Lüks Konut'}
          </span>
          {villa.badge && (
            <span className="rounded-md bg-stone-900/90 backdrop-blur px-2 py-0.7 text-[9px] font-extrabold uppercase tracking-wide text-white shadow">
              {villa.badge}
            </span>
          )}
        </div>
      </div>

      {/* Details area */}
      <div className="flex flex-1 flex-col pt-3 pb-1">
        
        {/* Destination & Rating Star */}
        <div className="flex items-start justify-between">
          <h3 className="font-sans text-[15px] font-bold text-stone-900 leading-tight line-clamp-1 group-hover:text-[#FF385C] transition-colors">
            {villa.name}
          </h3>
          <div className="flex items-center gap-1 text-[13px] font-bold text-stone-800 shrink-0">
            <Star className="h-3.8 w-3.8 fill-amber-500 text-amber-500" />
            <span>{villa.rating.toFixed(2)}</span>
          </div>
        </div>

        {/* Category Description & Host Name info */}
        <span className="text-[13px] text-stone-500 font-normal line-clamp-1 mt-0.5">
          {villa.region} • Ev Sahibi: <span className="font-medium text-stone-700">{villa.hostName || 'Özel Sahibi'}</span>
        </span>

        {/* Capacity Details snippet */}
        <span className="text-[12px] text-stone-400 font-normal mt-0.5">
          {villa.isBoat ? (
            <span>
              ⚓ {villa.boatDetails?.boatType || 'Tekne'} • {villa.boatDetails?.skipper || 'Kaptanlı'} • {villa.capacity} Kişi Kapasite
            </span>
          ) : (
            <span>
              {villa.capacity} Kişi • {villa.bedrooms} Yatak Odası • {villa.bathrooms} Banyo
            </span>
          )}
        </span>

        {/* Highlights features strip */}
        <div className="my-2 flex flex-wrap gap-1">
          {villa.features.slice(0, 3).map((feat) => {
            const match = FEATURE_MAP[feat];
            if (!match) return null;
            return (
              <span
                key={feat}
                className="inline-flex items-center gap-0.5 rounded-md border border-stone-100 bg-stone-50 px-1.5 py-0.5 text-[9px] font-medium text-stone-600"
              >
                <span>{match.icon}</span>
                <span>{match.label}</span>
              </span>
            );
          })}
        </div>

        {/* Pricing tag precisely mimicking Airbnb */}
        <div className="mt-1 flex items-baseline gap-1 text-stone-900">
          <span className="text-base font-extrabold text-stone-900">₺{getVillaPricePerNightForDisplay(villa).toLocaleString('tr-TR')}</span>
          <span className="text-xs text-stone-500 font-normal">/ gece</span>
        </div>

        {/* Quick responsive request actions in card space */}
        <div className="mt-3 flex flex-col gap-1.5 w-full">
          <div className="grid grid-cols-2 gap-1.5 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(villa);
              }}
              className="rounded-lg border border-stone-250 bg-white hover:bg-stone-50 py-1.5 text-xs font-semibold text-stone-700 transition text-center"
              title="Hızlı İnceleme Pop-up"
            >
              Hızlı İncele
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onGoToDetail) {
                  onGoToDetail(villa);
                } else {
                  const slug = getVillaSlug(villa.name, villa.region);
                  window.history.pushState(null, '', slug);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="rounded-lg bg-stone-900 hover:bg-[#FF385C] hover:text-white py-1.5 text-xs font-bold text-white transition shadow-sm text-center"
              title="Detaylı İncele (Kendi URL'si)"
            >
              Detaylı İncele
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
