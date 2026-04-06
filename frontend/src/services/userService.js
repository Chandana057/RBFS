const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");
const USERS_BASE_URL = `${API_BASE_URL}/api/users`;

const request = async (path = "", options = {}) => {
  const response = await fetch(`${USERS_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
};

export const userService = {
  getAllUsers() {
    return request("/all");
  },

  createUser({ name, email, password, role }) {
    return request("", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  updateUserRole(id, role) {
    return request(`/${id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  },

  deleteUser(id) {
    return request(`/${id}`, {
      method: "DELETE",
    });
  },
};
