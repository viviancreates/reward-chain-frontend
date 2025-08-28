import { Table } from 'react-bootstrap';
import Button from './AppButton';

export default function CategoryTable({ rows, loading, onRename, onDelete }) {
  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.categoryId}>
            <td>{row.categoryName}</td>
            <td className="text-end">
              <div className="d-inline-flex gap-2">
                <Button size="sm" busy={loading} onClick={() => onRename(row)}>Rename</Button>
                <Button size="sm" variant="danger" busy={loading} onClick={() => onDelete(row)}>Delete</Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
