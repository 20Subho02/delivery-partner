import React, { useState, useEffect } from 'react';
import '../Css/OrderHistoryPage.css';
import { motion } from 'framer-motion';
import { Bell, Clock, HelpCircle, History, LogOut, User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderHistoryPage = () => {
  const [timer, setTimer] = useState(() => parseInt(localStorage.getItem('dashboard_timer') || '0'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({
    totalDelivered: 0,
    totalCancelled: 0,
    totalEarnings: 0,
  });

  const [walletAmount, setWalletAmount] = useState(() => {
    const saved = localStorage.getItem('wallet_amount');
    return saved ? parseFloat(saved) : 0;
  });

  const navigate = useNavigate();

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        const updated = prev + 1;
        localStorage.setItem('dashboard_timer', updated.toString());
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.trim().split(' ').map(part => part[0].toUpperCase()).join('');
  };

  const handleLogout = () => {
    const removed = localStorage.getItem('removed_orders');
    localStorage.clear();
    if (removed) localStorage.setItem('removed_orders', removed);
    setUsername('');
    setTimer(0);
    navigate('/');
    window.location.reload();
  };

  // Fetch username from backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.post(
          'http://13.232.42.76:5000/api/deliveryUser/getUserData',
          { token },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setUsername(res.data.data?.username || '');
        }
      } catch (err) {
        console.error('User fetch error:', err);
      }
    };
    fetchUserData();
  }, []);

  // Load order history and summary
  useEffect(() => {
    const savedOrders = localStorage.getItem('completed_orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (!Array.isArray(parsed)) {
          console.warn('completed_orders in localStorage is not an array');
          return;
        }

        setHistory(parsed);

        const deliveredOrders = parsed.filter(order =>
          order.status === 'delivered' || order.completedAt
        );
        const cancelledOrders = parsed.filter(order => order.status === 'cancelled');

        const totalEarnings = deliveredOrders.reduce((sum, order) => {
          const amount = order.amount ?? order.totalAmount ?? 0;
          return sum + amount;
        }, 0);

        setSummary({
          totalDelivered: deliveredOrders.length,
          totalCancelled: cancelledOrders.length,
          totalEarnings,
        });
      } catch (err) {
        console.error('Failed to parse completed_orders from localStorage:', err);
      }
    }
  }, []);

  return (
    <div className='dashborad-container'>
      {/* Top Bar */}
      <div className='top-bar'>
        <div className='company-logo'>
          <img src='image/logo.ico' alt='logo' /> FoodGenic
        </div>
        <div className='timer-section'>
          <Clock />
          <span className='timer'>{formatTime(timer)}</span>
        </div>
        <div className='top-right'>
          <div className='wallet'>💰 ₹ {walletAmount.toFixed(2)}</div>
          <motion.div
            className='icon'
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.6 }}
          >
            <Bell />
          </motion.div>
          <div className='user-photo' onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className='avatar-placeholder'>{getInitials(username)}</div>
            {dropdownOpen && (
              <div className='dropdown'>
                <div className='dropdown-item'><User size={16} /> {username || 'My Account'}</div>
                <div className='dropdown-item'><History size={16} /><NavLink to='/order-history' className='nav'>Order History</NavLink></div>
                <div className='dropdown-item'><HelpCircle size={16} /> Help</div>
                <div className='dropdown-item' onClick={handleLogout}><LogOut size={16} /> Log Out</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Boxes */}
      <div className="summary-boxes">
        <motion.div className="summary-box" whileHover={{ scale:1 }} whileTap={{ scale: 0.65 }}>
          <h3>💰 Total Earnings</h3>
          <p>₹ {walletAmount.toFixed(2)}</p>
        </motion.div>
      </div>

      {/* Order History */}
      <div className='order-history-section'>
        <h2 className='dashborad-order-heading'>Order History</h2>
        <div className='dashboard-order-card'>
          {history.length === 0 ? (
            <p>No delivered orders yet.</p>
          ) : (
            <div className="history-list">
              {history.map((order, i) => (
                <div key={order._id || i} className="history-card">
                  <h3>Order #{order._id?.slice(-6).toUpperCase() || 'N/A'}</h3>
                  <p><strong>Name:</strong> {order.address?.firstName || 'N/A'} {order.address?.lastName || ''}</p>
                  <p><strong>Phone:</strong> {order.address?.phone || 'N/A'}</p>
                  <p><strong>Amount:</strong> ₹{(order.amount ?? order.totalAmount ?? 0).toFixed(2)}</p>
                  <p><strong>Status:</strong> {order.status === 'cancelled' ? 'Cancelled' : 'Delivered'}</p>
                  <ul>
                    {order.items?.map((item, idx) => (
                      <li key={idx}>{item.name} — Qty: {item.quantity}</li>
                    ))}
                  </ul>
                  {order.completedAt && (
                    <p className="delivered-time">
                      <strong>Delivered on:</strong> {new Date(order.completedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
