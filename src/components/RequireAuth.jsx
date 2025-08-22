import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  return auth ? children : <Navigate to="/login" replace />;
}
