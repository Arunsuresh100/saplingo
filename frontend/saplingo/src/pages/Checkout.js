import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Context & Component Imports ---
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import OrderSuccessPopup from '../components/OrderSuccessPopup';

const Checkout = () => {
    // --- State for Header & Dropdown ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // --- Hooks ---
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const { userInfo, logout } = useUser();
    
    // --- State for form data ---
    const [formData, setFormData] = useState({
        fullName: '', address: '', city: '', postalCode: '',
        cardNumber: '', expDate: '', cvc: ''
    });

    // --- State for real-time validation ---
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // --- State for API submission ---
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);

    // --- Effect to pre-fill user data ---
    useEffect(() => {
        if (userInfo) {
            const prefillData = { fullName: userInfo.name || '' };
            if (userInfo.shippingAddress) {
                prefillData.address = userInfo.shippingAddress.address || '';
                prefillData.city = userInfo.shippingAddress.city || '';
                prefillData.postalCode = userInfo.shippingAddress.postalCode || '';
            }
            setFormData(prevData => ({ ...prevData, ...prefillData }));
        }
    }, [userInfo]);
    
    // --- Event Handlers for Header ---
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };
    
    // --- Effects for Header ---
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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    // --- Validation logic ---
    const validateField = (name, value) => {
        let error = '';
        if (!value.trim()) return "This field is required.";

        switch (name) {
            case 'cardNumber':
                if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) error = "Card number must be 16 digits.";
                break;
            case 'expDate':
                if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(value)) error = "Use MM / YY format.";
                break;
            case 'cvc':
                if (!/^\d{3,4}$/.test(value)) error = "CVC must be 3 or 4 digits.";
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
        }
    };
    
    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (!touched[name]) {
            setTouched(prevTouched => ({ ...prevTouched, [name]: true }));
        }
        const error = validateField(name, value);
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    // --- Calculations ---
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 5.00;
    const total = subtotal + shipping;

    // --- Form Submission Handler ---
    const handlePlaceOrder = async (event) => {
        event.preventDefault();
        setApiError('');
        const finalErrors = {};
        let formIsValid = true;
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                finalErrors[key] = error;
                formIsValid = false;
            }
        });
        
        setErrors(finalErrors);
        setTouched({
            fullName: true, address: true, city: true, postalCode: true,
            cardNumber: true, expDate: true, cvc: true
        });

        if (!formIsValid) return;

        setLoading(true);

        try {
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
            };
           const orderData = {
    orderItems: cartItems.map(item => ({
        product: item._id, // <-- CRUCIAL: Send the product ID under the key "product"
        name: item.name,
        qty: item.quantity, // <-- CRUCIAL: Ensure quantity is sent as "qty"
        image: item.image,
        price: item.price    // <-- CRUCIAL: Ensure price is sent
    })),
    shippingAddress: { 
        address: formData.address, 
        city: formData.city, 
        postalCode: formData.postalCode 
    },
    shippingPrice: shipping,
    totalPrice: total,
};
            
            await axios.post('http://localhost:5000/api/orders', orderData, config);

            setLoading(false);
            clearCart();
            setOrderSuccess(true);

        } catch (err) {
            setLoading(false);
            setApiError(err.response?.data?.message || 'An error occurred while placing the order.');
        }
    };

    return (
        <>
            <OrderSuccessPopup isOpen={orderSuccess} />
            
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
                                            <Link to="/profile" state={{ view: 'orders' }} className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                                            <Link to="/cart" className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Cart</Link>
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
            
            <section className="checkout-page">
                <div className="container">
                    <div className="checkout-header">
                        <h1>Checkout</h1>
                        <Link to="/cart" className="back-to-cart-link">Back to Cart</Link>
                    </div>
                    <form className="checkout-layout" onSubmit={handlePlaceOrder} noValidate>
                        <div className="checkout-form">
                            {apiError && <p className="api-message error" style={{marginBottom: '1.5rem'}}>{apiError}</p>}
                            <div className="form-section">
                                <h2 className="form-section-title">Shipping Information</h2>
                                <div className="info-form">
                                    <div className="form-group">
                                        <label htmlFor="fullName">Full Name</label>
                                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onBlur={handleBlur} onChange={handleInputChange} required />
                                        {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="address">Address</label>
                                        <input type="text" id="address" name="address" placeholder="123 Plant Lane" value={formData.address} onBlur={handleBlur} onChange={handleInputChange} required />
                                        {errors.address && <p className="error-text">{errors.address}</p>}
                                    </div>
                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <input type="text" id="city" name="city" placeholder="Plant City" value={formData.city} onBlur={handleBlur} onChange={handleInputChange} required />
                                            {errors.city && <p className="error-text">{errors.city}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="postalCode">Postal Code</label>
                                            <input type="text" id="postalCode" name="postalCode" placeholder="12345" value={formData.postalCode} onBlur={handleBlur} onChange={handleInputChange} required />
                                            {errors.postalCode && <p className="error-text">{errors.postalCode}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-section">
                                <h2 className="form-section-title">Payment Details</h2>
                                <div className="info-form">
                                    <div className="form-group">
                                        <label htmlFor="cardNumber">Card Number</label>
                                        <input type="text" id="cardNumber" name="cardNumber" placeholder="XXXX XXXX XXXX XXXX" value={formData.cardNumber} onBlur={handleBlur} onChange={handleInputChange} required />
                                        {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}
                                    </div>
                                    <div className="form-grid-3">
                                        <div className="form-group">
                                            <label htmlFor="expDate">Expiry Date</label>
                                            <input type="text" id="expDate" name="expDate" placeholder="MM / YY" value={formData.expDate} onBlur={handleBlur} onChange={handleInputChange} required />
                                            {errors.expDate && <p className="error-text">{errors.expDate}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cvc">CVC</label>
                                            <input type="text" id="cvc" name="cvc" placeholder="123" value={formData.cvc} onBlur={handleBlur} onChange={handleInputChange} required />
                                            {errors.cvc && <p className="error-text">{errors.cvc}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-summary-checkout">
                            <h2 className="summary-title">Your Order</h2>
                            <div className="summary-items-list">
                                {cartItems.length > 0 ? (
                                    cartItems.map(item => (
                                        <div className="summary-item" key={item._id}> {/* Use _id for the key */}
                                            {/* --- THIS IS THE FIX --- */}
                                            <img src={`http://localhost:5000${item.image}`} alt={item.name} className="summary-item-image" />
                                            <div className="summary-item-details">
                                                <span className="item-name">{item.name} (x{item.quantity})</span>
                                                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : <p>Your cart is empty.</p>}
                            </div>
                           
                            {cartItems.length > 0 && (
                                <>
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
                                    <button type="submit" className="btn btn-primary btn-large btn-place-order" disabled={loading || cartItems.length === 0}>
                                        {loading ? 'Processing Payment...' : 'Place Order'}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </section>
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2024 Saplingo. All Rights Reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default Checkout;