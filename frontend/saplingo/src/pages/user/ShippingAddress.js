// src/pages/user/ShippingAddress.js

import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

const ShippingAddress = () => {
    const { userInfo, setAuth } = useUser();
    
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userInfo?.shippingAddress) {
            setAddress(userInfo.shippingAddress.address || '');
            setCity(userInfo.shippingAddress.city || '');
            setPostalCode(userInfo.shippingAddress.postalCode || '');
        }
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!address || !city || !postalCode) {
            setError('All address fields are required.');
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const shippingData = { address, city, postalCode };

            // --- THIS IS THE FIX ---
            // Use the full URL to connect to your backend API
            const { data } = await axios.put(
                'http://localhost:5000/api/users/profile', 
                { 
                    name: userInfo.name,
                    email: userInfo.email,
                    shippingAddress: shippingData 
                }, 
                config
            );

            setAuth(data);
            setLoading(false);
            setMessage('Address saved successfully!');
            setTimeout(() => setMessage(''), 3000);

        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className="profile-content-section">
            <h3 className="profile-content-title">Shipping Address</h3>
            <p className="profile-content-subtitle">This address will be used by default during checkout.</p>
            {message && <p className="api-message success">{message}</p>}
            {error && <p className="api-message error">{error}</p>}
            
            <form onSubmit={submitHandler} className="info-form professional-form">
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" placeholder="123 Plant Lane" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" placeholder="Plant City" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="postalCode">Postal Code</label>
                        <input type="text" id="postalCode" placeholder="12345" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-profile-save" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Address'}
                </button>
            </form>
        </div>
    );
};

export default ShippingAddress;