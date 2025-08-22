import { useState } from 'react';
import { loginUser } from '../api/auth';
import '../styles/auth.css';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg('');
    try {
      const res = await loginUser(form); // expect token/user
      // Example: save token for later API calls
      if (res?.token) localStorage.setItem('rc_token', res.token);
      setMsg('Logged in');
    } catch (err) {
      setMsg(`${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <form className="form" onSubmit={onSubmit}>
        <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <button className="button" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
      </form>
      {msg && <p className="message">{msg}</p>}
    </>
  );
}
