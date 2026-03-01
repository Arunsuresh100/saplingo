import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- Context Imports ---
import { useCart } from '../context/CartContext'; 
import { useUser } from '../context/UserContext';

const Cart = () => {
    // --- State for Header & Dropdown ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // --- Hooks ---
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const { userInfo, logout } = useUser();

    // --- Calculations ---
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 5.00; // This can be made dynamic later
    const total = subtotal + shipping;

    // --- Event Handlers ---
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };

    // --- Effects ---
    useEffect(() => {
        document.body.classList.toggle('no-scroll', isMenuOpen);
    }, [isMenuOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <>
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
                            {userInfo ? (
                                <div className="user-dropdown-menu" ref={dropdownRef}>
                                    <button className="avatar-button" onClick={() => setDropdownOpen(!isDropdownOpen)}>
                                        <span className="avatar-initials">{userInfo.name.charAt(0)}</span>
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="dropdown-content">
                                            <div className="dropdown-header">
                                                <span className="dropdown-user-name">Hello, {userInfo.name.split(' ')[0]}</span>
                                                <span className="dropdown-user-email">{userInfo.email}</span>
                                            </div>
                                            <Link to="/profile" state={{ view: 'details' }} className="dropdown-item" onClick={() => setDropdownOpen(false)}>Profile Settings</Link>
                                            <Link to="/cart" className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Cart</Link>
                                            <Link to="/profile" state={{ view: 'orders' }} className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                                            <button onClick={handleLogout} className="dropdown-item logout">Logout</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <><Link to="/login" className="btn btn-secondary">Login</Link><Link to="/signup" className="btn btn-primary">Sign Up</Link></>
                            )}
                        </div>
                    </nav>
                    <button id="menu-toggle" className="mobile-menu-toggle" aria-label="Open navigation" aria-expanded={isMenuOpen} onClick={toggleMenu}>
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
                            <div className="cart-main-content">
                                <div className="cart-items-list">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="cart-item">
                                            <div className="cart-item-image">
                                                {/* --- THIS IS THE FIX --- */}
                                                <img src={`http://localhost:5000${item.image}`} alt={item.name} />
                                            </div>
                                            <div className="cart-item-details">
                                                <h3>{item.name}</h3>
                                                <p className="price">${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="quantity-selector">
                                                <div className="quantity-input">
                                                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                                                    <input type="number" value={item.quantity} readOnly />
                                                    <button onClick={() => updateQuantity(item.id, Math.min(item.countInStock, item.quantity + 1))}>+</button>
                                                </div>
                                            </div>
                                            {/* Note: This total should probably be quantity * price */}
                                            <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>
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
                                <Link to="/checkout" className="btn btn-primary btn-large" style={{width: '100%', textAlign: 'center', marginTop: '1rem', display: 'block'}}>
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