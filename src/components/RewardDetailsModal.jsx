import { Modal, Table } from 'react-bootstrap';
import StatsCard from './StatsCard';
import Status from './Status';
import { formatDate, formatUSD } from '../scripts/formatting';

export default function RewardDetailsModal({ show, onHide, tx }) {
  if (!tx) return null;

  const totalUsd = tx.coins.reduce((s, c) => s + Number(c.rewardAmountUsd || 0), 0);
  const pct = tx.rewardPercentage != null ? Number(tx.rewardPercentage) : null;

  // If coin statuses differ, show MIXED
  const unique = [...new Set(tx.coins.map(c => c.status || 'PENDING'))];
  const rollup = unique.length === 1 ? unique[0] : 'MIXED';

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Reward Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <div className="fw-semibold">{tx.merchant}</div>
          <div className="text-muted small">
            {tx.category} • {tx.txDate ? formatDate(tx.txDate) : '—'}
          </div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <StatsCard label="Total Spent">
              {formatUSD(tx.amount || 0)}
            </StatsCard>
          </div>
          <div className="col-md-6">
            <StatsCard label="Total Reward (USD)">
              {formatUSD(totalUsd)}
            </StatsCard>
          </div>
        </div>

        {pct != null && (
          <div className="mb-3 text-muted">
            Category Rule (current): <strong>{(pct * 100).toFixed(0)}%</strong>
          </div>
        )}

        <h6 className="mb-2">Allocation</h6>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Coin</th>
              <th className="text-end">Reward (USD)</th>
              <th className="text-end">Reward (Crypto)</th>
              <th className="text-end">Coin Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tx.coins.map(c => (
              <tr key={c.rewardId}>
                <td>{c.coinType}</td>
                <td className="text-end">{formatUSD(c.rewardAmountUsd)}</td>
                <td className="text-end">{Number(c.rewardAmountCrypto || 0).toFixed(8)}</td>
                <td className="text-end">{formatUSD(c.coinPriceUsd)}</td>
                <td><Status status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
