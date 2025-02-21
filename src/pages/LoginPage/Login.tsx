import React, { useState } from "react";
import { useLoginUserMutation } from "../../services/authApi";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import "./Login.css"; // Import the new CSS file
import logo from "../../assets/images/logo-dark.png"; // Adjust the path for your logo

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password }).unwrap();
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="login-box col-4">
          <img src={logo} alt="Logo" className="login-logo" />
          <Form onSubmit={handleSubmit} className="p-4">
            <h3 className="text-center">Login</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" disabled={isLoading} className="mt-3 w-100">
              {isLoading ? <Spinner animation="border" size="sm" /> : "Login"}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Login;
