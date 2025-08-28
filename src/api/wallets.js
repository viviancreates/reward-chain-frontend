// src/api/wallets.js
export async function getUserWallet(userId) {
  const res = await fetch(`/api/users/${userId}/wallet`);
  if (res.status === 404) return null;       // no wallet yet
  if (!res.ok) throw new Error('Failed to fetch wallet');
  return res.json();
}
