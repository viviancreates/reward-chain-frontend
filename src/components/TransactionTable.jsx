import { Table } from 'react-bootstrap';
import { formatDate, formatUSD } from '../scripts/formatting';

export default function TransactionTable({ rows, categoryMap }) {
 const getCategoryName = (id) =>
    categoryMap.get(id) ?? categoryMap.get(String(id)) ?? id;

  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Date</th>
          <th>Merchant</th>
          <th>Category</th>
          <th className="text-end">Amount</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(t => (
          <tr key={t.transactionId}>
            <td>{t.transactionDate ? formatDate(t.transactionDate) : '—'}</td>
            <td>{t.merchant}</td>
            <td>{getCategoryName(t.categoryId)}</td>
            <td className="text-end">{formatUSD(t.amount)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
