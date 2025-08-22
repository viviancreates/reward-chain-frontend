import { useEffect, useMemo, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import { getAllCategories } from '../api/categories';
import { getUserRules, replaceUserRules } from '../api/userCategoryRules';

export default function Rules() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  // categories from API
  const [categories, setCategories] = useState([]); // [{categoryId, categoryName, rewardPercentage}]
  // editable map: { [categoryId]: percent(0..100) }
  const [percents, setPercents] = useState({});

  // load categories + user rules
  useEffect(() => {
    if (!auth) return;
    let ignore = false;
    (async () => {
      setErr(''); setOk('');
      setLoading(true);
      try {
        const [cats, rules] = await Promise.all([
          getAllCategories(),
          getUserRules(auth.userId),
        ]);

        if (ignore) return;

        setCategories(cats || []);
        // seed map with either user rule percent or 0
        const map = {};
        for (const c of cats || []) {
          const r = (rules || []).find(x => x.categoryId === c.categoryId);
          map[c.categoryId] = r ? Number(r.percent) : 0;
        }
        setPercents(map);
      } catch (e) {
        if (!ignore) setErr(e.message || 'Failed to load rules');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [auth?.userId]);

  const rows = useMemo(() => {
    return categories.map(c => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      percent: percents[c.categoryId] ?? 0,
    }));
  }, [categories, percents]);

  const onChangePercent = (categoryId, val) => {
    // clamp to [0,100]; allow blank to type
    let next = val;
    if (next === '') {
      setPercents(p => ({ ...p, [categoryId]: '' }));
      return;
    }
    const num = Number(next);
    if (Number.isNaN(num)) return;
    const clamped = Math.max(0, Math.min(100, num));
    setPercents(p => ({ ...p, [categoryId]: clamped }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true); setErr(''); setOk('');
    try {
      // validate each 0..100
      const payload = rows.map(r => ({
        categoryId: r.categoryId,
        percent: Number(r.percent) || 0,
      }));
      for (const p of payload) {
        if (p.percent < 0 || p.percent > 100) {
          throw new Error('Each percent must be between 0 and 100');
        }
      }
      await replaceUserRules(auth.userId, payload);
      setOk('Saved!');
    } catch (e2) {
      setErr(e2.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;
  if (loading) return <div className="container mt-3"><Spinner animation="border" /></div>;

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Category Rules (Percent of each purchase to save)</h3>
      <p className="text-muted">
        Set how much of each category purchase (0–100%) should be saved. This does not need to sum to 100 across categories.
      </p>

      {err && <Alert variant="danger">{err}</Alert>}
      {ok && <Alert variant="success">{ok}</Alert>}

      <Form onSubmit={onSave}>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Category</th>
              <th className="text-end" style={{width: 180}}>Percent (0–100)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.categoryId}>
                <td>{r.categoryName}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-end">
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={r.percent}
                      onChange={(e) => onChangePercent(r.categoryId, e.target.value)}
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
