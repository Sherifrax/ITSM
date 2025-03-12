import React, { useState } from "react";
import { useLoginUserMutation } from "../../services/authApi";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file for styling
import logo from "../../assets/images/logo-dark.png"; // Adjust the path for your logo
import PageMeta from "../../components/common/PageMeta";

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
      navigate("/home");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-page">
        <PageMeta
        title="Login"
        description=""
      />
      <div className="login-container">
        <div className="login-box">
          <img src={logo} alt="Logo" className="login-logo" />
          <form onSubmit={handleSubmit} className="login-form">
            <h3 className="login-title">Login</h3>
            {error && <div className="login-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? <div className="spinner"></div> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;