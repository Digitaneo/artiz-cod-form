export async function healthRoute(request, env) {
  return Response.json({ ok: true, service: 'artiz-cod-form-worker' });
}
