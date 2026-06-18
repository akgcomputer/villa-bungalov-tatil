import React from 'react';
import { X, Calendar, User, Phone, CheckCircle, Clock, Trash2, CalendarDays, ExternalLink, HelpCircle } from 'lucide-react';
import { AGENCY_DETAILS } from '../data';

export interface Booking {
  id: string;
  villaId: string;
  villaName: string;
  villaImage: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalDays: number;
  totalPrice: number;
  basePrice?: number;
  discountAmount?: number;
  servicesCost?: number;
  selectedServicesList?: { name: string; cost: number; qty: number }[];
  prepaymentAmount?: number;
  status: 'pending' | 'confirmed' | 'host_confirmed' | 'cancelled' | 'user_cancelled' | 'host_cancelled' | 'admin_cancelled';
  paymentStatus?: 'pending' | 'paid' | 'iban_notified';
  cancelReason?: string;
  createdAt: string;
}

interface ReservationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
}

export default function ReservationPanel({ isOpen, onClose, bookings, onCancelBooking }: ReservationPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="reservations-drawer-container">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md flex flex-col bg-white shadow-2xl h-full overflow-hidden animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-stone-50 px-6 py-5 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-stone-900">Rezervasyon Taleplerim</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Booking list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {bookings.length === 0 ? (
              <div className="text-center py-12 px-4 flex flex-col items-center justify-center h-full">
                <div className="h-16 w-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 mb-4 border border-stone-150">
                  <Calendar className="h-8 w-8 text-stone-300" />
                </div>
                <h3 className="text-sm font-bold text-stone-800">Aktif Konaklama Talebiniz Yok</h3>
                <p className="text-xs text-stone-500 mt-2 max-w-xs leading-relaxed">
                  Beğendiğiniz kiralık bungalov veya villalar için detay sayfasından rezervasyon isteği gönderebilirsiniz. Talepleriniz burada listelenecektir.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 active:scale-95 transition"
                >
                  Keşfetmeye Başla
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-stone-500 font-medium">
                  Toplam <strong>{bookings.length}</strong> rezervasyon isteğiniz listeleniyor. Satış temsilcimiz en kısa sürede sizinle iletişime geçecektir.
                </p>

                {bookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="overflow-hidden rounded-xl border border-stone-100 bg-stone-50/40 hover:bg-stone-50 transition p-4 relative"
                  >
                    {/* Top image/title info */}
                    <div className="flex gap-3 items-start mb-4">
                      <img 
                        src={booking.villaImage} 
                        alt={booking.villaName}
                        referrerPolicy="no-referrer"
                        className="h-12 w-16 object-cover rounded-lg bg-stone-200"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-stone-800 truncate">{booking.villaName}</h4>
                        <span className="text-[10px] text-stone-400 font-mono block">Talep ID: {booking.id.slice(0, 8)}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      {booking.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200/50">
                          <Clock className="h-2.5 w-2.5 animate-spin" />
                          Onay Bekliyor
                        </span>
                      )}
                      {booking.status === 'confirmed' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/50">
                          <CheckCircle className="h-2.5 w-2.5" />
                          Onaylandı
                        </span>
                      )}
                      {booking.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 border border-rose-200/50">
                          İptal Edildi
                        </span>
                      )}
                    </div>

                    {/* Details table */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-stone-100 pt-3 text-xs text-stone-600">
                      <div>
                        <span className="block text-[10px] text-stone-400 font-medium">GİRİŞ/ÇIKIŞ</span>
                        <span className="font-semibold text-stone-700">{booking.checkIn} → {booking.checkOut}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-400 font-medium">SÜRE VE KİŞİ</span>
                        <span className="font-semibold text-stone-700">{booking.totalDays} Gece / {booking.guestsCount} Kişi</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-400 font-medium">İSİM SOYİSİM</span>
                        <span className="font-semibold text-stone-700 flex items-center gap-1">
                          <User className="h-3 w-3 text-stone-400" />
                          {booking.guestName}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-400 font-medium">İLETİŞİM HATTI</span>
                        <span className="font-semibold text-stone-700">{booking.guestPhone}</span>
                      </div>
                    </div>

                    {/* Calculated Total Price Detailed */}
                    <div className="mt-4 border-t border-stone-100 pt-3">
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-xs font-medium text-stone-500">
                          <span>Konaklama Bedeli:</span>
                          <span>₺{(booking.basePrice || booking.totalPrice).toLocaleString('tr-TR')}</span>
                        </div>
                        {booking.discountAmount ? (
                          <div className="flex justify-between text-xs font-bold text-emerald-600">
                            <span>Kupon İndirimi:</span>
                            <span>-₺{booking.discountAmount.toLocaleString('tr-TR')}</span>
                          </div>
                        ) : null}
                        {booking.selectedServicesList?.map((s, idx) => (
                          <div key={idx} className="flex justify-between text-xs font-medium text-stone-500">
                            <span>Ek Hizmet: {s.name} (x{s.qty})</span>
                            <span>+₺{s.cost.toLocaleString('tr-TR')}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-bold text-stone-800 pt-1 border-t border-stone-100/50">
                          <span>Tahmini Toplam Tutar:</span>
                          <span className="text-amber-600">₺{booking.totalPrice.toLocaleString('tr-TR')}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-rose-600 bg-rose-50 p-1.5 rounded mt-2">
                          <span>Ön Ödeme (Kaparo):</span>
                          <span>₺{((booking as any).prepaymentAmount || booking.totalPrice * 0.1).toLocaleString('tr-TR')}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-1.5 border-t border-stone-100 pt-3">
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => onCancelBooking(booking.id)}
                            className="bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-500 rounded-lg p-2 transition active:scale-95 cursor-pointer"
                            title="Talebi İptal Et"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        <a 
                          href={`https://wa.me/${AGENCY_DETAILS.whatsapp.replace('+', '')}?text=Merhaba, ${booking.id.slice(0, 8)} nolu ${booking.villaName} rezervasyon talebim hakkında görüşmek istiyorum.`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600 active:scale-95 transition shadow-sm"
                        >
                          <span>Soru Sor</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Notice at bottom */}
          <div className="bg-stone-50 p-6 border-t border-stone-100 text-xs text-stone-500">
            <h5 className="font-bold text-stone-800 mb-1 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              Önemli Bilgilendirme
            </h5>
            <p className="leading-relaxed">
              Talepleriniz ön-rezervasyon niteliğindedir. Temsilcimiz, seçtiğiniz tarihlerde yerin kesin müsaitliğini teyit etmek için 15 dakika içerisinde arayarak veya WhatsApp üzerinden onay verecektir.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
