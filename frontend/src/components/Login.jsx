import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Login({ setUsername }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid email or password');

      const { userId, username } = await response.json();  // Expecting userId and username
      localStorage.setItem('userId', userId);  // Store userId in localStorage
      localStorage.setItem('username', username);  // Store username in localStorage
      setUsername(username);  // Update username in App component

      window.location.href = '/ft';  // Redirect to fitness tracker page after login
    } catch (error) {
      setError(error.message);  // Display error message
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}  {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}

export default Login;
