import React, { useState } from 'react';
import '../Css/AccountForm.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dob: '',
    gender: '',
    state: '',
    dlNumber: '',
    idProofType: '',
  });

  const [files, setFiles] = useState({
    dlPhoto: null,
    customerPhoto: null,
    idProofPhoto: null,
  });

  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [docConfirmed, setDocConfirmed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSendOtp = () => {
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpValue);
    setOtpSent(true);
    toast.info(`Your OTP is: ${otpValue}`, {
      position: 'top-right',
      autoClose: 6000,
    });
  };

  const handleVerifyOtp = () => {
    setVerifying(true);
    setTimeout(() => {
      if (otp === generatedOtp) {
        setIsVerified(true);
        setOtp('');
        setOtpSent(false);
        toast.success('OTP Verified Successfully!');
      } else {
        toast.error('Incorrect OTP. Please try again.');
      }
      setVerifying(false);
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!docConfirmed) {
      toast.warning('Please confirm document ownership before submitting.');
      return;
    }

    try {
      const sendData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        sendData.append(key, value);
      });
      sendData.append('dlPhoto', files.dlPhoto);
      sendData.append('customerPhoto', files.customerPhoto);
      sendData.append('idProofPhoto', files.idProofPhoto);

      const res = await axios.post('http://15.206.209.235:5000/api/account/add-account', sendData);

      if (res.data.success) {
        toast.success('Form submitted successfully!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error('Error submitting form.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error while submitting form');
    }
  };

  return (
    <>
      <ToastContainer />
      <motion.div
        className="form-container"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="form-heading">Register you as our partner</h2>

        <label>Your Name</label>
        <input type="text" name="fullName" className="form-input" placeholder="Full name" onChange={handleChange} />

        <label>Phone Number</label>
        <div className="phone-row">
          <input
            type="text"
            name="phone"
            className="form-input"
            placeholder="Enter 10-digit number"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, phone: value });
            }}
            maxLength={10}
            disabled={isVerified}
          />
          {isVerified && <span className="verified-tag">✔ Verified</span>}
        </div>

        {!isVerified && formData.phone.length === 10 && !otpSent && (
          <motion.button className="verify-btn" whileTap={{ scale: 0.95 }} onClick={handleSendOtp}>
            Send OTP
          </motion.button>
        )}

        {otpSent && !isVerified && (
          <>
            <label>Enter OTP</label>
            <input type="text" className="form-input" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <motion.button
              className="verify-btn"
              whileTap={{ scale: 0.95 }}
              onClick={handleVerifyOtp}
              disabled={verifying}
              style={{ marginTop: '10px' }}
            >
              {verifying ? <div className="spinner"></div> : 'Verify OTP'}
            </motion.button>
          </>
        )}

        <label>Date of Birth</label>
        <input type="date" name="dob" className="form-input" onChange={handleChange} />

        <label>Gender</label>
        <select name="gender" className="form-input" onChange={handleChange}>
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <label>State</label>
        <select name="state" className="form-input" onChange={handleChange}>
          <option value="">Select</option>
          <option>Uttar Pradesh</option>
          <option>Maharashtra</option>
          <option>Delhi</option>
          <option>Tamil Nadu</option>
          <option>Punjab</option>
        </select>

        <label>Driving License Number</label>
        <input type="text" name="dlNumber" className="form-input" placeholder="DL Number" onChange={handleChange} />

        <label>Upload Driving License Photo</label>
        <input type="file" name="dlPhoto" className="form-input" accept="image/*" onChange={handleFileChange} />

        <label>Upload Customer Photo</label>
        <input type="file" name="customerPhoto" className="form-input" accept="image/*" onChange={handleFileChange} />

        <label>ID Proof</label>
        <select name="idProofType" className="form-input" onChange={handleChange}>
          <option value="">Select ID</option>
          <option value="aadhar">Aadhar</option>
          <option value="voter">Voter ID</option>
          <option value="pan">PAN Card</option>
        </select>

        {formData.idProofType && (
          <>
            <label>Upload {formData.idProofType.toUpperCase()} Photo</label>
            <input type="file" name="idProofPhoto" className="form-input" accept="image/*" onChange={handleFileChange} />
          </>
        )}

        <div className="form-checkbox" style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
          <input
            type="checkbox"
            id="docConfirm"
            checked={docConfirmed}
            onChange={() => setDocConfirmed(!docConfirmed)}
            style={{ marginRight: '10px' }}
          />
          <p className="form-confirm" style={{ margin: 0 }}>
            I confirm that all documents provided are my own.
          </p>
        </div>

        <motion.button
          className="form-submit-btn"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleSubmit}
          disabled={!docConfirmed}
        >
          Submit
        </motion.button>
      </motion.div>
    </>
  );
};

export default AccountForm;
