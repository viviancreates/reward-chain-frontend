import { Table, Button } from 'react-bootstrap';
import { formatDate, formatUSD } from '../scripts/formatting';

export default function RewardsByTransactionTable({ rows, onDetails }) {
    return (
        <Table striped hover responsive>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Merchant</th>
                    <th>Category</th>
                    <th className="text-end">Total Reward (USD)</th>
                    <th>Coins</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {rows.map(tx => (
                    <tr key={tx.transactionId}>
                        <td>{tx.txDate ? formatDate(tx.txDate) : '—'}</td>
                        <td>{tx.merchant}</td>
                        <td>{tx.category}</td>
                        <td className="text-end">{formatUSD(tx.totalRewardUsd)}</td>
                        <td>{tx.coins.map(c => c.coinType).join(', ') || '—'}</td>
                        <td className="text-end">
                            <Button size="sm" variant="outline-primary" onClick={() => onDetails(tx)}>
                                Details
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
