import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/base.css';
import NavBar from './components/NavBar';
import Register from './views/Register';
import Login from './views/Login';
import Profile from './views/Profile';
import RequireAuth from './components/RequireAuth';
import Transactions from './views/Transactions';

function Home() {
  return (
    <div className="container">
      <h2>Reward Chain (Frontend)</h2>
      <p>Use the nav to register or login.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
         {/* protect pages */}
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
