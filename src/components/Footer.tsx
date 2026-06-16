import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Compass, Globe, DollarSign } from 'lucide-react';
import { AGENCY_DETAILS } from '../data';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [logoTitle, setLogoTitle] = useState(() => localStorage.getItem("villabungalov_logo_title") || "VillaBungalovTatil");
  const [logoSubtitle, setLogoSubtitle] = useState(() => localStorage.getItem("villabungalov_logo_subtitle") || "Harika Evler Muhteşem Tatiller");

  useEffect(() => {
    const handleLogoUpdate = () => {
      setLogoTitle(localStorage.getItem("villabungalov_logo_title") || "VillaBungalovTatil");
      setLogoSubtitle(localStorage.getItem("villabungalov_logo_subtitle") || "Harika Evler Muhteşem Tatiller");
    };
    window.addEventListener("villabungalov_logo_changed", handleLogoUpdate);
    return () => window.removeEventListener("villabungalov_logo_changed", handleLogoUpdate);
  }, []);

  return (
    <footer className="bg-[#F7F7F7] text-stone-700 border-t border-stone-200" id="app-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 border-b border-stone-200 pb-10">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
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
            <p className="text-sm text-stone-500 leading-relaxed mb-4">
              Ev sahipleriyle doğrudan buluşun. Isıtmalı havuzlu, jakuzili bungalov ve lüks kiralık villalarla rüya gibi bir tatilin adresi.
            </p>
            <div className="text-xs text-stone-500 bg-stone-100 p-3 rounded-xl border border-stone-200/60 font-medium">
              <span>🏡 Doğrudan Ev Sahibinden Güvenli Ön Rezervasyon ve Kesintisiz İletişim Desteği</span>
            </div>
          </div>

          {/* Guest Links */}
          <div>
            <h3 className="text-sm font-semibold text-stone-950 mb-4 font-display">
              Seyahat Edenler İçin
            </h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <span className="hover:underline cursor-pointer transition-colors">Nasıl Çalışır?</span>
              </li>
              <li>
                <span className="hover:underline cursor-pointer transition-colors">Güvenli Rezervasyon Süreci</span>
              </li>
              <li>
                <span className="hover:underline cursor-pointer transition-colors">Isıtmalı Havuz Rehberi</span>
              </li>
              <li>
                <span className="hover:underline cursor-pointer transition-colors">İptal ve Esneklik Politikaları</span>
              </li>
              <li>
                <span className="hover:underline cursor-pointer transition-colors">Gizlilik ve KVKK</span>
              </li>
            </ul>
          </div>

          {/* Host Links */}
          <div>
            <h3 className="text-sm font-semibold text-stone-950 mb-4 font-display">
              Ev Sahipliği
            </h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <span className="hover:underline cursor-pointer transition-colors">Evinizi Listeleyin Boş Kalmasın</span>
              </li>
              <li>
                <span className="hover:underline cursor-pointer transition-colors">Ev Sahibi Koruma Sigortası</span>
              </li>
              <li>
                <span className="hover:underline cursor-pointer transition-colors">Topluluk Forumları</span>
              </li>
              <li>
                <span className="hover:underline cursor-pointer transition-colors">Sorumlu Ev Sahipliği İlkeleri</span>
              </li>
              <li>
                <span className="hover:underline cursor-pointer transition-colors">Gelir Hesaplama Aracı</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-stone-950 mb-4 font-display">
              İletişim & Destek Hattı
            </h3>
            <ul className="space-y-3.5 text-sm text-stone-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-[#FF385C] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-stone-900 leading-tight">Ofis Merkezi İstanbul</span>
                  <span className="text-stone-500 text-xs">Hizmet Tüm Türkiye ve civarı..</span>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <a 
                  href="https://wa.me/905412465429" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-emerald-600 transition-colors group"
                >
                  <svg className="h-5 w-5 text-[#25D366] fill-current group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.446L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.588 1.977 14.12 1.053 11.997 1.05c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.393 1.357 4.869l-.993 3.627 3.733-.974zm11.365-5.071c-.093-.156-.343-.248-.717-.435-.375-.187-2.216-1.092-2.56-1.217-.343-.125-.593-.187-.843.187-.25.375-.968 1.217-1.187 1.467-.219.25-.438.281-.812.093-.375-.187-1.583-.583-3.016-1.861-1.115-.995-1.868-2.227-2.086-2.6-.218-.375-.023-.578.164-.764.168-.168.375-.438.563-.656.188-.219.25-.375.375-.625.125-.25.063-.469-.031-.656-.093-.187-.843-2.031-1.156-2.781-.306-.735-.615-.635-.843-.647-.218-.01-.469-.012-.719-.012-.25 0-.656.094-.999.469-.344.375-1.313 1.281-1.313 3.125 0 1.844 1.344 3.625 1.531 3.875.188.25 2.644 4.037 6.406 5.661.895.386 1.594.616 2.138.79.9.286 1.719.246 2.366.15.722-.108 2.216-.906 2.528-1.781.312-.875.312-1.625.219-1.781z"/>
                  </svg>
                  <span className="font-bold text-stone-850 font-mono">+90 541 246 54 29</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="h-4.5 w-4.5 text-[#FF385C] shrink-0" />
                <span className="font-semibold text-stone-700">Destek Her Gün: 09:00 - 22:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright in actual Airbnb layout */}
        <div className="mt-8 pt-4 flex flex-col md:flex-row md:items-center md:justify-between text-xs text-stone-500 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span>© VillaBungalovTatil.com.tr</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Gizlilik</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer font-medium">Şartlar</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Site Haritası</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Villa Bungalov Tatil sitesi DD İnternet topluluğu Markasıdır ve Markamız{" "}
              <a 
                href="https://meetwork.com.tr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#FF385C] hover:underline font-black"
              >
                MeetWork
              </a>{" "}
              İştirakidir.
            </p>
          </div>

          {/* Custom Agency Attribution */}
          <div className="text-xs text-stone-500 font-sans font-medium">
            Tasarım ve Yazılım{" "}
            <a 
              href="https://isdeyeter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#FF385C] hover:underline font-black ms-1"
            >
              İş de YETER! (isdeyeter.com)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
