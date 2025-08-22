import { useNavigate } from 'react-router-dom';
import '../styles/base.css';

export default function Profile() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  const nav = useNavigate();

  if (!auth) return <p>Please log in.</p>;

  return (
    <div className="card">
      <h2>Welcome, {auth.firstName}</h2>
      <p>User ID: {auth.userId}</p>
      <p>Email: {auth.email}</p>
    </div>
  );
}
