// src/pages/ProductDetail.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const ProductDetail = () => {
    // --- Hooks and State from API-driven version ---
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { userInfo, logout } = useUser();

    // State for dynamic data
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- UI State from design-focused version ---
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // --- Data Fetching Effect (from API-driven version) ---
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
                setProduct(data);
                setMainImage(data.image); // Set initial main image
            } catch (err) {
                setError('Could not find the requested product. It may have been removed.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    // --- Event Handlers ---
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };
    
    const handleAddToCart = () => {
        if (product) {
            // Use database '_id' for cart compatibility
            addToCart({ ...product, id: product._id }, quantity);
            navigate('/cart');
        }
    };

    // --- Loading and Error State Rendering ---
    if (loading) {
        return <p style={{ textAlign: 'center', padding: '5rem 0', fontSize: '1.2rem' }}>Loading Product Details...</p>;
    }

    if (error) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <h1>Product Not Found</h1>
                <p>{error}</p>
                <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
            </div>
        );
    }
    
    return (
        <>
            {/* Header with Dynamic User Info */}
            <header className={`site-header ${isMenuOpen ? 'menu-open' : ''}`}>
                <div className="container header-container">
                    <Link to="/" className="logo-link"><h1 className="logo">Saplingo</h1></Link>
                    <nav className="main-navigation" id="main-nav">
                        <ul className="nav-list">
                            <li><Link to="/" className="nav-link">Home</Link></li>
                            <li><Link to="/shop" className="nav-link active">Shop</Link></li>
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
            
            {/* Main Product Section with Enhanced Design */}
            <section className="product-detail-section">
                <div className="container">
                    {product && (
                        <>
                            <p className="breadcrumb"><Link to="/shop">Shop</Link> / {product.name}</p>
                            <div className="product-layout">
                                <div className="product-images">
                                    <div className="main-image-container">
                                        <img src={`http://localhost:5000${mainImage}`} alt={product.name} />
                                    </div>
                                    {/* The thumbnail gallery is now active.
                                        NOTE: For this to work, your product data in MongoDB must have a 'thumbnails' array of image URLs.
                                    */}
                                    <div className="thumbnail-gallery">
                                        {product.thumbnails?.map((thumb, index) => (
                                            <div 
                                                key={index} 
                                                className={`thumbnail ${mainImage === thumb ? 'active' : ''}`} 
                                                onClick={() => setMainImage(thumb)}
                                            >
                                                <img src={`http://localhost:5000${thumb}`} alt={`${product.name} thumbnail ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="product-info-details">
                                    <div className="product-meta"><span className="category">Best Seller</span></div>
                                    <h1>{product.name}</h1>
                                    <p className="price">${product.price.toFixed(2)}</p>
                                    
                                    <h4 className="description-title">Description</h4>
                                    <p>{product.description}</p>
                                    
                                    <div className="product-actions">
                                        <div className="quantity-selector">
                                            <div className="quantity-input">
                                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                                <input type="number" id="quantity" value={quantity} readOnly />
                                                {/* Logic now respects countInStock from the database */}
                                                <button onClick={() => setQuantity(q => Math.min(product.countInStock || 10, q + 1))}>+</button>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn btn-primary btn-large add-to-cart-btn" 
                                            onClick={handleAddToCart} 
                                            disabled={product.countInStock === 0}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" 
             strokeWidth="2" 
             strokeLinecap="round" 
             strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                            <span>{product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
            
            <footer className="footer">
                <div className="container"><p>&copy; 2024 Saplingo. All Rights Reserved.</p></div>
            </footer>
        </>
    );
};

export default ProductDetail;