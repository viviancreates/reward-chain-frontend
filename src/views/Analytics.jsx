import { useEffect, useMemo, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Alert } from 'react-bootstrap';
import StatusMessage from '../components/StatusMessage';
import { fetchUserTransactions, fetchUserRewards, fetchCategories } from '../scripts/api-calls';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// ---- Brand palette (from your app) ----
const PALETTE = [
  '#FFE29D', // sand
  '#5DC7A4', // mint
  '#3A3F87', // navy
  '#CF3E81', // magenta
  '#F0983E', // orange
  '#6B8CF4', // blue
  '#4FB0C6', // teal
];
const pickColors = (labels) => labels.map((_, i) => PALETTE[i % PALETTE.length]);

// Shared chart options
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#333' } },
    tooltip: { enabled: true },
  },
  scales: {
    x: { ticks: { color: '#555' }, grid: { color: 'rgba(0,0,0,0.05)' } },
    y: { ticks: { color: '#555' }, grid: { color: 'rgba(0,0,0,0.05)' } },
  },
};


export default function Analytics() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  const [txs, setTxs] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const [t, r, cats] = await Promise.all([
        fetchUserTransactions(auth.userId),
        fetchUserRewards(auth.userId),
        fetchCategories(),
      ]);
      setTxs(t || []);
      setRewards(r || []);
      setCategories(cats || []);
    } catch (e) {
      setError(e.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth) return;
    load();
  }, [auth?.userId]);

  const categoryMap = useMemo(
    () => new Map((categories || []).map(c => [String(c.categoryId), c.categoryName])),
    [categories]
  );

  // ---------- Spend by Category ----------
  const spendByCategory = useMemo(() => {
    const m = new Map();
    for (const t of txs) {
      const name = t.categoryName ?? categoryMap.get(String(t.categoryId)) ?? `Category #${t.categoryId}`;
      const amt = Number(t.amount) || 0;
      m.set(name, (m.get(name) || 0) + amt);
    }
    return m;
  }, [txs, categoryMap]);

  const spendLabels = [...spendByCategory.keys()];
  const spendValues = [...spendByCategory.values()];
  const spendPieData = {
    labels: spendLabels,
    datasets: [{
      data: spendValues,
      backgroundColor: pickColors(spendLabels),
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };

  // ---------- Rewards by Coin ----------
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
  const coinPieData = {
    labels: coinLabels,
    datasets: [{
      data: coinValues,
      backgroundColor: pickColors(coinLabels),
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };

  // ---------- Rewards by Category ----------
  const txIdToCategory = useMemo(() => {
    const m = new Map();
    for (const t of txs) {
      const name = t.categoryName ?? categoryMap.get(String(t.categoryId)) ?? `Category #${t.categoryId}`;
      m.set(t.transactionId, name);
    }
    return m;
  }, [txs, categoryMap]);

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
  const rwCatBarData = {
    labels: rwCatLabels,
    datasets: [{
      label: 'Rewards (USD)',
      data: rwCatValues,
      backgroundColor: '#3A3F87',   // navy bars
      borderColor: '#3A3F87',
      borderWidth: 1,
    }],
  };

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;

  return (
    <div className="container mt-3 analytics">
      <h3 className="mb-3">Analytics</h3>

      <StatusMessage error={error} />

      {loading ? (
        <Alert variant="secondary">Loading…</Alert>
      ) : (
        <div className="row g-4">
          {/* Spend by Category */}
          <div className="col-md-6">
            <div className="card p-3">
              <h5 className="mb-3">Spend by Category</h5>
              {spendValues.length ? (
                <div style={{ height: 300 }}>
                  <Pie data={spendPieData} options={baseOptions} />
                </div>
              ) : (
                <Alert variant="secondary" className="mb-0">No spend data.</Alert>
              )}
            </div>
          </div>

          {/* Rewards by Coin */}
          <div className="col-md-6">
            <div className="card p-3">
              <h5 className="mb-3">Rewards by Coin (USD)</h5>
              {coinValues.length ? (
                <div style={{ height: 300 }}>
                  <Pie data={coinPieData} options={baseOptions} />
                </div>
              ) : (
                <Alert variant="secondary" className="mb-0">No reward data.</Alert>
              )}
            </div>
          </div>

          {/* Rewards by Category */}
          <div className="col-12">
            <div className="card p-3">
              <h5 className="mb-3">Total Rewards by Category (USD)</h5>
              {rwCatValues.length ? (
                <div style={{ height: 360 }}>
                  <Bar data={rwCatBarData} options={baseOptions} />
                </div>
              ) : (
                <Alert variant="secondary" className="mb-0">No reward data.</Alert>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
