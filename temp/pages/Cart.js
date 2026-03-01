// src/pages/Cart.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // IMPORTANT: This calculation remains correct for the Order Summary
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 5.00;
    const total = subtotal + shipping;

    useEffect(() => {
        document.body.classList.toggle('no-scroll', isMenuOpen);
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <header className={`site-header ${isMenuOpen ? 'menu-open' : ''}`}>
                <div className="container header-container">
                    <Link to="/" className="logo-link"><h1 className="logo">Saplingo</h1></Link>
                    <nav className="main-navigation">
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
                    <button className="mobile-menu-toggle" aria-expanded={isMenuOpen} onClick={toggleMenu}>
                        <span className="hamburger"></span>
                    </button>
                </div>
            </header>
            <section className="cart-page-section">
                <div className="container">
                    <h1>Your Cart</h1>
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-message">
                           <h3>Your cart is currently empty.</h3>
                           <p>Looks like you haven't added any saplings yet. Let's fix that!</p>
                           <Link to="/shop" className="btn btn-primary btn-large">Continue Shopping</Link>
                        </div>
                    ) : (
                        <div className="cart-layout">
                            <div className="cart-main-content"> {/* New wrapper div */}
                                <div className="cart-items-list">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="cart-item">
                                            <div className="cart-item-image">
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                            <div className="cart-item-details">
                                                <h3>{item.name}</h3>
                                                <p className="price">${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="quantity-selector">
                                                <div className="quantity-input">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                    <input type="number" value={item.quantity} readOnly />
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                </div>
                                            </div>

                                            {/* CHANGE 1: This now shows the price per item, not the total */}
                                            <div className="cart-item-total">${item.price.toFixed(2)}</div>
                                            
                                            <div className="cart-item-remove">
                                                <button onClick={() => removeFromCart(item.id)} title="Remove item" className="btn-remove-icon-elevated">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* CHANGE 2: Added the "Continue Shopping" link as you suggested */}
                                <div className="continue-shopping-link">
                                    <Link to="/shop">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                            <div className="order-summary">
                                <h2>Order Summary</h2>
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
                                <Link to="/checkout" className="btn btn-primary btn-large proceed-to" style={{width: '100%', textAlign: 'center', marginTop: '1rem'}}>
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <footer className="footer">
                <div className="container"><p>&copy; 2024 Saplingo. All Rights Reserved.</p></div>
            </footer>
        </>
    );
};

export default Cart;