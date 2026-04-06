const SESSION_KEY = "sharevault_session";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");
const AUTH_BASE_URL = `${API_BASE_URL}/api/auth`;

const normalizeUser = (payload) => payload?.user || payload?.data?.user || payload?.data || null;

const normalizeToken = (payload) =>
  payload?.token ||
  payload?.accessToken ||
  payload?.jwt ||
  payload?.data?.token ||
  payload?.data?.accessToken ||
  payload?.data?.jwt ||
  null;

const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

const readSession = () => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

const request = async (path, body) => {
  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      payload?.message ||
      payload?.error ||
      `Request failed with status ${response.status}`
    );
  }

  return payload;
};

export const authService = {
  async login(email, password) {
    const payload = await request("/login", { email, password });
    const user = normalizeUser(payload);
    const token = normalizeToken(payload);

    if (!user || !token) {
      throw new Error("Login response is missing user or token.");
    }

    const session = { user, token };
    saveSession(session);
    return session;
  },

  async register(name, email, password) {
    const payload = await request("/register", { name, email, password });
    const user = normalizeUser(payload);
    const token = normalizeToken(payload);

    if (user && token) {
      const session = { user, token };
      saveSession(session);
      return session;
    }

    return {
      user,
      token: null,
      message: payload?.message || "Registration successful. Please sign in.",
    };
  },

  async forgotPassword(email) {
    return request("/forgot-password", { email });
  },

  async resetPassword(token, password) {
    return request("/reset-password", { token, password });
  },

  logout() {
    clearSession();
  },

  getSession() {
    return readSession();
  },
};
