// src/views/Analytics.jsx
import { useEffect, useMemo, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { getUserTransactions } from '../api/transactions';
import { getUserRewards } from '../api/rewards';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Analytics() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  const [txs, setTxs] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!auth) return;
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const [txList, rwList] = await Promise.all([
          getUserTransactions(auth.userId),
          getUserRewards(auth.userId),
        ]);
        if (!ignore) {
          setTxs(txList || []);
          setRewards(rwList || []);
        }
      } catch (e) {
        if (!ignore) setErr(e.message || 'Failed to load analytics');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [auth?.userId]);

  // ---------- Spend (from transactions) ----------
  const spendByCategory = useMemo(() => {
    const m = new Map();
    for (const t of txs) {
      const key = t.categoryName ?? `Category #${t.categoryId}`;
      const amt = Number(t.amount) || 0;
      m.set(key, (m.get(key) || 0) + amt);
    }
    return m;
  }, [txs]);

  const spendLabels = [...spendByCategory.keys()];
  const spendValues = [...spendByCategory.values()];
  const spendPieData = { labels: spendLabels, datasets: [{ data: spendValues }] };

  // ---------- Rewards (join rewards -> transaction -> category) ----------
  const txIdToCategory = useMemo(() => {
    const map = new Map();
    for (const t of txs) {
      map.set(t.transactionId, t.categoryName ?? `Category #${t.categoryId}`);
    }
    return map;
  }, [txs]);

  // Rewards by coin (USD)
  const rewardsByCoin = useMemo(() => {
    const m = new Map();
    for (const r of rewards) {
      const key = r.coinType || 'UNKNOWN';
      m.set(key, (m.get(key) || 0) + Number(r.rewardAmountUsd || 0));
    }
    return m;
  }, [rewards]);
  const coinLabels = [...rewardsByCoin.keys()];
  const coinValues = [...rewardsByCoin.values()];
  const coinPieData = { labels: coinLabels, datasets: [{ data: coinValues }] };

  // Rewards by category (USD)
  const rewardsByCategory = useMemo(() => {
    const m = new Map();
    for (const r of rewards) {
      const cat = txIdToCategory.get(r.transactionId) || 'Uncategorized';
      m.set(cat, (m.get(cat) || 0) + Number(r.rewardAmountUsd || 0));
    }
    return m;
  }, [rewards, txIdToCategory]);
  const rwCatLabels = [...rewardsByCategory.keys()];
  const rwCatValues = [...rewardsByCategory.values()];
  const rwCatBarData = { labels: rwCatLabels, datasets: [{ label: 'Rewards (USD)', data: rwCatValues }] };

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;
  if (loading) return <div className="container mt-3"><Spinner animation="border" /></div>;
  if (err) return <Alert className="m-3" variant="danger">{err}</Alert>;

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Analytics</h3>

      <div className="row g-4">
        {/* Spend by Category (from transactions) */}
        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="mb-3">Spend by Category</h5>
            {spendValues.length ? <Pie data={spendPieData} /> : <Alert variant="secondary">No spend data.</Alert>}
          </div>
        </div>

        {/* Rewards by Coin */}
        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="mb-3">Rewards by Coin (USD)</h5>
            {coinValues.length ? <Pie data={coinPieData} /> : <Alert variant="secondary">No reward data.</Alert>}
          </div>
        </div>

        {/* Rewards by Category */}
        <div className="col-12">
          <div className="card p-3">
            <h5 className="mb-3">Rewards by Category (USD)</h5>
            {rwCatValues.length ? <Bar data={rwCatBarData} /> : <Alert variant="secondary">No reward data.</Alert>}
          </div>
        </div>
      </div>
    </div>
  );
}
