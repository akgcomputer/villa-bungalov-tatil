import React, { useState, useEffect } from 'react';
import { UserCheck, Edit2, Trash2, KeyRound } from 'lucide-react';
import { Villa } from '../../data';

export default function AdminHosts({ villas, bookings }: { villas: Villa[], bookings: any[] }) {
  const [hosts, setHosts] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock hosts from villas
    const uniqueHosts = new Map();
    villas.forEach(v => {
      if (v.hostName && !uniqueHosts.has(v.hostName)) {
        const hostVillas = villas.filter(villa => villa.hostName === v.hostName);
        const hostVillaIds = hostVillas.map(villa => villa.id);
        const hostBookings = bookings.filter(b => hostVillaIds.includes(b.villaId) && b.status === 'pending');
        
        uniqueHosts.set(v.hostName, {
          id: v.hostId || 'hst_' + Math.random().toString(36).substr(2, 9),
          name: v.hostName,
          villaCount: hostVillas.length,
          pendingBookings: hostBookings.length
        });
      }
    });
    setHosts(Array.from(uniqueHosts.values()));
  }, [villas, bookings]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
      <h3 className="text-base font-bold text-stone-950 mb-4 font-display flex items-center gap-2">
        <UserCheck className="h-5 w-5 text-emerald-500" /> Ev Sahipleri Yönetimi
      </h3>
      
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Ev Sahibi Adı</th>
              <th className="pb-3 font-semibold text-center">Evler</th>
              <th className="pb-3 font-semibold text-center">Bekleyen Rzv.</th>
              <th className="pb-3 font-semibold text-center">Şifreyi Sıfırla</th>
              <th className="pb-3 font-semibold text-center">Düzenle</th>
              <th className="pb-3 font-semibold text-center">Sil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {hosts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-400">Kayıtlı ev sahibi bulunamadı.</td>
              </tr>
            ) : (
              hosts.map(h => (
                <tr key={h.id} className="hover:bg-stone-50/50 transition">
                  <td className="py-3 font-bold text-stone-800">
                    {h.name}
                  </td>
                  <td className="py-3 text-center font-mono font-medium">
                    {h.villaCount}
                  </td>
                  <td className="py-3 text-center font-mono font-medium text-amber-600">
                    {h.pendingBookings}
                  </td>
                  <td className="py-3 text-center">
                    <button className="p-1.5 text-stone-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition" title="Şifre Sıfırla" onClick={() => alert('Şifre sıfırlama bağlantısı gönderildi.')}>
                      <KeyRound className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="py-3 text-center">
                    <button className="p-1.5 text-stone-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition" title="Düzenle">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="py-3 text-center">
                    <button className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Sil" onClick={() => setHosts(hosts.filter(x => x.id !== h.id))}>
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
