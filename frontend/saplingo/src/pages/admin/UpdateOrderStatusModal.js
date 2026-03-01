import React, { useState, useEffect } from 'react';

const UpdateOrderStatusModal = ({ order, onClose, onSave }) => {
    // --- THIS IS THE FIX (Part 1) ---
    // Hooks are ALWAYS called at the top level, unconditionally.
    // We provide a default value ('Processing') for the initial render when 'order' might be null.
    const [status, setStatus] = useState('Processing');
    const [isSaving, setIsSaving] = useState(false);

    // This effect will run WHENEVER the 'order' prop changes.
    // If a new order is selected, it updates the internal 'status' state to match it.
    useEffect(() => {
        if (order) {
            setStatus(order.deliveryStatus);
        }
    }, [order]); // The dependency array makes this effect run when 'order' changes.

    const handleSave = async () => {
        setIsSaving(true);
        // We know 'order' exists if the modal is open, so this is safe.
        await onSave(order._id, status);
        setIsSaving(false);
        onClose();
    };

    // --- THIS IS THE FIX (Part 2) ---
    // The conditional check now happens right before the JSX return.
    // This is the correct place to "early exit" from a component.
    if (!order) {
        return null;
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content admin-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Update Order Status</h3>
                <p><strong>Order ID:</strong> {order._id.toUpperCase().substring(order._id.length - 8)}</p>
                <p><strong>Customer:</strong> {order.user ? order.user.name : 'N/A'}</p>
                
                <div className="form-group">
                    <label htmlFor="status">Delivery Status</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
                
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose} disabled={isSaving}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Status'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateOrderStatusModal;