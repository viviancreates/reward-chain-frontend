import '../styles/base.css';
import '../styles/register.css';
import RegisterForm from '../components/RegisterForm';

export default function Register() {
  return (
    <div className="container register">
      <h2>Create Account</h2>
      <p className="sub">Register a new user and wallet. (Network/allocations are preset.)</p>
      <RegisterForm />
    </div>
  );
}
