import { useState } from 'react';
import { registerUser } from '../api/auth';
import '../styles/auth.css';

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
    // walletAddress: '',   // removed from default state
    network:   'ETH_MAINNET',
    ethPercent: 0.7,
    usdcPercent: 0.3,
  });

  const [showAdvanced, setShowAdvanced] = useState(false); // optional toggle
  const [busy, setBusy] = useState(false);
  const [msg, setMsg]   = useState('');

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg('');

    // Build payload WITHOUT walletAddress unless user explicitly entered it.
    const payload = { ...form };
    if (!payload.walletAddress || payload.walletAddress.trim() === '') {
      delete payload.walletAddress;
    }

    try {
      const u = await registerUser(payload);
      setMsg(`Registered: #${u.userId} ${u.firstName} ${u.lastName}`);
      setForm(f => ({
        ...f,
        firstName:'', lastName:'', email:'', password:'',
        // walletAddress: '',
      }));
    } catch (err) {
      setMsg(`${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <form className="form" onSubmit={onSubmit}>
        <input className="input" name="firstName" placeholder="First name" value={form.firstName} onChange={onChange} required />
        <input className="input" name="lastName"  placeholder="Last name"  value={form.lastName}  onChange={onChange} required />
        <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />

        {/* Advanced (optional): let power users type a wallet address */}
        <details style={{marginTop:8}} open={showAdvanced} onToggle={(e)=>setShowAdvanced(e.target.open)}>
          <summary>Provide your own wallet (A wallet will be generated for you automatically unless you provide your own.)</summary>
          <div style={{marginTop:8, display:'grid', gap:12}}>
            <input
              className="input"
              name="walletAddress"
              placeholder="Wallet address (leave blank to auto-generate)"
              value={form.walletAddress || ''}
              onChange={onChange}
            />
            <input
              className="input"
              name="network"
              placeholder="Network"
              value={form.network}
              onChange={onChange}
            />
          </div>
        </details>

        <button className="button" disabled={busy}>
          {busy ? 'Registering…' : 'Register'}
        </button>
      </form>

      <p className="message" style={{marginTop:8}}>
        If you leave the wallet blank, we’ll create one for you automatically.
      </p>

      {msg && <p className="message">{msg}</p>}
    </>
  );
}
