import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- Context Imports ---
import { useUser } from '../context/UserContext';

const Contact = () => {
    // --- State for Header & Dropdown ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // --- Hooks ---
    const navigate = useNavigate();
    const { userInfo, logout } = useUser();

    // --- NEW: State for the Contact Form ---
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // --- NEW: useEffect to Auto-fill Form for Logged-in Users ---
    useEffect(() => {
        if (userInfo) {
            setFormData(prevData => ({
                ...prevData,
                name: userInfo.name,
                email: userInfo.email
            }));
        }
    }, [userInfo]); // This effect runs whenever the userInfo object changes.

    // --- Event Handlers ---
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };

    // NEW: Handler to update form state as user types
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);
    
    // Form Submission Handler
    const handleFormSubmit = (event) => {
        event.preventDefault();
        console.log("Form Data Submitted:", formData);
        alert("Thank you for your message! (This is a placeholder)");
        // If the user was logged out, clear the form after submission
        if (!userInfo) {
            setFormData({ name: '', email: '', message: '' });
        } else {
            // If logged in, only clear the message
            setFormData(prevData => ({ ...prevData, message: '' }));
        }
    };

    return (
        <>
            <header className={`site-header ${isMenuOpen ? 'menu-open' : ''}`}>
                <div className="container header-container">
                    <Link to="/" className="logo-link"><h1 className="logo">Saplingo</h1></Link>
                    <nav className="main-navigation" id="main-nav">
                        <ul className="nav-list">
                            <li><Link to="/" className="nav-link active">Home</Link></li>
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
                                            {/* --- UPDATED LINKS --- */}
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
                    <button id="menu-toggle" className="mobile-menu-toggle" aria-label="Open navigation" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className="hamburger"></span>
                    </button>
                </div>
            </header>

            <section className="contact-hero">
                <div className="container">
                    <h1>Get in Touch</h1>
                    <p>We're here to help with any questions you may have. We look forward to hearing from you!</p>
                </div>
            </section>

            <section className="contact-main">
                <div className="container contact-layout-grid">
                    <div className="contact-form-wrapper">
                        <h2>Send Us a Message</h2>
                        <form className="contact-form" onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                {/* The value and onChange props now connect the input to our state */}
                                <input type="text" id="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" rows="6" placeholder="How can we help you?" value={formData.message} onChange={handleChange} required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-large">Send Message</button>
                        </form>
                    </div>
                    {/* Right Side: Info */}
                    <div className="contact-info-block">
                        <h2>Contact Details</h2>
                        <ul className="contact-info-list">
                            <li>
                                <div className="contact-icon"><svg xmlns="http://www.w.3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
                                <span>support@saplingo.com</span>
                            </li>
                            <li>
                                <div className="contact-icon"><svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                                <span>+1 234 567 890</span>
                            </li>
                            <li>
                                <div className="contact-icon"><svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                                <span>123 Green St, Plant City, FL 12345</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="map-section">
                <div className="container">
                    <div className="map-container">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112435.538519047!2d-82.1983058866344!3d28.01633418108984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d8054e6d787a99%3A0x1b21955734743c34!2sPlant%20City%2C%20FL!5e0!3m2!1sen!2sus!4v1672520000000!5m2!1sen!2sus" 
                            width="100%" 
                            height="450" 
                            style={{ border:0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Saplingo Location Map"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <div className="section-title-centered">
                        <h2>Frequently Asked Questions</h2>
                        <p>Find quick answers to common questions below.</p>
                    </div>
                    <div className="faq-container">
                        <div className="faq-item">
                            <h3 className="faq-question">How long does shipping take?</h3>
                            <div className="faq-answer">
                                <p>Standard shipping typically takes 3-5 business days. We carefully pack every sapling to ensure it arrives healthy and ready to thrive at your home.</p>
                            </div>
                        </div>
                        <div className="faq-item">
                            <h3 className="faq-question">What is your return policy?</h3>
                            <div className="faq-answer">
                                <p>We offer a 30-day "Healthy Plant" guarantee. If your sapling arrives damaged or doesn't survive within the first 30 days, please contact us with a photo, and we will be happy to send you a replacement or issue a full refund.</p>
                            </div>
                        </div>
                        <div className="faq-item">
                            <h3 className="faq-question">Do you offer plant care support?</h3>
                            <div className="faq-answer">
                                <p>Absolutely! Our Lifetime Plant Support is a core part of the Saplingo promise. If you have any questions about potting, watering, or general care, please don't hesitate to reach out to our team of experts.</p>
                            </div>
                        </div>
                    </div>
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

export default Contact;