const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getGuestSessionId = (): string => {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("seed_guest_session_id");
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("seed_guest_session_id", sessionId);
  }
  return sessionId;
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("seed_auth_token");
};

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const guestSessionId = getGuestSessionId();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Auto-append guestSessionId to query if not present
  const hasQuery = endpoint.includes("?");
  const separator = hasQuery ? "&" : "?";
  const urlWithGuest = !endpoint.includes("guestSessionId") && guestSessionId
    ? `${API_BASE}${endpoint}${separator}guestSessionId=${guestSessionId}`
    : `${API_BASE}${endpoint}`;

  const response = await fetch(urlWithGuest, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}