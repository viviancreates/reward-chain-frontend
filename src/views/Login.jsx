import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Form } from 'react-bootstrap';
import StatusMessage from '../components/StatusMessage';
import { login as fetchLogin } from '../api/auth'
import '../styles/auth.css';
import Button from '../components/AppButton';

export default function Login() {
  const nav = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetchLogin(email, password);
      localStorage.setItem('auth', JSON.stringify(res));
      setSuccess('Logged in');
      nav('/profile', { replace: true });
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container auth-page mt-4">
      <h2 className="title mb-1">Login</h2>
      <p className="text-muted mb-3">Enter your email and password to continue.</p>

      <StatusMessage error={error} success={success} />

      <Form className="auth-form" onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </Form.Group>

        <Button type="submit" busy={loading} busyText="Logging in…">
          Log in
        </Button>
      </Form>
    </div>
  );
}
