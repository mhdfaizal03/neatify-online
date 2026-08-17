const TOKEN_KEY = "neatify-token";
const USER_KEY  = "neatify-user";

let session = { token: "", user: null };
try {
  session.token = localStorage.getItem(TOKEN_KEY) || "";
  session.user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
} catch { /* storage unavailable */ }

export const getSession = () => session;

export const setSession = (token, user) => {
  session.token = token;
  session.user = user;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch { /* storage unavailable */ }
};

export const clearSession = () => {
  session.token = "";
  session.user = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch { /* storage unavailable */ }
};

const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (session.token && !headers.Authorization) headers.Authorization = `Bearer ${session.token}`;
  
  if (opts.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const res = await fetch(BASE_URL + path, { ...opts, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    if (res.status === 401) {
       clearSession();
       // optionally throw specific auth error
    }
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export const money = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

export const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "—";
