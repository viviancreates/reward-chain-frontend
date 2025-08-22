import { fetchJSON } from './client';

// GET /api/transactions/user/{userId}
export function getUserTransactions(userId) {
  return fetchJSON(`/transactions/user/${userId}`);
}

// POST /api/transactions
export function addTransaction({ userId, categoryId, merchant, amount }) {
  return fetchJSON('/transactions', {
    method: 'POST',
    body: JSON.stringify({ userId, categoryId, merchant: merchant?.trim(),
      // send as string to be explicit for BigDecimal on the backend
      amount: String(amount),
    }),
  });
}

// POST /api/transactions/import/plaid
export function importFromPlaid(userId, accessToken) {
  return fetchJSON('/transactions/import/plaid', {
    method: 'POST',
    body: JSON.stringify({ userId, accessToken }),
  });

}
