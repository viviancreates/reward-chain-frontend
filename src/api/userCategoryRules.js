import { fetchJSON } from './client';

export const getUserRules = (userId) =>
  fetchJSON(`/user-category-rules/${userId}`);

export const replaceUserRules = (userId, rules) =>
  fetchJSON(`/user-category-rules/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(rules),
  });
