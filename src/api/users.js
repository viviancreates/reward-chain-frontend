import { fetchJSON } from './client';

export function registerUser(user) {
  return fetchJSON('/users/register', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}
