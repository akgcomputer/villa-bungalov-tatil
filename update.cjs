const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const importReplacement = `import { Plus, Minus, Search, Trash2, Calendar, MapPin, Users, Heart, Key, Share2, LogOut, CheckCircle2, SlidersHorizontal, Settings2, Bell, ShieldCheck, Home, Phone, Camera, DollarSign, LayoutDashboard, ChevronRight, X, AlertCircle, TrendingUp, Building2, UserCheck, ShieldAlert, Sparkles, Navigation, Globe, HelpCircle, BadgeAlert, ImageIcon } from 'lucide-react';
import { VILLA_DATA, Villa, REGIONS, AVAILABLE_SLOGANS, CATEGORIZED_AMENITIES, GENERAL_FAQ, AGENCY_DETAILS, SloganItem, AmenityCategory, TieredPrice, ALL_EXTRA_SERVICES, ExtraService } from './data';
import AdminUsers from './components/admin/AdminUsers';
import AdminHosts from './components/admin/AdminHosts';
import AdminCampaigns from './components/admin/AdminCampaigns';
import AdminPictures from './components/admin/AdminPictures';`;

const importTarget = `import { Plus, Minus, Search, Trash2, Calendar, MapPin, Users, Heart, Key, Share2, LogOut, CheckCircle2, SlidersHorizontal, Settings2, Bell, ShieldCheck, Home, Phone, Camera, DollarSign, LayoutDashboard, ChevronRight, X, AlertCircle, TrendingUp, Building2, UserCheck, ShieldAlert, Sparkles, Navigation, Globe, HelpCircle, BadgeAlert, ImageIcon } from 'lucide-react';
import { VILLA_DATA, Villa, REGIONS, AVAILABLE_SLOGANS, CATEGORIZED_AMENITIES, GENERAL_FAQ, AGENCY_DETAILS, SloganItem, AmenityCategory, TieredPrice, ALL_EXTRA_SERVICES, ExtraService } from './data';`;

content = content.replace(importTarget, importReplacement);

const panelsTarget = `          {currentPath === "/admin/users" && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-base font-bold text-stone-950 mb-4 font-display flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" /> Sistem Kullanıcıları
              </h3>
              <div className="text-center py-10 text-stone-400 text-xs">
                Yükleniyor...
              </div>
            </div>
          )}

          {currentPath === "/admin/hosts" && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-base font-bold text-stone-950 mb-4 font-display flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-500" /> Ev Sahipleri Yönetimi
              </h3>
              <div className="text-center py-10 text-stone-400 text-xs">
                Yükleniyor...
              </div>
            </div>
          )}

          {currentPath === "/admin/campaigns" && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-base font-bold text-stone-950 mb-4 font-display flex items-center gap-2">
                <BadgeAlert className="h-5 w-5 text-amber-500" /> Kampanyalar
              </h3>
              <div className="text-center py-10 text-stone-400 text-xs">
                Yükleniyor...
              </div>
            </div>
          )}

          {currentPath === "/admin/pictures" && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-base font-bold text-stone-950 mb-4 font-display flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#FF385C]" /> Görseller
              </h3>
              <div className="text-center py-10 text-stone-400 text-xs">
                Yükleniyor...
              </div>
            </div>
          )}`;

const panelsReplacement = `          {currentPath === "/admin/users" && (
            <AdminUsers bookings={bookings} />
          )}

          {currentPath === "/admin/hosts" && (
            <AdminHosts villas={villas} bookings={bookings} />
          )}

          {currentPath === "/admin/campaigns" && (
            <AdminCampaigns villas={villas} />
          )}

          {currentPath === "/admin/pictures" && (
            <AdminPictures villas={villas} />
          )}`;

content = content.replace(panelsTarget, panelsReplacement);
fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated successfully.');
