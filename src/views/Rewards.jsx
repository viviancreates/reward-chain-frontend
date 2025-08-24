// src/views/Rewards.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Alert,
  Spinner,
  Accordion,
  Table,
  Badge,
  Row,
  Col
} from 'react-bootstrap';
import { getUserTransactions } from '../api/transactions';
import { getUserRewards } from '../api/rewards';

export default function Rewards() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  const [txs, setTxs] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!auth) return;
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const [txList, rwList] = await Promise.all([
          getUserTransactions(auth.userId),
          getUserRewards(auth.userId),
        ]);
        if (!ignore) {
          setTxs(txList || []);
          setRewards(rwList || []);
        }
      } catch (e) {
        if (!ignore) setErr(e.message || 'Failed to load rewards');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [auth?.userId]);

  const rewardsByTx = useMemo(() => {
    const map = new Map();
    for (const r of rewards) {
      if (!map.has(r.transactionId)) map.set(r.transactionId, []);
      map.get(r.transactionId).push(r);
    }
    return map;
  }, [rewards]);

  const fmtUSD = (n) =>
    Number(n).toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  const statusVariant = (s) =>
    s === 'COMPLETED' ? 'success' : s === 'FAILED' ? 'danger' : 'warning';

  if (!auth) return <Alert variant="warning">Please log in.</Alert>;
  if (loading) return (
    <Container className="mt-3">
      <Spinner animation="border" role="status" />
    </Container>
  );

  return (
    <Container className="mt-3">
      <h3 className="mb-3">Rewards per Transaction</h3>
      {err && <Alert variant="danger" className="mb-3">{err}</Alert>}

      {txs.length === 0 ? (
        <Alert variant="info">No transactions yet.</Alert>
      ) : (
        <Accordion alwaysOpen>
          {txs.map((t, idx) => {
            const group = rewardsByTx.get(t.transactionId) || [];
            const totalUsd = group.reduce((s, r) => s + Number(r.rewardAmountUsd || 0), 0);

            return (
              <Accordion.Item eventKey={String(idx)} key={t.transactionId}>
                <Accordion.Header>
                  <Row className="w-100">
                    <Col xs={12} lg={7}>
                      <strong>{t.merchant}</strong>
                      {' • '}
                      {t.categoryName ?? `Category #${t.categoryId}`}
                      {' • '}
                      {t.transactionDate ? new Date(t.transactionDate).toLocaleString() : '—'}
                    </Col>
                    <Col xs={12} lg={5} className="text-lg-end">
                      Tx: <strong>{fmtUSD(t.amount)}</strong>
                      {'  |  '}
                      Rewards: <strong>{fmtUSD(totalUsd)}</strong>
                    </Col>
                  </Row>
                </Accordion.Header>

                <Accordion.Body>
                  {group.length === 0 ? (
                    <Alert variant="secondary" className="mb-0">
                      No rewards calculated for this transaction yet.
                    </Alert>
                  ) : (
                    <Table size="sm" hover responsive className="mb-0">
                      <thead>
                        <tr>
                          <th>Coin</th>
                          <th className="text-end">% (cat)</th>
                          <th className="text-end">USD</th>
                          <th className="text-end">Crypto</th>
                          <th className="text-end">Coin Price</th>
                          <th>Status</th>
                          <th>Tx Hash</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.map((r) => (
                          <tr key={r.rewardId}>
                            <td>{r.coinType}</td>
                            <td className="text-end">{(Number(r.rewardPercentage) * 100).toFixed(2)}%</td>
                            <td className="text-end">{fmtUSD(r.rewardAmountUsd)}</td>
                            <td className="text-end">{Number(r.rewardAmountCrypto).toFixed(8)}</td>
                            <td className="text-end">{fmtUSD(r.coinPriceUsd)}</td>
                            <td>
                              <Badge bg={statusVariant(r.status)}>{r.status}</Badge>
                            </td>
                            <td className="text-truncate" style={{ maxWidth: 160 }}>
                              {r.transactionHash ?? '—'}
                            </td>
                            <td>{r.createdDate ? new Date(r.createdDate).toLocaleString() : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      )}
    </Container>
  );
}
