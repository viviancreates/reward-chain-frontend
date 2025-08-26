const BASE = import.meta.env.VITE_API_BASE || '/api';

function getToken() {
  try {
    const auth = JSON.parse(localStorage.getItem('auth') || 'null');
    return auth?.token || null;
  } catch {
    return null;
  }
}

export async function fetchJSON(path, opts = {}) {
  const url = `${BASE}${path.startsWith('/') ? path : `/${path}`}`;

  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res;
  try {
    res = await fetch(url, { ...opts, headers });
  } catch (networkErr) {
    throw new Error('Network error — check your connection or server is running');
  }

  const text = await res.text();
  const data = text ? safeParseJSON(text) : null;

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
