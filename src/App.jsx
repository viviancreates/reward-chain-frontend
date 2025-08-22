import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/base.css';
import NavBar from './components/NavBar';
import Register from './views/Register';
import Login from './views/Login';
import Profile from './views/Profile';
import RequireAuth from './components/RequireAuth';
import Transactions from './views/Transactions';
import Analytics from './views/Analytics';  
import Allocations from './views/Allocations';

function Home() {
  return (
    <div className="container">
      <h2>Reward Chain (Frontend)</h2>
      <p>Hi, this is the landing/home page </p>
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
        <Route path="/analytics" element={<RequireAuth><Analytics/></RequireAuth>} />
        <Route path="/allocations" element={<RequireAuth><Allocations/></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
