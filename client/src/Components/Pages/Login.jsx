import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../Css/Login.css';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLoginClick = async () => {
    setIsClicked(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/deliveryUser/login`, formData);
      if (res.data.success) {
        toast.success('Login successful!');
        localStorage.setItem('token', res.data.token);
        setTimeout(() => navigate('/dashborad-page'), 1500);
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error during login');
    }
    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-heading">FoodGenic Delivery Partner</h2>

          <input
            type="text"
            name="email"
            placeholder="Email ID"
            className="login-text"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-text"
            value={formData.password}
            onChange={handleChange}
          />

          <motion.button
            className="login-button"
            whileTap={{ scale: 0.9, rotate: -5 }}
            animate={{ scale: isClicked ? 1.1 : 1 }}
            onClick={handleLoginClick}
            disabled={isClicked}
          >
            {isClicked ? 'Logging in...' : 'Login Here'}
          </motion.button>

          <p className="login-note">
            If you don't have an account, please{' '}
            <NavLink to="/signup-page" className="signup-nav">
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
