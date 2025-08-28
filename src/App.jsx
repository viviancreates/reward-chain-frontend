import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/base.css';
import NavBar from './components/NavBar';
import Register from './views/Register';
import Login from './views/Login';
import Profile from './views/Profile';
import RequireAuth from './components/RequireAuth';
import Transactions from './views/Transactions';
import Analytics from './views/Analytics';
import Rules from './views/Rules';
import Categories from './views/Categories';
import Rewards from './views/Rewards';
import Landing from "./views/Landing";

import Spend from './views/Spend';
import Catalog from './views/Catalog';
import ProfileDashboard from './views/ProfileDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* protected pages */}
        <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
        <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
        <Route path="/rules" element={<RequireAuth><Rules /></RequireAuth>} />
        <Route path="/categories" element={<RequireAuth><Categories /></RequireAuth>} />
        <Route path="/rewards" element={<RequireAuth><Rewards /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfileDashboard /></RequireAuth>} />
        <Route path="/spend" element={<RequireAuth><Spend /></RequireAuth>} />
        <Route path="/catalog" element={<RequireAuth><Catalog /></RequireAuth>} />
        <Route path="/rewards" element={<RequireAuth><Rewards /></RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  );
}
