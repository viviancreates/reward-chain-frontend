// src/views/Rules.jsx
import { useEffect, useState } from 'react';
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import { fetchCategories } from '../scripts/api-calls';
import { getUserRules, replaceUserRules } from '../api/userCategoryRules';
import StatusMessage from '../components/StatusMessage';

export default function Rules() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');

  const [categories, setCategories] = useState([]);
  const [percents, setPercents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!auth) return;
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const [cats, rules] = await Promise.all([
          fetchCategories(),
          getUserRules(auth.userId),
        ]);

        if (ignore) return;
        setCategories(cats || []);

        // seed percent map
        const map = {};
        for (const c of cats || []) {
          const match = (rules || []).find(r => r.categoryId === c.categoryId);
          map[c.categoryId] = match ? Number(match.percent) : 0;
        }
        setPercents(map);

      } catch (e) {
        if (!ignore) setError(e.message || 'Failed to load rules');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true };
  }, [auth?.userId]);

  const onChangePercent = (categoryId, val) => {
    const num = Number(val);
    setPercents(p => ({ ...p, [categoryId]: isNaN(num) ? 0 : num }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = categories.map(c => ({
        categoryId: c.categoryId,
        percent: Number(percents[c.categoryId]) || 0,
      }));
      await replaceUserRules(auth.userId, payload);
      setSuccess('Saved!');
    } catch (e) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;
  if (loading) return <div className="container mt-3"><Spinner animation="border" /></div>;

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Category Rules</h3>
      <p className="text-muted">Set how much of each category purchase should be saved.</p>

      <StatusMessage error={error} success={success} />

      <Form onSubmit={onSave}>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Category</th>
              <th className="text-end" style={{width: 180}}>Percent (0–100)</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.categoryId}>
                <td>{c.categoryName}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-end">
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={percents[c.categoryId] ?? 0}
                      onChange={e => onChangePercent(c.categoryId, e.target.value)}
                      style={{ maxWidth: 120, textAlign: 'right' }}
                    />
                    <span className="align-self-center">%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
