import { useState } from 'react';
import { registerUser } from '../api/users';
import '../styles/register.css';

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    walletAddress: '', network: 'ETH_MAINNET', ethPercent: 0.7, usdcPercent: 0.3
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg('');
    try {
      const u = await registerUser(form);
      setMsg(`Registered: #${u.userId} ${u.firstName} ${u.lastName}`);
      // Clear just the text fields
      setForm(f => ({ ...f, firstName:'', lastName:'', email:'', password:'', walletAddress:'' }));
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
        <input className="input" name="walletAddress" placeholder="Wallet address" value={form.walletAddress} onChange={onChange} required />
        <button className="button" disabled={busy}>{busy ? 'Registering…' : 'Register'}</button>
      </form>
      {msg && <p className="message">{msg}</p>}
    </>
  );
}
