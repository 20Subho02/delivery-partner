import React, { useState } from 'react';
import '../Css/Signup.css';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.jpg'

const Signup = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [data, setData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    if (!isChecked) {
      toast.warn("Please accept the Terms & Conditions before signing up.");
      return;
    }

    if (!data.username || !data.email || !data.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsClicked(true);
    try {
      const response = await axios.post('http://15.206.209.235:5000/api/deliveryUser/register', data);
      if (response.data.success) {
        toast.success("Signup successful!");
        navigate('/account-create-form');
      } else {
        toast.error(response.data.message || "Signup failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <div className='signup-page'>
    <img src={logo} alt='logo' className='site-logo' />
      <div className='signup-container'>
        <div className='signup-box'>
          <h2 className='signup-heading'>FoodGenie Delivery Partner</h2>

          <input
            type='text'
            placeholder='Name'
            className='signup-text'
            name='username'
            value={data.username}
            onChange={onChangeHandler}
          />
          <input
            type='email'
            placeholder='Email ID'
            className='signup-text'
            name='email'
            value={data.email}
            onChange={onChangeHandler}
          />
          <input
            type='password'
            placeholder='Password'
            className='signup-text'
            name='password'
            value={data.password}
            onChange={onChangeHandler}
          />

          <div className='terms-checkbox'>
            <input
              type="checkbox"
              id="terms"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <label htmlFor="terms" style={{ color: '#111', fontSize: '13px', fontWeight: 'bold' }}>
              I agree to all the Terms & Conditions
            </label>
          </div>

          <motion.button
            className='signup-button'
            whileTap={{ scale: 0.9, rotate: -5 }}
            animate={{ scale: isClicked ? 1.1 : 1 }}
            onClick={handleSignup}
            disabled={isClicked}
          >
            {isClicked ? "Processing..." : "Signup"}
          </motion.button>

          <p className='login-note'>
            If you already have an account, please <NavLink to='/' className='login-nav'>Login</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
