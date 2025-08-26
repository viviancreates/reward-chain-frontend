import { useEffect, useState } from 'react';
import { Table, Alert, Form } from 'react-bootstrap';
import { fetchCategories, addCategory, updateCategoryName, removeCategory } from '../scripts/api-calls';
import '../styles/categories.css';
import StatusMessage from '../components/StatusMessage';
import Button from '../components/AppButton';


export default function Categories() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function load() {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const data = await fetchCategories();
      setRows(data || []);
    } catch (e) {
      setError(e.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.newName.value.trim();
    if (!name) return;

    setError(null); setSuccess(null); setLoading(true);
    try {
      await addCategory(name);
      await load();
      form.reset();
      setSuccess('Category created');
    } catch (e) {
      setError(e.message || 'Create failed');
      setLoading(false);
    }
  }

  async function onRename(row) {
    const next = window.prompt('New name:', row.categoryName);
    if (!next) return;

    setError(null); setSuccess(null); setLoading(true);
    try {
      await updateCategoryName(row.categoryId, next.trim());
      await load();
      setSuccess('Category renamed');
    } catch (e) {
      setError(e.message || 'Update failed');
      setLoading(false);
    }
  }

  async function onDelete(row) {
    if (!window.confirm(`Delete "${row.categoryName}"?`)) return;

    setError(null); setSuccess(null); setLoading(true);
    try {
      await removeCategory(row.categoryId);
      await load();
      setSuccess('Category deleted');
    } catch (e) {
      setError(e.message || 'Delete failed');
      setLoading(false);
    }
  }

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;


  return (
    <div className="container mt-3">
      <h3 className="mb-3">Categories</h3>

      <StatusMessage error={error} success={success} />

      <Form className="d-flex gap-2 mb-3" onSubmit={onCreate}>
        <Form.Control
          name="newName"
          placeholder="New category name"
          aria-label="New category name"
        />
        <Button type="submit" busy={loading} busyText="Adding…">
          Add
        </Button>
      </Form>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th className="col-id">ID</th>
            <th>Name</th>
            <th className="col-actions text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.categoryId}>
              <td>{row.categoryName}</td>
              <td className="text-end">
                <div className="d-inline-flex gap-2">
                  <Button size="sm" busy={loading} onClick={() => onRename(row)}>
                    Rename
                  </Button>
                  <Button size="sm" variant="danger" busy={loading} onClick={() => onDelete(row)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}