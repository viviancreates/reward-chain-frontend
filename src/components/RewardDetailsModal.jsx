import { Modal, Table } from 'react-bootstrap';
import StatsCard from './StatsCard';
import Status from './Status';
import { formatDate, formatUSD } from '../scripts/formatting';
import Button from './AppButton';

export default function RewardDetailsModal({ show, onHide, tx, onPayout }) {
  if (!tx) return null;

  const totalUsd = tx.coins.reduce((s, c) => s + Number(c.rewardAmountUsd || 0), 0);
  
  // If coin statuses differ, show MIXED
  const unique = [...new Set(tx.coins.map(c => c.status || 'PENDING'))];
  const rollup = unique.length === 1 ? unique[0] : 'MIXED';

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Deposit Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <div className="fw-semibold">{tx.merchant}</div>
          <div className="text-muted small">
            {tx.category} • {tx.txDate ? formatDate(tx.txDate) : '—'}
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-4"><StatsCard label="Total Spent">{formatUSD(tx.amount || 0)}</StatsCard></div>
          <div className="col-md-4"><StatsCard label="Total Deposit (USD)">{formatUSD(totalUsd)}</StatsCard></div>
          <div className="col-md-4"><StatsCard label="Status"><Status status={rollup} /></StatsCard></div>
        </div>

        <h6 className="mb-2">Allocation</h6>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Coin</th>
              <th className="text-end">Deposit (USD)</th>
              <th className="text-end">Deposit (Crypto)</th>
              <th className="text-end">Coin Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tx.coins.map(c => {
              const isDone = c.status === 'COMPLETED';
              return (
                <tr key={c.rewardId}>
                  <td>{c.coinType}</td>
                  <td className="text-end">{formatUSD(c.rewardAmountUsd)}</td>
                  <td className="text-end">{Number(c.rewardAmountCrypto || 0).toFixed(8)}</td>
                  <td className="text-end">{formatUSD(c.coinPriceUsd)}</td>
                  <td>
                    <div className="d-flex flex-column">
                      <Status status={c.status} />
                      {c.transactionHash ? (
                        <span className="small text-muted mt-1">{c.transactionHash}</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="text-end">
                    {isDone ? null : (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => onPayout?.(c)} // pass the coin to parent
                      >
                        Payout
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
