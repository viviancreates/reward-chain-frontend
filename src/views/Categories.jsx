import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import { getAllCategories, createCategory, renameCategory, deleteCategory } from '../api/categories';

export default function Categories() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const load = async () => {
    setErr(''); setOk('');
    setLoading(true);
    try {
      const data = await getAllCategories();
      setRows(data || []);
    } catch (e) {
      setErr(e.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true); setErr(''); setOk('');
    try {
      const created = await createCategory(newName.trim(), 0);
      setRows([created, ...rows]);
      setNewName('');
      setOk('Category created');
    } catch (e2) {
      setErr(e2.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (row) => {
    setEditingId(row.categoryId);
    setEditName(row.categoryName);
    setOk(''); setErr('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;
    setSaving(true); setErr(''); setOk('');
    try {
      const updated = await renameCategory(editingId, editName.trim());
      setRows(r => r.map(x => x.categoryId === editingId ? updated : x));
      cancelEdit();
      setOk('Category renamed');
    } catch (e) {
      setErr(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    setSaving(true); setErr(''); setOk('');
    try {
      await deleteCategory(id);
      setRows(r => r.filter(x => x.categoryId !== id));
      setOk('Category deleted');
    } catch (e) {
      setErr(e.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;
  if (loading) return <div className="container mt-3"><Spinner animation="border" /></div>;

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Categories</h3>

      {err && <Alert variant="danger">{err}</Alert>}
      {ok && <Alert variant="success">{ok}</Alert>}

      <Form className="d-flex gap-2 mb-3" onSubmit={onCreate}>
        <Form.Control
          placeholder="New category name (e.g., Coffee)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add'}</Button>
      </Form>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th style={{width: 60}}>ID</th>
            <th>Name</th>
            <th style={{width: 220}} className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.categoryId}>
              <td>{row.categoryId}</td>
              <td>
                {editingId === row.categoryId ? (
                  <Form.Control
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                ) : (
                  row.categoryName
                )}
              </td>
              <td className="text-end">
                {editingId === row.categoryId ? (
                  <div className="d-inline-flex gap-2">
                    <Button size="sm" variant="success" onClick={saveEdit} disabled={saving}>Save</Button>
                    <Button size="sm" variant="secondary" onClick={cancelEdit} disabled={saving}>Cancel</Button>
                  </div>
                ) : (
                  <div className="d-inline-flex gap-2">
                    <Button size="sm" onClick={() => startEdit(row)}>Rename</Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(row.categoryId)} disabled={saving}>Delete</Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
