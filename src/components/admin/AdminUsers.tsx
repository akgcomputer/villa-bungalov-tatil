import React, { useState } from 'react';
import { Users, PlusCircle, Edit2, Trash2, KeyRound, CheckCircle2, XCircle, X } from 'lucide-react';
import { User } from '../../data';

interface AdminUsersProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function AdminUsers({ users, setUsers }: AdminUsersProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'host' as User['role'],
    status: 'active' as User['status']
  });

  const saveState = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('airbnb_users', JSON.stringify(newUsers));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updated = users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u);
      saveState(updated);
    } else {
      const newUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        createdAt: new Date().toISOString()
      };
      saveState([...users, newUser]);
    }
    setShowAddModal(false);
    setEditingUser(null);
  };

  const handleEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      status: u.status
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu kullanıcıyı tamamen silmek istediğinize emin misiniz?')) {
      saveState(users.filter(u => u.id !== id));
    }
  };

  const roleLabels = {
    admin: 'Sistem Yöneticisi',
    host: 'Ev Sahibi',
    subhost: 'Alt Ev Sahibi'
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-stone-950 font-display flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" /> Sistem Kullanıcıları
        </h3>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: '', email: '', phone: '', role: 'host', status: 'active' });
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" /> Yeni Kullanıcı
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Kullanıcı Adı</th>
              <th className="pb-3 font-semibold">İletişim</th>
              <th className="pb-3 font-semibold text-center">Rol</th>
              <th className="pb-3 font-semibold text-center">Durum</th>
              <th className="pb-3 font-semibold text-center">İşlemler</th>
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
                    <span className="block text-[9px] text-stone-400 font-normal mt-0.5 font-mono">{u.id}</span>
                  </td>
                  <td className="py-3">
                    <div className="font-medium text-stone-700">{u.email}</div>
                    <div className="text-[10px] text-stone-500">{u.phone}</div>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-1 inline-flex rounded-md text-[10px] font-bold ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'host' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${
                      u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {u.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {u.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 text-stone-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition cursor-pointer" title="Şifre Sıfırla" onClick={() => alert('Şifre sıfırlama bağlantısı gönderildi.')}>
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-stone-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition cursor-pointer" title="Düzenle" onClick={() => handleEdit(u)}>
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer" title="Sil" onClick={() => handleDelete(u.id)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-stone-100">
              <h2 className="text-sm font-black text-stone-800">
                {editingUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 bg-stone-100 text-stone-500 hover:bg-stone-200 rounded-full transition cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Ad Soyad</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">E-posta</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Telefon</label>
                  <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Rol</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="host">Ev Sahibi</option>
                    <option value="subhost">Alt Ev Sahibi</option>
                    <option value="admin">Sistem Yöneticisi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Durum</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="active">Aktif</option>
                    <option value="suspended">Pasif</option>
                  </select>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-stone-100 flex justify-end gap-2 bg-stone-50">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-stone-500 hover:bg-stone-200 rounded-xl transition cursor-pointer">İptal</button>
              <button form="user-form" type="submit" className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition cursor-pointer">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
