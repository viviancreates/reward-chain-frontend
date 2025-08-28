// src/views/Spend.jsx
import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { fetchUserTransactions, createTransaction, fetchCategories } from '../scripts/api-calls';
import { StatusMessage, TransactionForm, TransactionTable } from '../components';

export default function Spend() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil((rows?.length || 0) / pageSize));
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (rows || []).slice(start, start + pageSize);
  }, [rows, page]);

  const categoryMap = useMemo(
    () => new Map((categories || []).map(c => [c.categoryId, c.categoryName])),
    [categories]
  );

  async function load() {
    setError(null); setSuccess(null); setLoading(true);
    try {
      const [txs, cats] = await Promise.all([
        fetchUserTransactions(auth.userId),
        fetchCategories(),
      ]);
      setRows(txs || []);
      setCategories(cats || []);
      setPage(1); // reset pager after reload
    } catch (e) {
      setError(e.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (auth) load(); }, [auth?.userId]);

  async function onCreate(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const merchant = form.elements.merchant.value.trim();
    const categoryId = Number(form.elements.categoryId.value);
    const amount = Number(form.elements.amount.value);
    if (!merchant || !amount || Number.isNaN(categoryId)) return;

    setError(null); setSuccess(null); setLoading(true);
    try {
      await createTransaction({ userId: auth.userId, categoryId, merchant, amount });
      await load();
      form.reset();
      setSuccess('Transaction added');
    } catch (e) {
      setError(e.message || 'Add failed');
    } finally {
      setLoading(false);
    }
  }

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Spend</h3>
      <StatusMessage error={error} success={success} />

      <TransactionForm categories={categories} loading={loading} onCreate={onCreate} />

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : (
        <>
          {/* Use pagedRows here */}
          <TransactionTable rows={pagedRows} categoryMap={categoryMap} />

          {/* Simple Prev / Next */}
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="text-muted small">
              Page {page} of {totalPages}
            </span>
            <div className="d-inline-flex gap-1">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
