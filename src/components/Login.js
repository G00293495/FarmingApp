import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: ''
  });
  const [isRegister, setIsRegister] = useState(false);
  const { login, register, error, loading } = useAuth();

  const { username, password, name } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (isRegister) {
      await register(formData);
    } else {
      await login({ username, password });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>FarmPulse</h1>
        <h2>The ultimate app for farmers</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          
          {isRegister && (
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
          </button>
          
          <p className="toggle-form">
            {isRegister ? 'Already have an account?' : "Don't have an account?"} 
            <button 
              type="button" 
              onClick={() => setIsRegister(!isRegister)}
              className="toggle-button"
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;