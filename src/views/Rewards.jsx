// src/views/Rewards.jsx
import { useEffect, useState, useMemo } from 'react';
import { Alert, Button, Spinner, Table, Badge } from 'react-bootstrap';
import StatusMessage from '../components/StatusMessage';
import { formatDate, formatUSD } from '../scripts/formatting';
import { fetchUserRewards, fetchUserTransactions, fetchCategories } from '../scripts/api-calls';
import '../styles/rewards.css';

export default function Rewards() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');

  // rows = rewards merged with tx + category name
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]); // optional to keep for later renders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function load() {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const [rw, tx, cats] = await Promise.all([
        fetchUserRewards(auth.userId),
        fetchUserTransactions(auth.userId),
        fetchCategories(),
      ]);

      // Build a local id→name map using STRING keys to avoid 1 vs "1" mismatches
      const catMap = new Map(
        (cats || []).map((c) => [String(c.categoryId), c.categoryName])
      );

      // Index transactions by transactionId
      const txMap = new Map((tx || []).map((t) => [t.transactionId, t]));

      // Merge rewards with tx + category name lookup
      const merged = (rw || []).map((r) => {
        const t = txMap.get(r.transactionId);
        const txCatId =
          t?.categoryId != null ? String(t.categoryId) : null;

        return {
          ...r,
          merchant: t?.merchant ?? '—',
          category:
            // 1) prefer name from transaction if backend already provides it
            t?.categoryName ??
            // 2) else lookup from categories list by normalized id
            (txCatId ? catMap.get(txCatId) : undefined) ??
            // 3) else fall back to the raw id (still normalized) or —
            (txCatId ?? '—'),
          txDate: t?.transactionDate ?? null,
        };
      });

      setRows(merged);
      setCategories(cats || []);
    } catch (e) {
      setError(e.message || 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.userId]);

  // calculate total USD
  const totalUsd = rows.reduce(
    (s, r) => s + Number(r.rewardAmountUsd || 0),
    0
  );

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;

  if (loading) {
    return (
      <div className="container mt-3">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h3 className="mb-0">Rewards</h3>
        <div className="d-flex align-items-center gap-3">
          <div className="text-muted small">
            Total (USD): <strong>{formatUSD(totalUsd)}</strong>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              await load();
              setSuccess('Refreshed');
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      <StatusMessage error={error} success={success} />

      {rows.length === 0 ? (
        <Alert variant="info">No rewards yet.</Alert>
      ) : (
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Category</th>
              <th>Coin</th>
              <th className="text-end col-money">USD</th>
              <th className="text-end col-money">Crypto</th>
              <th className="text-end col-money">Coin Price</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const statusVariant =
                r.status === 'COMPLETED'
                  ? 'success'
                  : r.status === 'FAILED'
                  ? 'danger'
                  : 'warning';
              return (
                <tr key={r.rewardId}>
                  <td>{r.merchant}</td>
                  <td>{r.category}</td>
                  <td>{r.coinType || '—'}</td>
                  <td className="text-end">{formatUSD(r.rewardAmountUsd)}</td>
                  <td className="text-end">
                    {Number(r.rewardAmountCrypto || 0).toFixed(8)}
                  </td>
                  <td className="text-end">{formatUSD(r.coinPriceUsd)}</td>
                  <td>
                    <Badge bg={statusVariant}>{r.status || '—'}</Badge>
                  </td>
                  <td>{formatDate(r.createdDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}