export interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const role = url.searchParams.get('role');
    
    let query = `
      SELECT 
        id, name, tc_no, phone, email, role, avatar_url, created_at
      FROM users
    `;
    let queryParams: any[] = [];
    
    if (role) {
      query += ` WHERE role = ?`;
      queryParams.push(role);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const { results } = await context.env.DB.prepare(query).bind(...queryParams).all();
    
    // For each user, we might want to get their bookings or villas
    // Since D1 doesn't support complex nested queries easily without JSON, we'll do separate queries or a joined approach.
    // For simplicity, we just return the users here. The frontend can query bookings separately.
    // Or we can augment the query with subselects for bookings count and villas count
    const enrichedQuery = `
      SELECT 
        u.*,
        (SELECT count(*) FROM bookings WHERE guest_id = u.id) as booking_count,
        (SELECT count(*) FROM villas WHERE host_id = u.id) as villa_count
      FROM users u
      ${role ? 'WHERE u.role = ?' : ''}
      ORDER BY u.created_at DESC
    `;
    
    const { results: enrichedResults } = await context.env.DB.prepare(enrichedQuery).bind(...queryParams).all();

    return Response.json(enrichedResults);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
    // Basic PUT to update user (e.g. reset password, but since password isn't in DB schema, maybe just update name/role)
    return Response.json({ message: "Not fully implemented" });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    // In a real app we would read the ID from the URL path.
    // Cloudflare Pages Functions paths: /api/users/[id].ts
    // Here we'll just parse the URL to see if there's an ID query param or similar
    return Response.json({ message: "Use /api/users/[id] for DELETE" });
};
