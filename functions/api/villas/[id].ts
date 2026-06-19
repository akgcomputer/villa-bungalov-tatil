interface Env {
  DB: D1Database;
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    const updateData: any = await context.request.json();

    const updates: string[] = [];
    const values: any[] = [];

    if (updateData.approvalStatus !== undefined) {
      updates.push('approval_status = ?');
      values.push(updateData.approvalStatus);
    }

    if (updateData.featuredCategories !== undefined) {
      updates.push('featured_categories = ?');
      values.push(JSON.stringify(updateData.featuredCategories));
    }

    if (updateData.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(updateData.isActive ? 1 : 0);
    }

    if (updates.length === 0) {
      return Response.json({ success: true, message: "No updates provided" });
    }

    values.push(id);

    await context.env.DB.prepare(`
      UPDATE villas SET ${updates.join(', ')} WHERE id = ?
    `).bind(...values).run();

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    await context.env.DB.prepare(`DELETE FROM villa_images WHERE villa_id = ?`).bind(id).run();
    await context.env.DB.prepare(`DELETE FROM extra_services WHERE villa_id = ?`).bind(id).run();
    await context.env.DB.prepare(`DELETE FROM villas WHERE id = ?`).bind(id).run();
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
