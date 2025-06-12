import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AccountDetailes = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(
          'http://localhost:4000/api/account/getAccountDetails',
          {token:token},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          console.log('Account data:', res.data.data);
          setAccount(res.data.data); // ✅ Set the fetched data
        } else {
          console.log('No account found');
        }
      } catch (error) {
        console.error('Error fetching account:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  if (loading) return <div>Loading account details...</div>;
  if (!account) return <div>No account details found.</div>;

  return (
    <div className="account-details-container">
      <h2>📋 Account Details</h2>

      <div className="info-group">
        <p><strong>Full Name:</strong> {account.fullName}</p>
        <p><strong>Phone:</strong> {account.phone}</p>
        <p><strong>Date of Birth:</strong> {account.dob}</p>
        <p><strong>Gender:</strong> {account.gender}</p>
        <p><strong>State:</strong> {account.state}</p>
        <p><strong>DL Number:</strong> {account.dlNumber}</p>
        <p><strong>ID Proof Type:</strong> {account.idProofType}</p>
        <p><strong>Status:</strong> {account.status}</p>
      </div>

      <div className="image-section">
        <div>
          <p><strong>DL Photo:</strong></p>
          <img src={account.dlPhotoUrl} alt="DL" style={{ width: '200px', height: 'auto', border: '1px solid #ccc' }} />
        </div>
        <div>
          <p><strong>Customer Photo:</strong></p>
          <img src={account.customerPhotoUrl} alt="Customer" />
        </div>
        <div>
          <p><strong>ID Proof Photo:</strong></p>
          <img src={account.idProofPhotoUrl} alt="ID Proof" />
        </div>
      </div>
    </div>
  );
};

export default AccountDetailes;
