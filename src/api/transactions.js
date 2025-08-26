import { fetchJSON } from './client';

export function getUserTransactions(userId) {
  return fetchJSON(`/transactions/user/${userId}`);
}

export function addTransaction({ userId, categoryId, merchant, amount }) {
  return fetchJSON('/transactions', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      categoryId,
      merchant: merchant?.trim(),
      amount: String(amount),
    }),
  });
}

export function importFromPlaid(userId, accessToken) {
  return fetchJSON('/transactions/import/plaid', {
    method: 'POST',
    body: JSON.stringify({ userId, accessToken }),
  });
}
