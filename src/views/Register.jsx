// src/views/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Spinner, Form, Button } from 'react-bootstrap';

import StatusMessage from '../components/StatusMessage';
import { registerUser } from '../api/auth'; 
import '../styles/register.css';

export default function Register() {
  const nav = useNavigate();

  // form fields
  const [firstName, setFirst]     = useState('');
  const [lastName, setLast]       = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPass]       = useState('');
  const [walletAddress, setWallet]= useState('');

  // ui state
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(null);

  // modal state (shown once if backend returns a generated wallet + mnemonic)
  // { walletAddress, network, phrase }
  const [modal, setModal] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const payload = {
      firstName,
      lastName,
      email,
      password,
      network: 'ETH_MAINNET',
      ethPercent: 0.7,
      usdcPercent: 0.3,
    };
    if (walletAddress.trim()) payload.walletAddress = walletAddress.trim();

    try {
      const data = await registerUser(payload);
      // expected: { user, walletAddress, network, oneTimeMnemonic? }
      if (data?.oneTimeMnemonic) {
        setModal({
          walletAddress: data.walletAddress,
          network: data.network,
          phrase: data.oneTimeMnemonic,
        });
      } else {
        setSuccess('Account created.');
        // optional: navigate to login
        // nav('/login', { replace: true });
      }
    } catch (err) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function copyAll() {
    if (!modal) return;
    const txt =
`WALLET: ${modal.walletAddress}
NETWORK: ${modal.network}
PHRASE: ${modal.phrase}`;
    try {
      await navigator.clipboard.writeText(txt);
      setSuccess('Copied recovery info to clipboard');
    } catch {
      setError('Copy failed. Please copy manually.');
    }
  }

  return (
    <div className="container register mt-4">
      <h2 className="mb-1">Create Account</h2>
      <p className="text-muted mb-3">
        A wallet will be generated automatically unless you provide your own.
      </p>

      <StatusMessage error={error} success={success} />

      <Form className="rf-form" onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First name</Form.Label>
          <Form.Control
            value={firstName}
            onChange={e => setFirst(e.target.value)}
            placeholder="Jane"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            value={lastName}
            onChange={e => setLast(e.target.value)}
            placeholder="Doe"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPass(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Wallet address (optional)</Form.Label>
          <Form.Control
            value={walletAddress}
            onChange={e => setWallet(e.target.value)}
            placeholder="0x..."
          />
          <div className="form-text">
            Leave blank to auto-create a wallet and show a one-time recovery phrase.
          </div>
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" /> Registering…
            </>
          ) : (
            'Register'
          )}
        </Button>
        <Button
          variant="link"
          className="ms-2 p-0 align-baseline"
          onClick={() => nav('/login')}
        >
          Already have an account? Log in
        </Button>
      </Form>

      {/* One-time recovery phrase modal */}
      <Modal show={!!modal} onHide={() => setModal(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Save your recovery phrase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">Shown once. We do not store it.</p>

          <div className="mb-2 fw-semibold">Wallet</div>
          <div className="rf-mono mb-3">{modal?.walletAddress}</div>

          <div className="mb-2 fw-semibold">Network</div>
          <div className="rf-mono mb-3">{modal?.network}</div>

          <div className="mb-2 fw-semibold text-danger">Recovery phrase</div>
          <div className="rf-mono rf-phrase">{modal?.phrase}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={copyAll}>
            Copy
          </Button>
          <Button
            onClick={() => {
              setModal(null);
              setSuccess('Account created. Keep your recovery phrase safe.');
              // optional: nav('/login', { replace: true });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
