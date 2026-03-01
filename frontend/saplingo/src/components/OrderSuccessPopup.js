// src/components/OrderSuccessPopup.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPopup = ({ isOpen }) => {
    const navigate = useNavigate();

    if (!isOpen) {
        return null;
    }

    const handleViewOrders = () => {
        // Navigate to the profile page and pass a 'state' object
        // This will tell the profile page to open the 'orders' tab
        navigate('/profile', { state: { view: 'orders' } });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2c5e3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your purchase. You can view your order details in your account.</p>
                <button onClick={handleViewOrders} className="btn btn-primary btn-large">
                    View My Orders
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessPopup;