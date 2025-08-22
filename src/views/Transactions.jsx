import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { getUserTransactions } from '../api/transactions';

export default function Transactions() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

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
