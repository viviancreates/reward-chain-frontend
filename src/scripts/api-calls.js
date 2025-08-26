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
import { getUserRewards, createPendingReward, getRewardsByTx } from '../api/rewards';

export async function fetchUserRewards(userId) {
  return await getUserRewards(userId);
}

export async function addPendingReward(transactionId, coinType) {
  return await createPendingReward(transactionId, coinType);
}

export async function fetchRewardsByTransaction(transactionId) {
  return await getRewardsByTx(transactionId);
}