import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css"; // for the navy override

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
        <Navbar.Brand as={Link} to="/">Reward Chain</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            {!auth && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
            {auth && <Nav.Link as={Link} to="/profile">Profile</Nav.Link>}
          </Nav>
          <Nav>
            {auth && (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
