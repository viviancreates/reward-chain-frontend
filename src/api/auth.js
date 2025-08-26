import { fetchJSON } from './client';

export function registerUser(user) {
  return fetchJSON('/users/register', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

export function login(email, password) {
  return fetchJSON('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
