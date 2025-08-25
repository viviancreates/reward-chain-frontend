import { useState } from 'react';
import { registerUser } from '../api/auth';
import '../styles/register.css';

export default function RegisterForm() {
  const [firstName, setFirst] = useState('');
  const [lastName,  setLast]  = useState('');
  const [email,     setEmail] = useState('');
  const [password,  setPass]  = useState('');
  const [walletAddress, setWallet] = useState(''); // optional

  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // { walletAddress, network, phrase }

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    const payload = {
      firstName, lastName, email, password,
      network: 'ETH_MAINNET',
      ethPercent: 0.7,
      usdcPercent: 0.3,
    };
    if (walletAddress.trim() !== '') payload.walletAddress = walletAddress.trim();

    try {
      const data = await registerUser(payload); // { user, walletAddress, network, oneTimeMnemonic? }
      if (data.oneTimeMnemonic) {
        setModal({
          walletAddress: data.walletAddress,
          network: data.network,
          phrase: data.oneTimeMnemonic,
        });
        return; // just show the modal and stop
      } else {
        alert('Account created.');
      }
    } catch (err) {
      setError(err?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  const copyAll = async () => {
    if (!modal) return;
    const txt = `WALLET: ${modal.walletAddress}
NETWORK: ${modal.network}
PHRASE: ${modal.phrase}`;
    try { await navigator.clipboard.writeText(txt); alert('Copied'); } catch {}
  };

  return (
    <>
      <form className="rf-form" onSubmit={onSubmit}>
        <input className="rf-input" placeholder="First name" value={firstName} onChange={e=>setFirst(e.target.value)} required />
        <input className="rf-input" placeholder="Last name"  value={lastName}  onChange={e=>setLast(e.target.value)}  required />
        <input className="rf-input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="rf-input" placeholder="Password" type="password" value={password} onChange={e=>setPass(e.target.value)} required />
        <input className="rf-input" placeholder="Wallet address (optional)" value={walletAddress} onChange={e=>setWallet(e.target.value)} />

        <button className="rf-button" disabled={busy}>
          {busy ? 'Registering…' : 'Register'}
        </button>

        {error && <div className="rf-message rf-error">{error}</div>}
        <div className="rf-message">If you leave the wallet blank, we’ll create one for you automatically.</div>
      </form>

      {modal && (
        <div className="rf-modalOverlay">
          <div className="rf-modalBox">
            <h3>Save your recovery phrase</h3>
            <p className="rf-sub">Shown once. We do not store it.</p>

            <div className="rf-label">Wallet</div>
            <div className="rf-mono">{modal.walletAddress}</div>

            <div className="rf-label">Network</div>
            <div className="rf-mono">{modal.network}</div>

            <div className="rf-label rf-warn">Recovery phrase</div>
            <div className="rf-mono rf-phrase">{modal.phrase}</div>

            <div className="rf-actions">
              <button type="button" className="rf-button rf-outline" onClick={copyAll}>Copy</button>
              <button type="button" className="rf-button" onClick={()=>setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
