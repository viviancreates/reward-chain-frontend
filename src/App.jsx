import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/base.css';
import NavBar from './components/NavBar';
import Register from './views/Register';
import Login from './views/Login';
import RequireAuth from './components/RequireAuth';
import Analytics from './views/Analytics';
import Rewards from './views/Rewards';
import Landing from "./views/Landing";
import Profile from "./views/ProfileDashboard"
import Spend from './views/Spend';
import Catalog from './views/Catalog';


export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* protected pages */}
        <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
        <Route path="/rewards" element={<RequireAuth><Rewards /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/catalog" element={<RequireAuth><Catalog /></RequireAuth>} />
        <Route path="/spend" element={<RequireAuth><Spend /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
