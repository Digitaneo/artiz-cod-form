export function successResponse(data, status = 200, extraHeaders = {}) {
  return Response.json(
    {
      ok: true,
      data
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...extraHeaders
      }
    }
  );
}

export function errorResponse(message, code = "INTERNAL_ERROR", status = 500, extraHeaders = {}) {
  return Response.json(
    {
      ok: false,
      error: message,
      code
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...extraHeaders
      }
    }
  );
}
