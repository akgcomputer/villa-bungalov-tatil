import React, { useState, useEffect } from 'react';
import { Users, Search, Edit2, Trash2, KeyRound } from 'lucide-react';

export default function AdminUsers({ bookings }: { bookings: any[] }) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock users from bookings
    const uniqueUsers = new Map();
    bookings.forEach(b => {
      if (b.guestName && !uniqueUsers.has(b.guestName)) {
        uniqueUsers.set(b.guestName, {
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          name: b.guestName,
          phone: b.guestPhone || 'Belirtilmemiş',
          reservationCount: bookings.filter(bk => bk.guestName === b.guestName).length
        });
      }
    });
    setUsers(Array.from(uniqueUsers.values()));
  }, [bookings]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
      <h3 className="text-base font-bold text-stone-950 mb-4 font-display flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-500" /> Sistem Kullanıcıları
      </h3>
      
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Kullanıcı Adı</th>
              <th className="pb-3 font-semibold text-center">Rezervasyonları</th>
              <th className="pb-3 font-semibold text-center">Şifreyi Sıfırla</th>
              <th className="pb-3 font-semibold text-center">Düzenle</th>
              <th className="pb-3 font-semibold text-center">Sil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-stone-400">Kayıtlı kullanıcı bulunamadı.</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="hover:bg-stone-50/50 transition">
                  <td className="py-3 font-bold text-stone-800">
                    {u.name}
                    <span className="block text-[10px] text-stone-400 font-normal mt-0.5">{u.phone}</span>
                  </td>
                  <td className="py-3 text-center font-mono font-medium">
                    {u.reservationCount}
                  </td>
                  <td className="py-3 text-center">
                    <button className="p-1.5 text-stone-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition" title="Şifre Sıfırla" onClick={() => alert('Şifre sıfırlama bağlantısı gönderildi.')}>
                      <KeyRound className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="py-3 text-center">
                    <button className="p-1.5 text-stone-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Düzenle">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="py-3 text-center">
                    <button className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Sil" onClick={() => setUsers(users.filter(x => x.id !== u.id))}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
