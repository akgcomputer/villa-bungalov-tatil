import { Env } from '../users';

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { id } = context.params;
  try {
    const data: any = await context.request.json();
    
    if (data.action === 'reset_password') {
      // In a real system, you would hash the password and store it.
      // Since this DB schema doesn't have a password field, we simulate success.
      return Response.json({ success: true, message: 'Password reset' });
    }
    
    // Example: update role or name
    if (data.role || data.name) {
      await context.env.DB.prepare(
        `UPDATE users SET name = COALESCE(?, name), role = COALESCE(?, role) WHERE id = ?`
      ).bind(data.name || null, data.role || null, id).run();
      return Response.json({ success: true });
    }

    return Response.json({ success: false, message: "No valid action provided" });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { id } = context.params;
  try {
    // Delete user. DB constraints (RESTRICT/CASCADE) might block or cascade deletes
    await context.env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(id).run();
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
