import { Table, Badge } from 'react-bootstrap';
import { formatDate, formatUSD } from '../scripts/formatting';

export default function RewardsTable({ rows }) {
  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Merchant</th>
          <th>Category</th>
          <th>Coin</th>
          <th className="text-end">USD</th>
          <th className="text-end">Crypto</th>
          <th className="text-end">Coin Price</th>
          <th>Status</th>
          <th>Transaction Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => {
          const statusVariant = r.status === 'COMPLETED' ? 'success' :
                                r.status === 'FAILED' ? 'danger' : 'warning';
          return (
            <tr key={r.rewardId}>
              <td>{r.merchant}</td>
              <td>{r.category}</td>
              <td>{r.coinType || '—'}</td>
              <td className="text-end">{formatUSD(r.rewardAmountUsd)}</td>
              <td className="text-end">{Number(r.rewardAmountCrypto || 0).toFixed(8)}</td>
              <td className="text-end">{formatUSD(r.coinPriceUsd)}</td>
              <td><Badge bg={statusVariant}>{r.status || '—'}</Badge></td>
              <td>{formatDate(r.createdDate)}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
