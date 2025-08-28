import { useEffect, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import StatusMessage from '../components/StatusMessage';
import Button from '../components/AppButton';
import CategoryTable from '../components/CategoryTable';
import RuleTable from '../components/RuleTable';
import {
  fetchCategories,
  addCategory,
  updateCategoryName,
  removeCategory
} from '../scripts/api-calls';
import { getUserRules, replaceUserRules } from '../api/userCategoryRules';

export default function Catalog() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');

  const [cats, setCats] = useState([]);
  const [percents, setPercents] = useState({});
  const [loading, setLoading] = useState(true);   // page/network loading
  const [saving, setSaving] = useState(false);    // rules save busy
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function loadAll() {
    if (!auth) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const [c, rules] = await Promise.all([
        fetchCategories(),
        getUserRules(auth.userId),
      ]);

      setCats(c || []);

      // seed percent map
      const map = {};
      for (const cat of c || []) {
        const match = (rules || []).find(r => r.categoryId === cat.categoryId);
        map[cat.categoryId] = match ? Number(match.percent) : 0;
      }
      setPercents(map);

    } catch (e) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, [auth?.userId]);

  async function onCreate(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.newName.value.trim();
    if (!name) return;

    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await addCategory(name);
      form.reset();
      await loadAll();
      setSuccess('Category created');
    } catch (e) {
      setError(e?.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  }

  async function onRename(row) {
    const next = window.prompt('New name:', row.categoryName);
    if (!next) return;

    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await updateCategoryName(row.categoryId, next.trim());
      await loadAll();
      setSuccess('Category renamed');
    } catch (e) {
      setError(e?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(row) {
    if (!window.confirm(`Delete "${row.categoryName}"?`)) return;

    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await removeCategory(row.categoryId);
      await loadAll();
      setSuccess('Category deleted');
    } catch (e) {
      setError(e?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  const onChangePercent = (categoryId, val) => {
    const num = Number(val);
    setPercents(p => ({ ...p, [categoryId]: Number.isNaN(num) ? 0 : num }));
  };

  async function onSaveRules(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = cats.map(c => ({
        categoryId: c.categoryId,
        percent: Number(percents[c.categoryId]) || 0,
      }));
      await replaceUserRules(auth.userId, payload);
      setSuccess('Rules saved');
    } catch (e) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Catalog</h3>
      <StatusMessage error={error} success={success} />

      {/* Categories Card */}
      <div className="card p-3 mb-4">
        <h5 className="mb-3">Categories</h5>
        <Form className="d-flex gap-2 mb-3" onSubmit={onCreate}>
          <Form.Control name="newName" placeholder="New category name" />
          <Button type="submit" busy={loading} busyText="Adding…">Add</Button>
        </Form>

        <CategoryTable
          rows={cats}
          loading={loading}
          onRename={onRename}
          onDelete={onDelete}
        />
      </div>

      {/* Rules Card */}
      <div className="card p-3">
        <h5 className="mb-3">Category Rules</h5>
        <Form onSubmit={onSaveRules}>
          <RuleTable
            categories={cats}
            percents={percents}
            onChangePercent={onChangePercent}
          />
          <div className="d-flex justify-content-end">
            <Button type="submit" busy={saving} busyText="Saving…">
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
