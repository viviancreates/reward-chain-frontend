// src/api/rewards.js
import { fetchJSON } from './client';

export const getUserRewards = (userId) =>
  fetchJSON(`/rewards/user/${userId}`);

export const createPendingReward = (transactionId, coinType) =>
  fetchJSON(`/rewards/pending`, {
    method: 'POST',
    body: JSON.stringify({ transactionId, coinType })
  });

// optional if you add the endpoint:
export const getRewardsByTx = (transactionId) =>
  fetchJSON(`/rewards/tx/${transactionId}`);
