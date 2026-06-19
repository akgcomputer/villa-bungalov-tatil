import { Env } from '../campaigns';

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { id } = context.params;
  try {
    const campaign: any = await context.request.json();
    
    await context.env.DB.prepare(`
      UPDATE campaigns 
      SET name = COALESCE(?, name),
          code = COALESCE(?, code),
          discount_type = COALESCE(?, discount_type),
          discount_value = COALESCE(?, discount_value),
          target_villa_id = COALESCE(?, target_villa_id),
          is_active = COALESCE(?, is_active),
          start_date = COALESCE(?, start_date),
          end_date = COALESCE(?, end_date)
      WHERE id = ?
    `).bind(
      campaign.name || null,
      campaign.code || null,
      campaign.discountType || null,
      campaign.discountValue || null,
      campaign.targetVillaId || null,
      campaign.isActive !== undefined ? (campaign.isActive ? 1 : 0) : null,
      campaign.startDate || null,
      campaign.endDate || null,
      id
    ).run();

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { id } = context.params;
  try {
    await context.env.DB.prepare(`DELETE FROM campaigns WHERE id = ?`).bind(id).run();
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
