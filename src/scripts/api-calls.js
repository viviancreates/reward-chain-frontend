// src/scripts/api-calls.js
import { getAllCategories, createCategory, renameCategory, deleteCategory } from '../api/categories';

// ---- Categories (simple facade that pages import) ----
export async function fetchCategories() {
  return await getAllCategories();
}

export async function addCategory(name) {
  return await createCategory(name, 0);
}

export async function updateCategoryName(id, name) {
  return await renameCategory(id, name);
}

export async function removeCategory(id) {
  return await deleteCategory(id);
}

// ---- Transactions (simple facade that pages import) ----
import { getUserTransactions, addTransaction /*, importFromPlaid */ } from '../api/transactions';
export async function fetchUserTransactions(userId) { return await getUserTransactions(userId); }
export async function createTransaction(tx) { return await addTransaction(tx); }



// ---- Rules (simple facade that pages import) ----
import { getUserRules, replaceUserRules } from '../api/userCategoryRules';

export async function fetchUserRules(userId) {
  return await getUserRules(userId);
}

export async function saveUserRules(userId, rules) {
  // rules: [{ categoryId, percent }]
  return await replaceUserRules(userId, rules);
}

// ---- Rewards (simple facade that pages import) ----
import { createPendingReward, getRewardsByTx } from '../api/rewards';


export async function fetchUserRewards(userId, live = true) {
  const url = `/api/rewards/user/${userId}${live ? '?live=true' : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch rewards');
  return res.json();
}

export async function addPendingReward(transactionId, coinType) {
  return await createPendingReward(transactionId, coinType);
}

export async function fetchRewardsByTransaction(transactionId) {
  return await getRewardsByTx(transactionId);
}

// add at top with other imports
import { getUserWallet } from '../api/wallets';

// add this export
export async function fetchUserWallet(userId) {
  return await getUserWallet(userId);
}

// --- Rewards: complete (mock) ---
export async function completeReward(rewardId) {
  const res = await fetch(`/api/rewards/${rewardId}/complete`, { method: 'POST' });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `Failed to complete reward #${rewardId}`);
  }
  return res.json(); // returns the updated Rewards object (status COMPLETED + tx hash)
}

