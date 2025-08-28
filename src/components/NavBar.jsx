import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css"; // for the navy override
import PrimeroLogo from "./PrimeroLogo";
import profileIcon from "../assets/user.png";

export default function AppNavBar() {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    nav("/login");
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="navbar-navy">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <PrimeroLogo size="sm" mono as="div" className="me-2" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">

          <Nav className="me-auto">
            {!auth && (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            )}

            {auth && (
              <>
              <Nav.Link as={Link} to="/catalog">Catalog</Nav.Link>
                <Nav.Link as={Link} to="/spend">Transactions</Nav.Link>
                 <Nav.Link as={Link} to="/rewards">Rewards</Nav.Link>
                <Nav.Link as={Link} to="/analytics">Analytics</Nav.Link>
                
               
              </>
            )}
          </Nav>

          {/* right-side nav: profile image + logout */}
          {auth && (
            <Nav className="align-items-center">
              <Nav.Link as={Link} to="/profile" className="p-0 me-3">
                <img
                  src={profileIcon}
                  alt="Profile"
                  className="nav-profile-img"
                />
              </Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          )}

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
