import React, { useState } from 'react';
import { BadgeAlert, Edit2, Trash2, Plus, Percent, Tag } from 'lucide-react';
import { Villa } from '../../data';

export default function AdminCampaigns({ villas }: { villas: Villa[] }) {
  const [campaigns, setCampaigns] = useState<any[]>([
    { id: '1', name: 'Yaz Fırsatı', code: 'YAZ10', discountType: 'percentage', discountValue: 10, isActive: true },
    { id: '2', name: 'Hoşgeldin İndirimi', code: 'MERHABA500', discountType: 'fixed', discountValue: 500, isActive: false }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('Kampanyayı silmek istediğinize emin misiniz?')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-stone-950 font-display flex items-center gap-2">
          <BadgeAlert className="h-5 w-5 text-amber-500" /> Kampanyalar ve Kuponlar
        </h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-600 transition flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Yeni Kampanya
        </button>
      </div>

      {showAddForm && (
        <div className="bg-stone-50 p-4 rounded-2xl mb-6 border border-stone-200">
          <h4 className="text-sm font-bold text-stone-800 mb-3">Yeni Kampanya Oluştur</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Kampanya Adı</label>
              <input type="text" className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs" placeholder="Örn: Kış İndirimi" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Kupon Kodu</label>
              <input type="text" className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs" placeholder="Örn: KIS15" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">İndirim Türü</label>
              <select className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs">
                <option value="percentage">% Yüzde</option>
                <option value="fixed">₺ Tutar</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">İndirim Değeri</label>
              <input type="number" className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs" placeholder="Örn: 15 veya 500" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-stone-800 transition" onClick={() => setShowAddForm(false)}>
              Kaydet
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Kampanya Adı</th>
              <th className="pb-3 font-semibold">Kupon Kodu</th>
              <th className="pb-3 font-semibold">İndirim</th>
              <th className="pb-3 font-semibold text-center">Durum</th>
              <th className="pb-3 font-semibold text-center">Düzenle</th>
              <th className="pb-3 font-semibold text-center">Sil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-400">Aktif kampanya bulunamadı.</td>
              </tr>
            ) : (
              campaigns.map(c => (
                <tr key={c.id} className="hover:bg-stone-50/50 transition">
                  <td className="py-3 font-bold text-stone-800">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-stone-400" /> {c.name}
                    </div>
                  </td>
                  <td className="py-3 font-mono font-bold text-blue-600">
                    {c.code}
                  </td>
                  <td className="py-3 font-medium">
                    {c.discountType === 'percentage' ? (
                      <span className="flex items-center gap-1 text-emerald-600"><Percent className="h-3 w-3" /> {c.discountValue}</span>
                    ) : (
                      <span className="text-emerald-600">₺{c.discountValue}</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {c.isActive ? (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold">Aktif</span>
                    ) : (
                      <span className="bg-stone-100 text-stone-500 px-2 py-1 rounded text-[10px] font-bold">Pasif</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    <button className="p-1.5 text-stone-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition" title="Düzenle">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="py-3 text-center">
                    <button className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Sil" onClick={() => handleDelete(c.id)}>
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
