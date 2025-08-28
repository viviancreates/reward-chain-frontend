import { Table, Form } from 'react-bootstrap';

export default function RuleTable({ categories, percents, onChangePercent }) {
  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Category</th>
          <th className="text-end" style={{ width: 180 }}>Percent (0–100)</th>
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
  );
}