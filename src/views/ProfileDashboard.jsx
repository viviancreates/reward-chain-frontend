// src/views/ProfileDashboard.jsx
import { useEffect, useMemo, useState } from 'react';
import { Alert, Table } from 'react-bootstrap';
import { fetchUserTransactions, fetchUserRewards, fetchCategories, fetchUserWallet } from '../scripts/api-calls';
import { formatUSD, formatDate } from '../scripts/formatting';
import { ProfileInfo, KpiCard, Pagi, AppButton as Button } from '../components';

export default function ProfileDashboard() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');

  const [txs, setTxs] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);

  // pagination
  const pageSize = 5;
  const [pageTx, setPageTx] = useState(1);
  const [pageRw, setPageRw] = useState(1);

  // load data
  useEffect(() => {
    if (!auth) return;
    (async () => {
      try {
        const [t, r, c, w] = await Promise.all([
          fetchUserTransactions(auth.userId),
          fetchUserRewards(auth.userId),
          fetchCategories(),
          fetchUserWallet(auth.userId),
        ]);
        setWallet(w || null);
        setTxs(t || []);
        setRewards(r || []);
        setCats(c || []);
        setPageTx(1);
        setPageRw(1);
      } finally {
        setLoading(false);
      }
    })();
  }, [auth?.userId]);

  // helpers
  const categoryMap = useMemo(
    () => new Map((cats || []).map(c => [String(c.categoryId), c.categoryName])),
    [cats]
  );
  const toTime = (d) => (d ? new Date(d).getTime() : 0);

  // KPI time window
  const startOfMonth = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  }, []);

  // KPIs
  const totalSpend = useMemo(
    () => txs.reduce((s, t) => s + Number(t.amount || 0), 0),
    [txs]
  );
  const totalRewardsUsd = useMemo(
    () => rewards.reduce((s, r) => s + Number(r.rewardAmountUsd || 0), 0),
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
  // simple “savings” proxy
  const savingsBalance = totalRewardsUsd;

  // sort newest first
  const sortedTxs = useMemo(
    () => [...txs].sort((a, b) => toTime(b.transactionDate) - toTime(a.transactionDate)),
    [txs]
  );
  const sortedRewards = useMemo(
    () => [...rewards].sort((a, b) => toTime(b.createdDate) - toTime(a.createdDate)),
    [rewards]
  );

  // pagination
  const totalPagesTx = Math.max(1, Math.ceil(sortedTxs.length / pageSize));
  const totalPagesRw = Math.max(1, Math.ceil(sortedRewards.length / pageSize));
  const pageSlice = (arr, page) =>
    arr.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  const pagedTxs = useMemo(() => pageSlice(sortedTxs, pageTx), [sortedTxs, pageTx]);
  const pagedRewards = useMemo(() => pageSlice(sortedRewards, pageRw), [sortedRewards, pageRw]);

  // top categories (by spend)
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
    const max = Math.max(1, ...top.map(r => r.total));
    return { top, max };
  }, [txs, categoryMap]);

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Welcome, {auth.firstName}!</h3>

      <ProfileInfo
        name={`${auth.firstName ?? ''} ${auth.lastName ?? ''}`.trim() || auth.firstName || 'Your Profile'}
        email={auth.email}
        walletAddress={wallet?.walletAddress}
      />

      {/* Quick Actions */}
      <div className="card p-3 mt-4 mb-4">
        <div className="d-flex justify-content-center gap-2 mt-3">
          <Button href="/spend" variant="outline-primary">Transactions</Button>
          <Button href="/catalog" variant="outline-primary">Categories & Rules</Button>
          <Button href="/rewards" variant="outline-primary">Deposits</Button>
          <Button href="/analytics" variant="outline-primary">Analytics</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-3">
        <KpiCard title="This Month: Spend" value={formatUSD(monthSpend)} />
        <KpiCard title="This Month: Rewards" value={formatUSD(monthRewardsUsd)} />
        <KpiCard title="Total Rewards To Date (USD)" value={formatUSD(totalRewardsUsd)} />
      </div>

      {/* Transactions */}
      <div className="card p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Transactions</h5>
          <Pagi
            page={pageTx}
            totalPages={totalPagesTx}
            onPrev={() => setPageTx(p => Math.max(1, p - 1))}
            onNext={() => setPageTx(p => Math.min(totalPagesTx, p + 1))}
          />
        </div>
        {loading ? (
          <div className="text-muted">Loading…</div>
        ) : pagedTxs.length === 0 ? (
          <Alert variant="secondary" className="mb-0">No transactions yet.</Alert>
        ) : (
          <Table striped hover responsive className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '10rem' }}>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th className="text-end" style={{ width: '9rem' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {pagedTxs.map(t => {
                const cat =
                  t.categoryName ??
                  categoryMap.get(String(t.categoryId)) ??
                  (t.categoryId != null ? `#${t.categoryId}` : '—');
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

      {/* Rewards */}
      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Deposits</h5>
          <Pagi
            page={pageRw}
            totalPages={totalPagesRw}
            onPrev={() => setPageRw(p => Math.max(1, p - 1))}
            onNext={() => setPageRw(p => Math.min(totalPagesRw, p + 1))}
          />
        </div>
        {loading ? (
          <div className="text-muted">Loading…</div>
        ) : pagedRewards.length === 0 ? (
          <Alert variant="secondary" className="mb-0">No rewards yet.</Alert>
        ) : (
          <Table striped hover responsive className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '10rem' }}>Date</th>
                <th>Coin</th>
                <th className="text-end" style={{ width: '9rem' }}>USD</th>
                <th className="text-end" style={{ width: '10rem' }}>Crypto</th>
              </tr>
            </thead>
            <tbody>
              {pagedRewards.map(r => (
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


    </div>
  );
}
