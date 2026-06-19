import { Env } from '../images';

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { id } = context.params;
  try {
    // Note: If image is deleted from DB, it's also probably good to delete from R2 or where it's stored, 
    // but here we just delete the database record.
    await context.env.DB.prepare(`DELETE FROM villa_images WHERE id = ?`).bind(id).run();
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
