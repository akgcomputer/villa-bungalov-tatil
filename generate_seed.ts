import * as fs from 'fs';
import { VILLA_DATA, Villa } from './src/data.js'; // js uzantısı TSX tarafından çözülecek

const sqlLines: string[] = [];
sqlLines.push('-- OTO OLUŞTURULMUŞ SEED DATASI');

const hosts = new Map<string, any>();
const extraServicesMap = new Map<string, any>();

// Benzersiz Hostları Çıkar
VILLA_DATA.forEach(villa => {
  const hostId = 'host_' + villa.hostName.toLowerCase().replace(/\s+/g, '_');
  if (!hosts.has(hostId)) {
    hosts.set(hostId, {
      id: hostId,
      name: villa.hostName,
      email: `${hostId}@example.com`,
      phone: '05550000000',
      role: 'host',
      avatar: villa.hostAvatar
    });
  }

  // Extra Services
  if (villa.extraServices && villa.extraServices.length > 0) {
    villa.extraServices.forEach(s => {
      extraServicesMap.set(s.id, s);
    });
  }
});

// USERS INSERT
sqlLines.push('-- USERS');
hosts.forEach(h => {
  sqlLines.push(`INSERT INTO users (id, name, email, phone, role, avatar_url) VALUES ('${h.id}', '${h.name.replace(/'/g, "''")}', '${h.email}', '${h.phone}', '${h.role}', '${h.avatar}');`);
});

// EXTRA SERVICES (Genel)
sqlLines.push('-- EXTRA SERVICES');
extraServicesMap.forEach(s => {
  sqlLines.push(`INSERT INTO extra_services (id, name, price, type) VALUES ('${s.id}', '${s.name.replace(/'/g, "''")}', ${s.price}, '${s.type}') ON CONFLICT DO NOTHING;`);
});

// VILLAS
sqlLines.push('-- VILLAS');
VILLA_DATA.forEach(villa => {
  const hostId = 'host_' + villa.hostName.toLowerCase().replace(/\s+/g, '_');
  const isBoat = villa.isBoat ? 1 : 0;
  const featuredCategoriesJSON = villa.featuredCategories ? JSON.stringify(villa.featuredCategories) : '[]';

  sqlLines.push(`INSERT INTO villas (id, name, type, title, region, capacity, bedrooms, bathrooms, price_per_night, description, badge, whatsapp_message, rating, review_count, host_id, approval_status, featured_categories, min_nights, is_boat, boat_type, boat_skipper, boat_concept, boat_port) 
  VALUES ('${villa.id}', '${villa.name.replace(/'/g, "''")}', '${villa.type}', '${villa.title.replace(/'/g, "''")}', '${villa.region}', ${villa.capacity}, ${villa.bedrooms}, ${villa.bathrooms}, ${villa.pricePerNight}, '${villa.description.replace(/'/g, "''")}', '${villa.badge || ''}', '${villa.whatsappMessage.replace(/'/g, "''")}', ${villa.rating}, ${villa.reviewCount}, '${hostId}', 'approved', '${featuredCategoriesJSON.replace(/'/g, "''")}', ${villa.minNights}, ${isBoat}, '${villa.boatDetails?.boatType || ''}', '${villa.boatDetails?.skipper || ''}', '${villa.boatDetails?.concept || ''}', '${villa.boatDetails?.port || ''}');`);

  // IMAGES
  if (villa.images && villa.images.length > 0) {
    villa.images.forEach((img, idx) => {
      const imgId = `img_${villa.id}_${idx}`;
      sqlLines.push(`INSERT INTO villa_images (id, villa_id, image_url, category, display_order) VALUES ('${imgId}', '${villa.id}', '${img}', 'vitrin', ${idx});`);
    });
  }
});

fs.writeFileSync('seed.sql', sqlLines.join('\n'));
console.log('✅ seed.sql başarıyla oluşturuldu! Toplam sorgu sayısı:', sqlLines.length);
