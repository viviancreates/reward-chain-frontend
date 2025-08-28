import { Form } from 'react-bootstrap';
import Button from './AppButton';

export default function TransactionForm({ categories, loading, onCreate }) {
  return (
    <Form className="mb-4" onSubmit={onCreate}>
      <div className="row g-2 align-items-end">
        <div className="col-md-4">
          <Form.Label>Merchant</Form.Label>
          <Form.Control name="merchant" placeholder="Target" required />
        </div>
        <div className="col-md-3">
          <Form.Label>Category</Form.Label>
          <Form.Select name="categoryId" required defaultValue="">
            <option value="" disabled>Select a category…</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </Form.Select>
        </div>
        <div className="col-md-3">
          <Form.Label>Amount (USD)</Form.Label>
          <Form.Control name="amount" type="number" step="0.01" placeholder="0.00" required />
        </div>
        <div className="col-md-2">
          <Button type="submit" className="w-100" busy={loading} busyText="Adding…">Add</Button>
        </div>
      </div>
    </Form>
  );
}
