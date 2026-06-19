export interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const limit = url.searchParams.get('limit') || '50';
    const offset = url.searchParams.get('offset') || '0';
    
    // Get images with villa information and host information
    const query = `
      SELECT 
        i.id, i.image_url, i.category, i.created_at,
        v.id as villa_id, v.title as villa_title,
        u.id as host_id, u.name as host_name
      FROM villa_images i
      LEFT JOIN villas v ON i.villa_id = v.id
      LEFT JOIN users u ON v.host_id = u.id
      ORDER BY i.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const { results } = await context.env.DB.prepare(query).bind(Number(limit), Number(offset)).all();

    return Response.json(results);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
