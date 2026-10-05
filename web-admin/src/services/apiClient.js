const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function apiFetch(endpoint, options = {}) {
  const token =
    localStorage.getItem("resqnow_token") ||
    sessionStorage.getItem("resqnow_token");

  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Siguraduhing may slash ang endpoint
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${baseURL}${normalizedEndpoint}`, config);

  // Kapag expired na ang token o unauthorized
  if (response.status === 401) {
    localStorage.removeItem("resqnow_token");
    localStorage.removeItem("resqnow_user");
    sessionStorage.removeItem("resqnow_token");
    sessionStorage.removeItem("resqnow_user");
  }

  return response;
}
