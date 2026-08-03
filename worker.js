export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return Response.json({ ok: true, service: 'artiz-cod-form-worker' });
    }

    return Response.json({ ok: false, error: 'Route not found' }, { status: 404 });
  }
};
