import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg('');
    try {
      const res = await login(email, password); // expects { userId, firstName, lastName, email, token? }
      localStorage.setItem('auth', JSON.stringify(res));
      nav('/profile', { replace: true });
    } catch (err) {
      setMsg(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <input className="input" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
      <input className="input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
      <button className="button" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      {msg && <p className="message">{msg}</p>}
    </form>
  );
}

