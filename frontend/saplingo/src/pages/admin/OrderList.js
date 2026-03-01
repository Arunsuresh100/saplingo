import React from 'react';

// This component now just receives props
const OrderList = ({ orders, onOpenModal }) => {
    return (
        <div className="admin-content-card">
            <h2 className="admin-content-title">Customer Orders</h2>
            <div className="table-responsive">
                <table className="admin-table professional-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id.toUpperCase().substring(order._id.length - 8)}</td>
                                <td>{order.user ? order.user.name : 'N/A'}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>
                                    <span className={`status-badge ${order.deliveryStatus.toLowerCase()}`}>
                                        {order.deliveryStatus}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn-admin-action edit"
                                        onClick={() => onOpenModal(order)}
                                        disabled={order.deliveryStatus === 'Delivered'}
                                    >
                                        Update Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;