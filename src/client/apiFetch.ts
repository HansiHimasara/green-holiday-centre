/** Normalize API network errors for the existing form error/message handlers. Never retry a mutation. */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    const response = await globalThis.fetch(input, init);
    if (!response.ok && !(response.headers.get("content-type") || "").includes("application/json")) {
      return Response.json({ error: "The service is temporarily unavailable. Please try again." }, { status: response.status });
    }
    return response;
  } catch {
    return Response.json({ error: "Unable to connect. Please check your internet connection and try again." }, { status: 503 });
  }
}
