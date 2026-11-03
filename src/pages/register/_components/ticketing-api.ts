// Base URL of the ticketing backend (orders, Paystack initialize/verify).
// Same server the ODS-Registration app uses; override with VITE_TICKETING_API_URL if needed.
export const apiBaseUrl: string = (
  import.meta.env.VITE_TICKETING_API_URL || 'https://ods2025.onrender.com/api'
).replace(/\/$/, '');

export async function apiRequest<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('Registration is not configured yet. Please contact the event organiser.');
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
  } catch {
    throw new Error('Network error. Please check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status}).`);
  }
  return data as T;
}
