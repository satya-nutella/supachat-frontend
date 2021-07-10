import React from "react";
import { Button, Card, Container } from "react-bootstrap";
import { Redirect, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/auth.context";

export default function Login() {
  const history = useHistory();
  const { currentUser, signIn } = useAuth();

  if (currentUser) {
    return <Redirect to="/" />
  }

  const handleLogin = () => {
    signIn()
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">
              Register with your Google Account
            </h2>
            <Button className="w-100" onClick={handleLogin}>
              Continue with Google
            </Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
