import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import AboutFitness from './components/AboutFitness';
import Login from './components/Login';
import Signup from './components/Signup';
import FitnessTracker from './components/FitnessTracker';
import WorkoutHistory from './components/WorkoutHistory';
import './App.css';

function App() {
  const [username, setUsername] = useState('');

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', { method: 'POST' });
      localStorage.removeItem('userId');  // Clear userId from localStorage
      localStorage.removeItem('username');  // Clear username from localStorage
      setUsername('');
      window.location.href = '/'; // Redirect to home page after logout
    } catch (error) {
      alert('Failed to logout');
    }
  };

  return (
    <Router>
      <div className='header1'>
        Fitness Tracker
        <div className='nav1'>
          <Link to="/">Home</Link>
          <Link to="/about-fitness">About Fitness</Link>
          {username ? (
            <>
              <button className="username-button" onClick={() => alert(`Welcome, ${username}!`)}>{username}</button>
              <button onClick={handleLogout}>Logout</button>
              <Link to="/ft">Track Details</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-fitness" element={<AboutFitness />} />
          <Route path="/login" element={<Login setUsername={setUsername} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/ft" element={<FitnessTracker />} />
          <Route path="/workout-history" element={<WorkoutHistory />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
