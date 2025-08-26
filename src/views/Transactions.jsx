// src/views/Transactions.jsx
import { useEffect, useMemo, useState } from 'react';
import { Table, Alert, Form } from 'react-bootstrap';
import StatusMessage from '../components/StatusMessage';
import { formatDate, formatUSD } from '../scripts/formatting';
import { fetchUserTransactions, createTransaction, fetchCategories } from '../scripts/api-calls';
import '../styles/transactions.css';
import Button from '../components/AppButton';

export default function Transactions() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');

  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const categoryMap = useMemo(
    () => new Map((categories || []).map(c => [c.categoryId, c.categoryName])),
    [categories]
  );

  async function load() {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const [txs, cats] = await Promise.all([
        fetchUserTransactions(auth.userId),
        fetchCategories(),
      ]);
      setRows(txs || []);
      setCategories(cats || []);
    } catch (e) {
      setError(e.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth) return;
    load();
  }, [auth?.userId]);

  async function onCreate(e) {
    e.preventDefault();
    const form = e.currentTarget;

    const merchant = form.elements.merchant.value.trim();
    const categoryId = Number(form.elements.categoryId.value);
    const amount = Number(form.elements.amount.value);

    if (!merchant || !amount || Number.isNaN(categoryId)) return;

    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await createTransaction({
        userId: auth.userId,
        categoryId,
        merchant,
        amount,
      });
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
      <h3 className="mb-3">Transactions</h3>

      <StatusMessage error={error} success={success} />

      <Form className="mb-4" onSubmit={onCreate}>
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <Form.Label>Merchant</Form.Label>
            <Form.Control name="merchant" placeholder="Target" required />
          </div>

          <div className="col-md-3">
            <Form.Label>Category</Form.Label>
            <Form.Select name="categoryId" required defaultValue="">
              <option value="" disabled>
                Select a category…
              </option>
              {categories.map(c => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-md-3">
            <Form.Label>Amount (USD)</Form.Label>
            <Form.Control name="amount" type="number" step="0.01" placeholder="0.00" required />
          </div>
          <div className="col-md-2">
            <Button type="submit" className="w-100" busy={loading} busyText="Adding…">
              Add
            </Button>
          </div>

        </div>
      </Form>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Merchant</th>
            <th>Category</th>
            <th className="col-amount text-end">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.transactionId}>
              <td>{t.transactionDate ? formatDate(t.transactionDate) : '—'}</td>
              <td>{t.merchant}</td>
              <td>{categoryMap.get(t.categoryId) ?? t.categoryId}</td>
              <td className="text-end">{formatUSD(t.amount)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
