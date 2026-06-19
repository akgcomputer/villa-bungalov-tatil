export interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const query = `
      SELECT 
        c.id, c.name, c.code, c.discount_type as discountType, c.discount_value as discountValue,
        c.target_villa_id as targetVillaId, c.is_active as isActive, c.start_date as startDate,
        c.end_date as endDate, c.created_at,
        v.title as targetVillaName
      FROM campaigns c
      LEFT JOIN villas v ON c.target_villa_id = v.id
      ORDER BY c.created_at DESC
    `;
    
    const { results } = await context.env.DB.prepare(query).all();

    // Map to camelCase properties for frontend if needed
    const mapped = results.map((r: any) => ({
      ...r,
      isActive: r.isActive === 1
    }));

    return Response.json(mapped);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const campaign: any = await context.request.json();
    const id = campaign.id || 'camp_' + Date.now();
    
    await context.env.DB.prepare(`
      INSERT INTO campaigns (id, name, code, discount_type, discount_value, target_villa_id, is_active, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, campaign.name, campaign.code, campaign.discountType || 'percentage',
      campaign.discountValue || 0, campaign.targetVillaId || null,
      campaign.isActive !== false ? 1 : 0, campaign.startDate || null, campaign.endDate || null
    ).run();

    return Response.json({ success: true, id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
