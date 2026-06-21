import fs from 'fs';
import { villalar } from './villalar.js';

const typeMapping = {
  'bungalov': 'bungalow',
  'ev': 'mansion',
  'agac-ev': 'chalet',
  'villa': 'villa'
};

const mapFeatures = (v) => {
  const f = [];
  if (v.oneCikanSunduklar.mutfak) f.push('kitchen');
  if (v.oneCikanSunduklar.wifi) f.push('wifi');
  if (v.oneCikanSunduklar.klima) f.push('air_conditioning');
  if (v.oneCikanSunduklar.ozelJakuzi) f.push('jacuzzi');
  
  const text = (v.onemliOzellikler.join(" ") + " " + v.aciklama).toLowerCase();
  if (text.includes('havuz')) f.push('heated_pool');
  if (text.includes('şömine')) f.push('fireplace');
  if (text.includes('göl')) f.push('lake_view');
  if (text.includes('bahçe')) f.push('garden');
  if (text.includes('barbekü')) f.push('barbeque');

  return [...new Set(f)]; // unique
};

const newVillas = villalar.map(v => {
  return {
    id: v.slug,
    name: v.slug.replace(/-/g, ' '),
    type: typeMapping[v.tip] || 'villa',
    title: v.baslik,
    region: v.konum.sehir, // or ilce? sehir is better based on the array
    capacity: v.ozetBilgiler.misafir,
    bedrooms: v.ozetBilgiler.yatakOdasi,
    bathrooms: v.ozetBilgiler.banyo,
    pricePerNight: v.fiyat.gecelik,
    features: mapFeatures(v),
    images: v.resimler,
    description: v.aciklama,
    whatsappMessage: `Merhaba! Web sitenizden ${v.baslik} için bilgi/rezervasyon talep etmek istiyorum.`,
    rating: v.puan.ortalama,
    reviewCount: v.puan.degerlendirmeSayisi,
    hostName: v.evSahibi.isim,
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', // placeholder
    minNights: v.minGece,
    extraServices: []
  };
});

const tsString = newVillas.map(v => JSON.stringify(v, null, 2)).join(',\n');
fs.writeFileSync('output_villas.json', tsString);
console.log('Done!');
