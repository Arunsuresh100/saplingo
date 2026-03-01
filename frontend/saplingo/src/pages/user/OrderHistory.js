// src/pages/user/OrderHistory.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

// --- Status Tracker Component (No changes needed here) ---
const StatusTracker = ({ status }) => {
    const statuses = ['Processing', 'Shipped', 'Delivered'];
    const currentStatusIndex = statuses.indexOf(status);
    const getIcon = (step) => {
        if (step === 'Processing') return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
        if (step === 'Shipped') return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
        if (step === 'Delivered') return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>;
        return null;
    };
    return (
        <div className="order-status-tracker">
            {statuses.map((step, index) => (
                <React.Fragment key={step}>
                    <div className={`status-step ${index <= currentStatusIndex ? 'completed' : ''}`}>
                        <div className="status-icon">{getIcon(step)}</div>
                        <div className="status-label">{step}</div>
                    </div>
                    {index < statuses.length - 1 && <div className={`status-line ${index < currentStatusIndex ? 'completed' : ''}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
};


const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useUser();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userInfo) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch orders.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userInfo]);

    return (
        <div className="profile-content-section">
            <h3 className="profile-content-title">My Order History</h3>
            
            {loading ? <p>Loading your orders...</p> : 
             error ? <p className="api-message error">{error}</p> : 
             orders.length === 0 ? (
                <>
                    <p>You have no past orders.</p>
                    <Link to="/shop" className="btn btn-primary" style={{marginTop: '1rem'}}>Start Shopping</Link>
                </>
            ) : (
                <div className="order-history-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card-redesigned">
                            <div className="order-card-header">
                                <div className="order-header-details">
                                    <span className="order-id">ORDER #{order._id.toUpperCase().substring(0, 12)}</span>
                                    <span className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="order-total">
                                    ${order.totalPrice.toFixed(2)}
                                </div>
                            </div>
                            <div className="order-card-body">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="order-item-detail">
                                        {/* --- FIX 1: Correct Image Path --- */}
                                        <img src={`http://localhost:5000${item.image}`} alt={item.name} />
                                        <div className="item-info">
                                            <span className="item-name">{item.name}</span>
                                            {/* --- FIX 2: Check if qty exists before showing it --- */}
                                            {item.qty && <span className="item-qty">Quantity: {item.qty}</span>}
                                        </div>
                                        {/* --- FIX 3: Check for valid numbers before calculating the price --- */}
                                        <span className="item-price-ind">
                                            { (item.price && item.qty) ? `$${(item.price * item.qty).toFixed(2)}` : '$--.--' }
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-card-footer">
                                <StatusTracker status={order.deliveryStatus || 'Processing'} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;