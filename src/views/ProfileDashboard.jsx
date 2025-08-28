// src/views/ProfileDashboard.jsx
import { useEffect, useMemo, useState } from 'react';
import { Alert, Table } from 'react-bootstrap';
import Button from '../components/AppButton';
import { fetchUserTransactions, fetchUserRewards, fetchCategories } from '../scripts/api-calls';
import { formatUSD, formatDate } from '../scripts/formatting';

export default function ProfileDashboard() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');

  const [txs, setTxs] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------- Load data once user is known --------
  useEffect(() => {
    if (!auth) return;
    (async () => {
      try {
        const [t, r, c] = await Promise.all([
          fetchUserTransactions(auth.userId),
          fetchUserRewards(auth.userId),
          fetchCategories(),
        ]);
        setTxs(t || []);
        setRewards(r || []);
        setCats(c || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [auth?.userId]);

  // -------- Mappers / helpers --------
  const categoryMap = useMemo(
    () => new Map((cats || []).map(c => [String(c.categoryId), c.categoryName])),
    [cats]
  );

  const toTime = (d) => (d ? new Date(d).getTime() : 0);
  const startOfMonth = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  }, []);

  // -------- KPIs --------
  const totalSpend = useMemo(
    () => txs.reduce((s, t) => s + Number(t.amount || 0), 0),
    [txs]
  );

  const totalRewardsUsd = useMemo(
    () => rewards.reduce((s, r) => s + Number(r.rewardAmountUsd || 0), 0),
    [rewards]
  );

  const totalRewardsCrypto = useMemo(
    () => rewards.reduce((s, r) => s + Number(r.rewardAmountCrypto || 0), 0),
    [rewards]
  );

  const monthSpend = useMemo(
    () => txs
      .filter(t => toTime(t.transactionDate) >= startOfMonth)
      .reduce((s, t) => s + Number(t.amount || 0), 0),
    [txs, startOfMonth]
  );

  const monthRewardsUsd = useMemo(
    () => rewards
      .filter(r => toTime(r.createdDate) >= startOfMonth)
      .reduce((s, r) => s + Number(r.rewardAmountUsd || 0), 0),
    [rewards, startOfMonth]
  );

  // Treat “Savings” as total rewards so far (tweak later if you add a Savings API)
  const savingsBalance = totalRewardsUsd;

  // -------- Lists: recent activity --------
  const recentTxs = useMemo(() => {
    const arr = [...(txs || [])];
    arr.sort((a, b) => toTime(b.transactionDate) - toTime(a.transactionDate));
    return arr.slice(0, 5);
  }, [txs]);

  const recentRewards = useMemo(() => {
    const arr = [...(rewards || [])];
    arr.sort((a, b) => toTime(b.createdDate) - toTime(a.createdDate));
    return arr.slice(0, 5);
  }, [rewards]);

  // -------- Top categories by spend (top 5) --------
  const topCategories = useMemo(() => {
    const m = new Map();
    for (const t of txs) {
      const name = t.categoryName ?? categoryMap.get(String(t.categoryId)) ?? `Category #${t.categoryId}`;
      const amt = Number(t.amount) || 0;
      m.set(name, (m.get(name) || 0) + amt);
    }
    const rows = [...m.entries()].map(([name, total]) => ({ name, total }));
    rows.sort((a, b) => b.total - a.total);
    const top = rows.slice(0, 5);
    const max = Math.max(1, ...top.map(r => r.total)); // avoid /0
    return { top, max };
  }, [txs, categoryMap]);

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Welcome, {auth.firstName}</h3>

      {/* KPI Cards */}
      <div className="row g-3">
        <KpiCard title="Total Spend" value={formatUSD(totalSpend)} />
        <KpiCard title="Total Rewards (USD)" value={formatUSD(totalRewardsUsd)} />
        <KpiCard title="Rewards (Crypto)" value={Number(totalRewardsCrypto || 0).toFixed(8)} />
        <KpiCard title="This Month: Spend" value={formatUSD(monthSpend)} />
        <KpiCard title="This Month: Rewards" value={formatUSD(monthRewardsUsd)} />
        <KpiCard
          title="Savings Balance"
          value={formatUSD(savingsBalance)}
          hint="(sum of rewards to date)"
        />
      </div>

      {/* Recent Transactions & Rewards */}
      <div className="row g-3 mt-1">
        <div className="col-lg-7">
          <div className="card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Recent Transactions</h5>
              <Button href="/spend" variant="outline-primary" size="sm">See all</Button>
            </div>
            {loading ? (
              <div className="text-muted">Loading…</div>
            ) : recentTxs.length === 0 ? (
              <Alert variant="secondary" className="mb-0">No transactions yet.</Alert>
            ) : (
              <Table striped hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th style={{width:'10rem'}}>Date</th>
                    <th>Merchant</th>
                    <th>Category</th>
                    <th className="text-end" style={{width:'9rem'}}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTxs.map(t => {
                    const cat = t.categoryName ?? categoryMap.get(String(t.categoryId)) ?? (t.categoryId != null ? `#${t.categoryId}` : '—');
                    return (
                      <tr key={t.transactionId}>
                        <td>{t.transactionDate ? formatDate(t.transactionDate) : '—'}</td>
                        <td>{t.merchant}</td>
                        <td>{cat}</td>
                        <td className="text-end">{formatUSD(t.amount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Recent Rewards</h5>
              <Button href="/rewards" variant="outline-primary" size="sm">See all</Button>
            </div>
            {loading ? (
              <div className="text-muted">Loading…</div>
            ) : recentRewards.length === 0 ? (
              <Alert variant="secondary" className="mb-0">No rewards yet.</Alert>
            ) : (
              <Table striped hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th style={{width:'10rem'}}>Date</th>
                    <th>Coin</th>
                    <th className="text-end" style={{width:'9rem'}}>USD</th>
                    <th className="text-end" style={{width:'10rem'}}>Crypto</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRewards.map(r => (
                    <tr key={r.rewardId}>
                      <td>{r.createdDate ? formatDate(r.createdDate) : '—'}</td>
                      <td>{r.coinType || '—'}</td>
                      <td className="text-end">{formatUSD(r.rewardAmountUsd)}</td>
                      <td className="text-end">{Number(r.rewardAmountCrypto || 0).toFixed(8)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </div>

      {/* Top Categories by Spend */}
      <div className="card p-3 mt-4">
        <h5 className="mb-3">Top Categories by Spend</h5>
        {txs.length === 0 ? (
          <Alert variant="secondary" className="mb-0">No spend data.</Alert>
        ) : (
          <div className="d-flex flex-column gap-2">
            {topCategories.top.map(row => (
              <div key={row.name}>
                <div className="d-flex justify-content-between">
                  <div className="fw-medium">{row.name}</div>
                  <div className="text-muted">{formatUSD(row.total)}</div>
                </div>
                <div className="progress" style={{ height: 6 }}>
                  <div
                    className="progress-bar"
                    style={{ width: `${(row.total / topCategories.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card p-3 mt-4 mb-4">
        <h5 className="mb-3">Quick Actions</h5>
        <div className="d-flex flex-wrap gap-2">
          <Button href="/spend" variant="outline-primary">Add Transaction</Button>
          <Button href="/catalog" variant="outline-primary">Manage Categories & Rules</Button>
          <Button href="/rewards" variant="outline-primary">View Rewards</Button>
          <Button href="/analytics" variant="outline-primary">Open Analytics</Button>
        </div>
      </div>
    </div>
  );
}

/** Small, reusable KPI card */
function KpiCard({ title, value, hint }) {
  return (
    <div className="col-sm-6 col-lg-4">
      <div className="card p-3 h-100">
        <div className="text-muted">{title}</div>
        <div className="fs-3 fw-semibold">{value}</div>
        {hint ? <div className="small text-muted mt-1">{hint}</div> : null}
      </div>
    </div>
  );
}
