// src/views/Analytics.jsx
import { useEffect, useMemo, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { getUserTransactions } from '../api/transactions';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Analytics() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!auth) return;
    let ignore = false;
    (async () => {
      try {
        const data = await getUserTransactions(auth.userId);
        if (!ignore) setRows(data || []);
      } catch (e) {
        if (!ignore) setErr(e.message || 'Failed to load');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [auth?.userId]);

  // ⚠️ Always call hooks before any early returns:
  const totalsByCat = useMemo(() => {
    const m = new Map();
    for (const t of rows) {
      const key = t.categoryName ?? `Category ${t.categoryId}`;
      const val = Number(t.amount) || 0;
      m.set(key, (m.get(key) || 0) + val);
    }
    return m;
  }, [rows]);

  const labels = [...totalsByCat.keys()];
  const values = [...totalsByCat.values()];
  const pieData = { labels, datasets: [{ data: values }] };
  const barData = { labels, datasets: [{ label: 'Spend ($)', data: values }] };

  // Now do early returns (after all hooks ran)
  if (!auth) return <Alert variant="warning">Please log in.</Alert>;
  if (loading) return <div className="container mt-3"><Spinner animation="border" /></div>;
  if (err) return <Alert className="m-3" variant="danger">{err}</Alert>;

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Analytics</h3>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="mb-3">Spend by Category</h5>
            <Pie data={pieData} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
