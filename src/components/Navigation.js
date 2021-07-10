import React from "react";
import { Link } from "react-router-dom";
import { Button, Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../contexts/auth.context";

export default function Navigation() {
  const { signOut } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" className="justify-content-between">
      <Navbar.Brand className="p-2">
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          Superchat 💬
        </Link>
      </Navbar.Brand>
      <Nav className="p-2">
        <Button onClick={signOut}>Logout</Button>
      </Nav>
    </Navbar>
  );
}
