import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router";

export default function NavBar() {
  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="sm" collapseOnSelect>
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          🧠 Quiz Master
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end eventKey="home">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/stats" eventKey="stats">
              Stats
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}