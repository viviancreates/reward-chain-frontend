import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';  
import { getUserTransactions, addTransaction } from '../api/transactions';

export default function Transactions() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [merchant, setMerchant] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

   const submitNew = async (e) => {
    e.preventDefault();
    if (!auth) return;
    setSaving(true);
    try {
      const tx = await addTransaction({
        userId: auth.userId,
        categoryId: Number(categoryId),
        merchant: merchant.trim(),
        amount: Number(amount),
      });
      setRows(prev => [tx, ...prev]);
      setMerchant('');
      setAmount('');
    } catch (e) {
      setErr(e.message || 'Failed to add transaction');
    } finally {
      setSaving(false);
    }
  };


  useEffect(() => {
  if (!auth) return;
  let ignore = false;
  (async () => {
    try {
      if (rows.length === 0) setLoading(true); // don’t flash if we already have data
      const data = await getUserTransactions(auth.userId);
      if (!ignore) setRows(data || []);
    } catch (e) {
      if (!ignore) setErr(e.message || 'Failed to load transactions');
    } finally {
      if (!ignore) setLoading(false);
    }
  })();
  return () => { ignore = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [auth?.userId]); // keep deps minimal


  if (!auth) return <Alert variant="warning">Please log in.</Alert>;
  if (loading) return <div className="container mt-3"><Spinner animation="border" /></div>;

  return (
    
    <div className="container mt-3">
         <Form className="mb-4" onSubmit={submitNew}>
    <div className="row g-2 align-items-end">
      <div className="col-md-4">
        <Form.Label>Merchant</Form.Label>
        <Form.Control
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          placeholder="e.g., Target"
          required
        />
      </div>
      <div className="col-md-3">
        <Form.Label>Category ID</Form.Label>
        <Form.Control
          type="number"
          min="1"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />
      </div>
      <div className="col-md-3">
        <Form.Label>Amount (USD)</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>
      <div className="col-md-2">
        <Button type="submit" className="w-100" disabled={saving}>
          {saving ? 'Adding…' : 'Add'}
        </Button>
      </div>
    </div>
  </Form>
      <h3 className="mb-3">Transactions</h3>
      {err && <Alert variant="danger">{err}</Alert>}
      <Table striped hover responsive>
        <thead>
          <tr><th>Date</th><th>Merchant</th><th>Category</th><th className="text-end">Amount</th></tr>
        </thead>
        <tbody>
          {rows.map(t => (
            <tr key={t.transactionId}>
              <td>{t.transactionDate ? new Date(t.transactionDate).toLocaleString() : '—'}</td>
              <td>{t.merchant}</td>
              <td>{t.categoryName ?? t.categoryId}</td>
              <td className="text-end">
                {Number(t.amount).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
