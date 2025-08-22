import { fetchJSON } from './client';

// GET /api/user-category-rules/{userId}
export const getUserRules = (userId) =>
  fetchJSON(`/user-category-rules/${userId}`);

// PUT /api/user-category-rules/{userId}  body: [{categoryId, percent}]
export const replaceUserRules = (userId, rules) =>
  fetchJSON(`/user-category-rules/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(rules),
  });
