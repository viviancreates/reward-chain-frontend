import { Link } from 'react-router-dom';
import '../styles/nav.css';

export default function NavBar() {
  return (
    <nav className="nav">
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}
