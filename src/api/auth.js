import { fetchJSON } from './client';

// POST /api/users/register
export function registerUser(user) {
  return fetchJSON('/users/register', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

// POST /api/auth/login  (adjust to your backend when you add it)
export function loginUser({ email, password }) {
  return fetchJSON('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
