import '../styles/base.css';
import '../styles/auth.css';
import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <div className="container auth-page">
      <h2 className="title">Login</h2>
      <p className="sub">Enter your email and password to continue.</p>
      <LoginForm />
    </div>
  );
}
