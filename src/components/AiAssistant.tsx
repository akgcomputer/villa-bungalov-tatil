import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  X, 
  MessageCircle, 
  Phone, 
  Instagram, 
  Youtube, 
  Send, 
  Globe, 
  Tv, 
  ShieldCheck 
} from 'lucide-react';

export interface SocialChannel {
  id: string;
  type: string; // WhatsApp, Telefon, Instagram, X, YouTube, Telegram, TikTok, Web etc.
  label: string;
  value: string;
  url: string;
}

const DEFAULT_SOCIALS: SocialChannel[] = [
  { 
    id: '1', 
    type: 'WhatsApp', 
    label: '7/24 Doğrudan WhatsApp Destek', 
    value: '+90 541 246 54 29', 
    url: 'https://wa.me/905412465429' 
  },
  { 
    id: '2', 
    type: 'Telefon', 
    label: 'Doğrudan Ev Sahibi Asistanı', 
    value: '+90 541 246 54 29', 
    url: 'tel:+905412465429' 
  },
  { 
    id: '3', 
    type: 'Instagram', 
    label: 'Instagram Resmi Hesabımız', 
    value: '@villabungalovtatil', 
    url: 'https://instagram.com/villabungalovtatil' 
  }
];

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [channels, setChannels] = useState<SocialChannel[]>([]);

  const loadChannels = () => {
    const saved = localStorage.getItem('villabungalov_socials');
    if (saved) {
      try {
        setChannels(JSON.parse(saved));
      } catch (e) {
        setChannels(DEFAULT_SOCIALS);
      }
    } else {
      localStorage.setItem('villabungalov_socials', JSON.stringify(DEFAULT_SOCIALS));
      setChannels(DEFAULT_SOCIALS);
    }
  };

  useEffect(() => {
    loadChannels();
    
    // Listen to changes from Admin Panel
    const handleUpdate = () => {
      loadChannels();
    };
    
    window.addEventListener('villabungalov_socials_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    
    return () => {
      window.removeEventListener('villabungalov_socials_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const getChannelIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'whatsapp':
        return <MessageCircle className="h-5 w-5 text-emerald-500" />;
      case 'telefon':
        return <Phone className="h-5 w-5 text-blue-500" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-600" />;
      case 'telegram':
        return <Send className="h-5 w-5 text-sky-400" />;
      case 'x':
      case 'twitter':
        return <span className="font-extrabold text-stone-900 text-xs">X</span>;
      case 'tiktok':
        return <Tv className="h-5 w-5 text-pink-600" />;
      default:
        return <Globe className="h-5 w-5 text-amber-500" />;
    }
  };

  const getChannelBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'whatsapp':
        return 'bg-emerald-50/70 border-emerald-100 hover:border-emerald-300 text-emerald-800';
      case 'telefon':
        return 'bg-blue-50/70 border-blue-100 hover:border-blue-300 text-blue-800';
      case 'instagram':
        return 'bg-pink-50/70 border-pink-100 hover:border-pink-300 text-pink-800';
      case 'youtube':
        return 'bg-red-50/70 border-red-100 hover:border-red-300 text-red-800';
      case 'telegram':
        return 'bg-sky-50/70 border-sky-100 hover:border-sky-300 text-sky-850';
      case 'tiktok':
        return 'bg-purple-50/70 border-purple-100 hover:border-purple-300 text-purple-800';
      default:
        return 'bg-stone-50/70 border-stone-150 hover:border-stone-300 text-stone-800';
    }
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-55 flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-white shadow-2xl hover:bg-amber-500 hover:text-stone-950 transition-all duration-300 transform hover:scale-110 active:scale-95 group"
          id="chat-floating-launcher"
          title="Direct Contact Support Channels"
        >
          <div className="relative">
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
          </div>
        </button>
      )}

      {/* Social & Contact Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-55 flex h-[480px] w-[360px] max-w-[calc(100vw-32px)] flex-col rounded-3xl border border-stone-200 bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 overflow-hidden"
          id="chat-panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-stone-950 px-5 py-4 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-stone-950 shadow-md">
                <Bot className="h-5.5 w-5.5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-black leading-tight">Doğrudan İletişim</h4>
                <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3 w-3" />
                  Hızlı &amp; Komisyonsuz Asistanlık
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
              id="close-chat-btn"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Channels List Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-stone-50 text-left">
            <p className="text-[11px] text-stone-500 leading-relaxed font-semibold">
              Komisyon ve aracı maliyetleri olmadan doğrudan ev sahipleriyle &amp; yetkili ekibimizle koordinasyon sağlayın.
            </p>

            {channels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-stone-400">
                <Globe className="h-10 w-10 mb-2 stroke-[1.5]" />
                <span className="text-xs font-semibold">Aktif İletişim Kanalı Bulunmuyor</span>
                <span className="text-[10px] mt-1 text-stone-400">Yönetici panelinden kanal ekleyebilirsiniz.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {channels.map((chan) => (
                  <a
                    key={chan.id}
                    href={chan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3.5 rounded-2xl border bg-white shadow-xs transition-all duration-200 hover:scale-[1.015] hover:shadow-sm ${getChannelBadgeColor(chan.type)}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-50 border border-stone-150 shadow-inner">
                        {getChannelIcon(chan.type)}
                      </div>
                      <div className="text-left">
                        <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-wide">
                          {chan.type}
                        </span>
                        <h5 className="text-[11px] font-black tracking-tight leading-normal mt-0.5 text-stone-900">
                          {chan.label}
                        </h5>
                      </div>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span className="text-[11px] font-mono font-extrabold tracking-tight">
                        {chan.value}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Footer Area */}
          <div className="p-4 bg-white border-t border-stone-150 text-center">
            <span className="text-[10px] text-stone-400 select-none font-semibold flex items-center justify-center gap-1">
              <span>© {new Date().getFullYear()} villabungalovtatil.com.tr</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
