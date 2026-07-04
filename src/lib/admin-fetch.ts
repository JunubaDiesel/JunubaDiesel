/** Fetch helper for /admin pages — reuses browser Basic Auth from middleware. */
export function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: "same-origin",
  });
}
