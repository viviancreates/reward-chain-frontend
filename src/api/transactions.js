import { fetchJSON } from './client';

// GET /api/transactions/user/{userId}
export function getUserTransactions(userId) {
  return fetchJSON(`/transactions/user/${userId}`);
}

// POST /api/transactions
export function addTransaction({ userId, categoryId, merchant, amount }) {
  return fetchJSON('/transactions', {
    method: 'POST',
    body: JSON.stringify({ userId, categoryId, merchant, amount }),
  });
}
