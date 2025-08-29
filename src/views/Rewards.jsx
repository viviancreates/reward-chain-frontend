import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { fetchUserRewards, fetchUserTransactions, fetchCategories } from '../scripts/api-calls';
import { completeReward } from '../scripts/api-calls';
import { StatusMessage, RewardDetailsModal, RewardsByTransactionTable } from '../components';

export default function Rewards() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');

  const [rewards, setRewards] = useState([]);
  const [txs, setTxs] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [selected, setSelected] = useState(null);

  async function loadAll() {
    setError(null); setSuccess(null); setLoading(true);
    try {
      const [rw, t, c] = await Promise.all([
        fetchUserRewards(auth.userId, true),   // live price override
        fetchUserTransactions(auth.userId),
        fetchCategories(),
      ]);
      setRewards(rw || []);
      setTxs(t || []);
      setCats(c || []);
    } catch (e) {
      setError(e.message || 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.userId]);

  const catMap = useMemo(
    () => new Map((cats || []).map(x => [String(x.categoryId), x.categoryName])),
    [cats]
  );
  const txMap = useMemo(
    () => new Map((txs || []).map(t => [t.transactionId, t])),
    [txs]
  );

  // Group rewards by transactionId
  const perTx = useMemo(() => {
    const map = new Map();
    for (const r of rewards) {
      const t = txMap.get(r.transactionId);
      const txCatId = t?.categoryId != null ? String(t.categoryId) : null;
      const category =
        t?.categoryName ??
        (txCatId ? catMap.get(txCatId) : undefined) ??
        (txCatId ?? '—');

      const key = r.transactionId;
      if (!map.has(key)) {
        map.set(key, {
          transactionId: key,
          merchant: t?.merchant ?? '—',
          txDate: t?.transactionDate ?? null,
          category,
          amount: t?.amount ?? 0,
          rewardPercentage: r.rewardPercentage,
          coins: [],
          totalRewardUsd: 0,
        });
      }
      const bucket = map.get(key);
      bucket.coins.push(r);
      bucket.totalRewardUsd += Number(r.rewardAmountUsd || 0);
    }
    // newest first by tx date (fallback to id)
    return [...map.values()].sort((a, b) => {
      if (a.txDate && b.txDate) return new Date(b.txDate) - new Date(a.txDate);
      return b.transactionId - a.transactionId;
    });
  }, [rewards, txMap, catMap]);

  // --- NEW: payout handler for one coin ---
  async function handlePayout(coinReward) {
    try {
      setError(null);
      const updated = await completeReward(coinReward.rewardId); // calls mock, returns with tx hash
      setSuccess(`Payout sent: ${updated.transactionHash}`);

      // reload data and re-select the same transaction so the modal reflects the new status
      await loadAll();
      // rebuild the selected tx from fresh data
      const again = perTx.find(x => x.transactionId === updated.transactionId);
      setSelected(again || null);
    } catch (e) {
      setError(e.message || 'Payout failed');
    }
  }

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Deposits</h3>
      <StatusMessage error={error} success={success} />
      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : perTx.length === 0 ? (
        <Alert variant="info">No deposits yet.</Alert>
      ) : (
        <>
          <RewardsByTransactionTable rows={perTx} onDetails={setSelected} />
          <RewardDetailsModal show={!!selected} onHide={() => setSelected(null)} tx={selected} onPayout={handlePayout} />
        </>
      )}
    </div>
  );
}
