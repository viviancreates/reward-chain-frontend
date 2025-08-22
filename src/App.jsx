import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/base.css';
import NavBar from './components/NavBar';
import Register from './views/Register';
import Login from './views/Login';
import Profile from './views/Profile';
import RequireAuth from './components/RequireAuth';

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
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
