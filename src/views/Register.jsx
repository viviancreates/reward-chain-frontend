import '../styles/base.css';
import '../styles/register.css';
import RegisterForm from '../components/RegisterForm';

export default function Register() {
  return (
    <div className="container register">
      <h2>Create Account</h2>
      <p className="sub">Create your account. A wallet will be generated for you automatically unless you provide your own.</p>
      <RegisterForm />
    </div>
  );
}
