import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ImageIcon, Trash2, ExternalLink } from 'lucide-react';
import { Villa } from '../../data';

export default function AdminPictures({ villas }: { villas: Villa[] }) {
  const [images, setImages] = useState<any[]>([]);
  const [displayedImages, setDisplayedImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate mock images list from villas
    const allImages: any[] = [];
    villas.forEach(v => {
      if (v.images && v.images.length > 0) {
        v.images.forEach((imgUrl, index) => {
          allImages.push({
            id: `img_${v.id}_${index}`,
            url: imgUrl,
            villaName: v.title,
            hostName: v.hostName || 'Bilinmiyor'
          });
        });
      }
    });
    setImages(allImages);
    setDisplayedImages(allImages.slice(0, itemsPerPage));
  }, [villas]);

  const loadMore = useCallback(() => {
    const nextItemIndex = page * itemsPerPage;
    if (nextItemIndex < images.length) {
      setDisplayedImages(prev => [...prev, ...images.slice(nextItemIndex, nextItemIndex + itemsPerPage)]);
      setPage(prev => prev + 1);
    }
  }, [page, images]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore]);

  const handleDelete = (id: string) => {
    if (confirm('Bu görseli silmek istediğinize emin misiniz?')) {
      const updatedImages = images.filter(img => img.id !== id);
      setImages(updatedImages);
      setDisplayedImages(updatedImages.slice(0, page * itemsPerPage));
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
      <h3 className="text-base font-bold text-stone-950 mb-4 font-display flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-[#FF385C]" /> Görsel Yönetimi
      </h3>
      <p className="text-[11px] text-stone-500 mb-6">
        Sistemdeki tüm görseller burada listelenir. Sayfayı aşağı kaydırdıkça daha fazla görsel yüklenir.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold w-32">Görsel</th>
              <th className="pb-3 font-semibold">Görsel İlanı</th>
              <th className="pb-3 font-semibold">Ekleyen Ev Sahibi</th>
              <th className="pb-3 font-semibold">Görsel Linki</th>
              <th className="pb-3 font-semibold text-center">Sil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {displayedImages.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-stone-400">Görsel bulunamadı.</td>
              </tr>
            ) : (
              displayedImages.map(img => (
                <tr key={img.id} className="hover:bg-stone-50/50 transition">
                  <td className="py-3">
                    <img src={img.url} alt={img.villaName} className="w-24 h-16 object-cover rounded-lg border border-stone-200" />
                  </td>
                  <td className="py-3 font-bold text-stone-800">
                    {img.villaName}
                  </td>
                  <td className="py-3 font-medium text-stone-600">
                    {img.hostName}
                  </td>
                  <td className="py-3">
                    <a href={img.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 flex items-center gap-1 max-w-[150px] truncate" title={img.url}>
                      <ExternalLink className="h-3 w-3 shrink-0" /> <span className="truncate">{img.url}</span>
                    </a>
                  </td>
                  <td className="py-3 text-center">
                    <button className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Sil" onClick={() => handleDelete(img.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Intersection Observer Target */}
        {displayedImages.length < images.length && (
          <div ref={observerTarget} className="py-4 text-center text-stone-400 text-xs">
            Daha fazla görsel yükleniyor...
          </div>
        )}
      </div>
    </div>
  );
}
