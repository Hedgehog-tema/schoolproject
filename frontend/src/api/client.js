const BASE = "/api";

function getToken() {
  return localStorage.getItem("taija_token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message = data?.error || "Jotain meni pieleen. Yritä uudelleen.";
    throw new Error(message);
  }

  return data;
}

export const api = {
  // auth
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: () => request("/auth/me", { auth: true }),
  updateMe: (payload) => request("/auth/me", { method: "PATCH", body: payload, auth: true }),

  // content
  getBooks: () => request("/books"),
  getBook: (slug) => request(`/books/${slug}`),
  getGallery: () => request("/gallery"),
  getBlogPosts: () => request("/blog"),
  getBlogPost: (slug) => request(`/blog/${slug}`),

  // materials
  getMaterials: (loggedIn) => request("/materials", { auth: loggedIn }),
  saveMaterial: (id) => request(`/materials/${id}/save`, { method: "POST", auth: true }),
  unsaveMaterial: (id) => request(`/materials/${id}/save`, { method: "DELETE", auth: true }),

  // orders
  createOrder: (payload, loggedIn) =>
    request("/orders", { method: "POST", body: payload, auth: loggedIn }),
  getMyOrders: () => request("/orders/mine", { auth: true }),

  // newsletter
  subscribeNewsletter: (email, loggedIn) =>
    request("/newsletter", { method: "POST", body: { email }, auth: loggedIn }),
};

export { getToken };
