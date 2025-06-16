import React, { useEffect, useState } from 'react';
import '../Css/DashboardPage.css';
import { motion } from 'framer-motion';
import {  Clock, History, LogOut, User, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.jpg'

const DashboardPage = () => {
  const [timer, setTimer] = useState(() => parseInt(localStorage.getItem('dashboard_timer') || '0'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [orders, setOrders] = useState([]);
const [completedOrders, setCompletedOrders] = useState([]);
  const [showCancelOptions, setShowCancelOption] = useState(false);
  const [acceptModalOrder, setAcceptModalOrder] = useState(() => {
    const saved = localStorage.getItem('accept_modal_order');
    return saved ? JSON.parse(saved) : null;
  });
  const [collectCountdown, setCollectCountdown] = useState(() => parseInt(localStorage.getItem('collect_countdown') || '300'));
  const [deliveryCountdown, setDeliveryCountdown] = useState(() => {
    const val = localStorage.getItem('delivery_countdown');
    return val ? parseInt(val) : null;
  });
  const [deliveryStarted, setDeliveryStarted] = useState(() => localStorage.getItem('delivery_started') === 'true');
  const [otp, setOtp] = useState(() => localStorage.getItem('accept_otp') || generateOtp());
  const [removedOrderIds, setRemovedOrderIds] = useState(() => {
    const saved = localStorage.getItem('removed_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [walletAmount, setWalletAmount] = useState(() => {
    const saved = localStorage.getItem('wallet_amount');
    return saved ? parseFloat(saved) : 0;
  });

  const navigate = useNavigate();

  function generateOtp() {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    localStorage.setItem('accept_otp', newOtp);
    return newOtp;
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.post(
          'http://13.51.241.249:5000/api/deliveryUser/getUserData',
          { token },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) setUsername(res.data.data?.username || '');
      } catch (err) {
        console.error('User fetch error:', err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://13.51.241.249:5000/api/deliveryUser/placecod', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          const filtered = res.data.data.filter(order => !removedOrderIds.includes(order._id));
          setOrders(filtered);
        }
      } catch (err) {
        console.error('Order fetch error:', err);
      }
    };

    fetchUserData();
    fetchOrders();
  }, [removedOrderIds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        const updated = prev + 1;
        localStorage.setItem('dashboard_timer', updated.toString());
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!acceptModalOrder || deliveryStarted || collectCountdown <= 0) return;
    const interval = setInterval(() => {
      setCollectCountdown(prev => {
        const updated = prev - 1;
        localStorage.setItem('collect_countdown', updated.toString());
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [acceptModalOrder, collectCountdown, deliveryStarted]);

  useEffect(() => {
    if (!deliveryStarted || deliveryCountdown <= 0) return;
    const interval = setInterval(() => {
      setDeliveryCountdown(prev => {
        const updated = prev - 1;
        localStorage.setItem('delivery_countdown', updated.toString());
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [deliveryStarted, deliveryCountdown]);

  useEffect(() => {
    if (acceptModalOrder) {
      localStorage.setItem('accept_modal_order', JSON.stringify(acceptModalOrder));
      localStorage.setItem('delivery_started', deliveryStarted.toString());
    } else {
      localStorage.removeItem('accept_modal_order');
      localStorage.removeItem('accept_otp');
      localStorage.removeItem('collect_countdown');
      localStorage.removeItem('delivery_countdown');
      localStorage.removeItem('delivery_started');
    }
  }, [acceptModalOrder, deliveryStarted]);

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatMMSS = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const timerColor = () => {
    const min = Math.floor(deliveryCountdown / 60);
    if (min >= 20) return 'green';
    if (min >= 10) return 'orange';
    return 'red';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.trim().split(' ').map(part => part[0].toUpperCase()).join('');
  };

  const handleRemoveOrder = (id) => {
    const updated = [...removedOrderIds, id];
    setRemovedOrderIds(updated);
    localStorage.setItem('removed_orders', JSON.stringify(updated));
    setOrders(prev => prev.filter(order => order._id !== id));
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

  const handleAcceptClick = (order) => {
    setAcceptModalOrder(order);
    const newOtp = generateOtp();
    setOtp(newOtp);
    localStorage.setItem('accept_modal_order', JSON.stringify(order));
    localStorage.setItem('accept_otp', newOtp);
    setCollectCountdown(300);
    localStorage.setItem('collect_countdown', '300');
    setDeliveryStarted(false);
    setDeliveryCountdown(null);
  };

  const handleCollectOrder = () => {
    setDeliveryStarted(true);
    localStorage.setItem('delivery_started', 'true');
    setDeliveryCountdown(1800);
    localStorage.setItem('delivery_countdown', '1800');
  };

    const handleDeliverSuccess = () => {
    const amt = acceptModalOrder.amount || 0;
    const bonus = amt <= 200 ? amt * 0.2 : amt * 0.3;
    const updatedWallet = walletAmount + bonus;
    setWalletAmount(updatedWallet);
    localStorage.setItem('wallet_amount', updatedWallet.toFixed(2));

    // Save to Order History
    const prev = JSON.parse(localStorage.getItem('completed_orders') || '[]');
    const updatedHistory = [...prev, acceptModalOrder];
    localStorage.setItem('completed_orders', JSON.stringify(updatedHistory));
    setCompletedOrders(updatedHistory);

    // Remove from active orders
    handleRemoveOrder(acceptModalOrder._id);
    setAcceptModalOrder(null);
    navigate('/dashborad-page');
  };


  const CANCEL_REASONS = [
    "Customer not available",
    "Restaurant delayed the order",
    "Wrong address",
    "Delivery boy not available",
    "Traffic/Weather issue",
    "Other"
  ];

  const handleCancelOrder = (reason) => {
    console.log('Cancelled due to:', reason);
    setAcceptModalOrder(null);
    setDeliveryStarted(false);
    setCollectCountdown(300);
    setDeliveryCountdown(null);
    setShowCancelOption(false);
  };

  return (
    <div className='dashboard-container'>
      <div className='top-bar'>
        <div className='company-logo'><img src={logo} alt='logo' className='site-logo' /></div>
        <div className='timer-section'><Clock /><span className='timer'>{formatTime(timer)}</span></div>
        <div className='top-right'>
          <div className='wallet'>💰 ₹ {walletAmount.toFixed(2)}</div>
          <div className='user-photo' onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className='avatar-placeholder'>{getInitials(username)}</div>
            {dropdownOpen && (
              <div className='dropdown'>
                <div className='dropdown-item'><User size={16} /> {username || 'My Account'}</div>
                <div className='dropdown-item'><History size={16} /><NavLink to='/order-history' className='nav'>Order History</NavLink></div>
                <div className='dropdown-item' onClick={handleLogout}><LogOut size={16} /> Log Out</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Section */}
      <div className='dashboard-order-section'>
        <h2 className='dashboard-order-heading'>Delivery Orders</h2>
        <div className='dashboard-order-card'>
          {orders.length === 0 ? <p>No orders found.</p> : orders.map((order, i) => (
            <motion.div key={order._id} className='order-card' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className='order-header'>
                <span>🧾 Order #{order._id?.slice(-6)?.toUpperCase()}</span>
                <span className='remove-icon' onClick={() => handleRemoveOrder(order._id)}><X size={18} color='red' /></span>
              </div>
              <div className='order-customer-info'>
                <h4>Customer Details:</h4>
                <p><strong>Name:</strong> {order.address?.firstName || 'N/A'}</p>
                <p><strong>Address:</strong> {order.address?.street || 'N/A'}, {order.address?.city || ''}</p>
                <p><strong>Phone:</strong> {order.address?.phone || 'N/A'}</p>
              </div>
              <div className='order-footer'>
                <span>💰 Amount: ₹{order.amount || 0}</span>
                <span>Status: {order.status}</span>
              </div>
              <div className='order-actions'>
                <motion.button className='order-btn details' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedOrder(order)}>🛍️ Order Details</motion.button>
                <motion.button className='order-btn accept' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAcceptClick(order)}>✅ Accept It</motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Order Modal */}
      {selectedOrder && (
        <div className='modal-overlay' onClick={() => setSelectedOrder(null)}>
          <motion.div className='modal-content' onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <button className='modal-close-btn' onClick={() => setSelectedOrder(null)}>×</button>
            <h2>Order Details - #{selectedOrder._id?.slice(-6)?.toUpperCase()}</h2>
            <div><h3>Customer Info</h3>
              <p><strong>Name:</strong> {selectedOrder.address?.firstName}</p>
              <p><strong>Address:</strong> {selectedOrder.address?.street}, {selectedOrder.address?.city}</p>
              <p><strong>Phone:</strong> {selectedOrder.address?.phone}</p></div>
            <div><h3>Items</h3>
              {selectedOrder.items.map((item, idx) => (
                <p key={idx}><strong>{item.name}</strong> — Qty: {item.quantity}</p>
              ))}
              <p><strong>Amount:</strong> ₹{selectedOrder.amount}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p></div>
          </motion.div>
        </div>
      )}

      {/* Accept Modal */}
      {acceptModalOrder && (
        <div className='accept-modal-overlay'>
          <motion.div className='accept-modal-content' initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h2>Order #{acceptModalOrder._id.slice(-6).toUpperCase()}</h2>
            {deliveryStarted ? (
              <>
                {deliveryCountdown > 0 ? (
                  <p style={{ color: timerColor(), fontSize: "24px" }}>🚚 Delivery Countdown: {formatMMSS(deliveryCountdown)}</p>
                ) : (
                  <p style={{ color: 'gray' }}>⏱️ Time's up!</p>
                )}
                <button className="accept-collect-button" onClick={handleDeliverSuccess}>Deliver Successfully</button>
              </>
            ) : (
              <>
                <p className="accept-time-remaining">⏱️ Time Left: {formatMMSS(collectCountdown)}</p>
                {collectCountdown <= 120 && (
                  <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Hurry up... collect the order!</p>
                )}
                <h3 className="accept-otp">🔒 OTP: <span style={{ fontFamily: 'monospace' }}>{otp}</span></h3>
                <div className="accept-modal-actions">
                  {!showCancelOptions ? (
                    <button className="accept-cancel-btn" onClick={() => setShowCancelOption(true)}>❌ Cancel</button>
                  ) : (
                    <div className="cancel-reasons">
                      <p>Select Reason for Cancellation:</p>
                      {CANCEL_REASONS.map((reason, index) => (
                        <button key={index} className="cancel-reason-btn" onClick={() => handleCancelOrder(reason)}>{reason}</button>
                      ))}
                      <button onClick={() => setShowCancelOption(false)} style={{ marginTop: '10px', color: 'red' }}>⬅ Back</button>
                    </div>
                  )}
                  <button className="accept-collect-btn" onClick={handleCollectOrder}>✅ Collect Order</button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
