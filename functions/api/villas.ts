interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const query = `
      SELECT 
        v.id, v.name, v.type, v.title, v.region, v.capacity, v.bedrooms, v.bathrooms, 
        v.price_per_night as pricePerNight, v.description, v.badge, v.whatsapp_message as whatsappMessage, 
        v.rating, v.review_count as reviewCount, v.min_nights as minNights, v.is_boat as isBoat,
        v.approval_status as approvalStatus, v.featured_categories as featuredCategories, v.host_id as hostId,
        v.is_active as isActive,
        u.name as hostName, u.avatar_url as hostAvatar,
        (SELECT json_group_array(image_url) FROM (SELECT image_url FROM villa_images WHERE villa_id = v.id ORDER BY display_order)) as images,
        (SELECT json_group_array(json_object('id', es.id, 'name', es.name, 'price', es.price, 'type', es.type)) FROM extra_services es WHERE es.villa_id = v.id OR es.villa_id IS NULL) as extraServices
      FROM villas v
      LEFT JOIN users u ON v.host_id = u.id
    `;
    
    const { results } = await context.env.DB.prepare(query).all();

    // D1 json_group_array döndürdüğünde string formatında gelir, onları parse etmemiz lazım.
    const parsedResults = results.map((row: any) => ({
      ...row,
      features: [], // Frontend requires features array
      catFeatures: [], 
      slogans: [],
      featuredCategories: JSON.parse(row.featuredCategories || '[]'),
      images: JSON.parse(row.images || '[]'),
      extraServices: JSON.parse(row.extraServices || '[]'),
      tieredPrices: [],
      isActive: row.isActive !== 0,
      boatDetails: row.isBoat ? {
        boatType: row.boatType || "Katamaran",
        skipper: row.skipper || "Kaptanlı",
        concept: row.concept || "Günlük Koy Gezisi",
        port: row.port || "Marinası"
      } : undefined
    }));

    return Response.json(parsedResults);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const villa: any = await context.request.json();
    const hostId = 'host_' + (villa.hostName || 'unknown').toLowerCase().replace(/\s+/g, '_');

    // 1. Ensure host exists
    await context.env.DB.prepare(
      `INSERT INTO users (id, name, email, phone, role) VALUES (?, ?, ?, ?, 'host') ON CONFLICT(id) DO NOTHING`
    ).bind(hostId, villa.hostName || 'Unknown Host', `${hostId}@example.com`, '05550000000').run();

    // 2. Insert villa
    const isBoat = villa.isBoat ? 1 : 0;
    const featuredCats = villa.featuredCategories ? JSON.stringify(villa.featuredCategories) : '[]';

    await context.env.DB.prepare(`
      INSERT INTO villas (
        id, name, type, title, region, capacity, bedrooms, bathrooms, price_per_night, 
        description, badge, whatsapp_message, rating, review_count, host_id, 
        approval_status, featured_categories, min_nights, is_boat, boat_type, boat_skipper, boat_concept, boat_port, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      villa.id, villa.name, villa.type || 'villa', villa.title || '', villa.region || 'İstanbul',
      villa.capacity || 2, villa.bedrooms || 1, villa.bathrooms || 1, villa.pricePerNight || 0,
      villa.description || '', villa.badge || '', villa.whatsappMessage || '',
      villa.rating || 0, villa.reviewCount || 0, hostId,
      villa.approvalStatus || 'pending', featuredCats, villa.minNights || 1, isBoat,
      villa.boatDetails?.boatType || '', villa.boatDetails?.skipper || '', 
      villa.boatDetails?.concept || '', villa.boatDetails?.port || '',
      villa.isActive !== false ? 1 : 0
    ).run();

    // 3. Insert images
    if (villa.images && Array.isArray(villa.images)) {
      const stmts = villa.images.map((img: string, idx: number) => 
        context.env.DB.prepare(
          `INSERT INTO villa_images (id, villa_id, image_url, category, display_order) VALUES (?, ?, ?, 'vitrin', ?)`
        ).bind(`img_${villa.id}_${idx}`, villa.id, img, idx)
      );
      if (stmts.length > 0) {
        await context.env.DB.batch(stmts);
      }
    }

    return Response.json({ success: true, villa });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};

