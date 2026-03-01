// src/pages/Checkout.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/CartContext';

const Checkout = () => {
    // State for the mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Get cart data and the clearCart function from our context
    const { cartItems, clearCart } = useCart(); 
    const navigate = useNavigate();

    // --- NEW: State to manage all form inputs ---
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        cardNumber: '',
        expDate: '',
        cvc: ''
    });

    // --- NEW: Function to update state as the user types ---
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // --- Calculations ---
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 5.00;
    const total = subtotal + shipping;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // --- Updated function to handle placing the order ---
    const handlePlaceOrder = (event) => {
        event.preventDefault(); // Prevent the form from reloading the page

        // --- NEW: Basic Form Validation ---
        if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode || !formData.cardNumber || !formData.expDate || !formData.cvc) {
            alert('Please fill out all required fields.');
            return; // Stop the function if the form is incomplete
        }
        
        // Create the order data object using the actual form data
        const orderData = {
            items: cartItems,
            shippingDetails: {
                fullName: formData.fullName,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
            },
            paymentDetails: "Processed (Simulated)",
            totals: {
                subtotal: subtotal.toFixed(2),
                shipping: shipping.toFixed(2),
                total: total.toFixed(2),
            },
            orderDate: new Date().toISOString()
        };

        // Simulate sending the data to a server
        console.log("--- SIMULATING ORDER PLACEMENT ---");
        console.log("Order Data Sent to Server:", orderData);

        // Show a success message
        alert(`Thank you for your order, ${formData.fullName}! A confirmation has been (not really) sent.`);

        // Clear the shopping cart
        clearCart(); 

        // Redirect to the home page
        navigate('/'); 
    };

    return (
        <>
            {/* Header */}
            <header className={`site-header ${isMenuOpen ? 'menu-open' : ''}`}>
                <div className="container header-container">
                    <Link to="/" className="logo-link"><h1 className="logo">Saplingo</h1></Link>
                    <nav className="main-navigation" id="main-nav">
                        <ul className="nav-list">
                            <li><Link to="/" className="nav-link">Home</Link></li>
                            <li><Link to="/shop" className="nav-link">Shop</Link></li>
                            <li><Link to="/about" className="nav-link">About Us</Link></li>
                            <li><Link to="/contact" className="nav-link">Contact</Link></li>
                        </ul>
                        <div className="nav-actions">
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                        </div>
                    </nav>
                    <button id="menu-toggle" className="mobile-menu-toggle" aria-label="Open navigation" aria-expanded={isMenuOpen} onClick={toggleMenu}>
                        <span className="hamburger"></span>
                    </button>
                </div>
            </header>
            
            <section className="checkout-page">
                <div className="container">
                    <div className="checkout-header">
                        <h1>Checkout</h1>
                        <Link to="/cart" className="back-to-cart-link">Back to Cart</Link>
                    </div>

                    {/* The form now wraps the entire layout and calls handlePlaceOrder */}
                    <form className="checkout-layout" onSubmit={handlePlaceOrder}>
                        <div className="checkout-form">
                            <div className="form-section">
                                <h2 className="form-section-title">Shipping Information</h2>
                                <div className="info-form">
                                    <div className="form-group">
                                        <label htmlFor="fullName">Full Name</label>
                                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="address">Address</label>
                                        <input type="text" id="address" name="address" placeholder="123 Plant Lane" value={formData.address} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="postalCode">Postal Code</label>
                                            <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-section">
                                <h2 className="form-section-title">Payment Details</h2>
                                <div className="info-form">
                                    <div className="form-group">
                                        <label htmlFor="cardNumber">Card Number</label>
                                        <input type="text" id="cardNumber" name="cardNumber" placeholder="XXXX XXXX XXXX XXXX" value={formData.cardNumber} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-grid-3">
                                        <div className="form-group">
                                            <label htmlFor="expDate">Expiry Date</label>
                                            <input type="text" id="expDate" name="expDate" placeholder="MM / YY" value={formData.expDate} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cvc">CVC</label>
                                            <input type="text" id="cvc" name="cvc" placeholder="123" value={formData.cvc} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-summary-checkout">
                            <h2 className="summary-title">Your Order</h2>
                            <div className="summary-items-list">
                                {cartItems.map(item => (
                                    <div className="summary-item" key={item.id}>
                                        <img src={item.image} alt={item.name} className="summary-item-image" />
                                        <div className="summary-item-details">
                                            <span className="item-name">{item.name} (x{item.quantity})</span>
                                            <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-calculation">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-large btn-place-order">
                                Place Order
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2024 Saplingo. All Rights Reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default Checkout;