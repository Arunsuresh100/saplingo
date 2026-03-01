import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// --- Context and Component Imports ---
import { useUser } from '../../context/UserContext';
import ProfileDetails from './ProfileDetails';
import ShippingAddress from './ShippingAddress';
import OrderHistory from './OrderHistory';
import ReturnsRefunds from './ReturnsRefunds'; // This import is correct!

const Profile = () => {
    // --- State for Header & Dropdown ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // --- Hooks ---
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo, logout } = useUser();
    
    const [activeView, setActiveView] = useState(location.state?.view || 'details');

    useEffect(() => {
        if (location.state?.view) {
            setActiveView(location.state.view);
        }
    }, [location.state]);

    // --- Event Handlers ---
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
                                            <Link to="/profile" state={{ view: 'details' }} className="dropdown-item" onClick={() => { setDropdownOpen(false); setActiveView('details'); }}>Profile Settings</Link>
                                            <Link to="/profile" state={{ view: 'orders' }} className="dropdown-item" onClick={() => { setDropdownOpen(false); setActiveView('orders'); }}>My Orders</Link>
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

            <section className="profile-page">
                <div className="container">
                    <div className="profile-header"><h1>My Account</h1></div>
                    <div className="profile-layout">
                        <div className="profile-nav">
                            <button className={`profile-nav-item ${activeView === 'details' ? 'active' : ''}`} onClick={() => setActiveView('details')}>Profile Details</button>
                            <button className={`profile-nav-item ${activeView === 'address' ? 'active' : ''}`} onClick={() => setActiveView('address')}>Shipping Address</button>
                            <button className={`profile-nav-item ${activeView === 'orders' ? 'active' : ''}`} onClick={() => setActiveView('orders')}>Order History</button>
                            {/* --- THIS IS THE FIX (Part 1) --- */}
                            <button className={`profile-nav-item ${activeView === 'returns' ? 'active' : ''}`} onClick={() => setActiveView('returns')}>Returns & Refunds</button>
                        </div>
                        <div className="profile-content">
                            {activeView === 'details' && <ProfileDetails />}
                            {activeView === 'address' && <ShippingAddress />}
                            {activeView === 'orders' && <OrderHistory />}
                            {/* --- THIS IS THE FIX (Part 2) --- */}
                            {activeView === 'returns' && <ReturnsRefunds />}
                        </div>
                    </div>
                </div>
            </section>
            
            <footer className="footer">
                <div className="container"><p>&copy; 2024 Saplingo. All Rights Reserved.</p></div>
            </footer>
        </>
    );
};

export default Profile;