// src/pages/ProductDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { allProducts } from '../data/productData';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { productId } = useParams();
    const product = allProducts.find(p => p.id === productId);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('no-scroll', isMenuOpen);
        const handleEscape = (e) => e.key === 'Escape' && isMenuOpen && setIsMenuOpen(false);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.classList.remove('no-scroll');
        };
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        if (product) {
            setMainImage(product.image);
        }
    }, [product]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    if (!product) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <h1>Product Not Found</h1>
                <p>We couldn't find the product you're looking for.</p>
                <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
            </div>
        );
    }

    return (
        <>
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
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                        </div>
                    </nav>
                    <button id="menu-toggle" className="mobile-menu-toggle" aria-label="Open navigation" aria-expanded={isMenuOpen} onClick={toggleMenu}>
                        <span className="hamburger"></span>
                    </button>
                </div>
            </header>
            
            <section className="product-detail-section">
                <div className="container">
                    <p className="breadcrumb">
                        <Link to="/shop">Shop</Link> / {product.name}
                    </p>
                    <div className="product-layout">
                        <div className="product-images">
                            <div className="main-image-container">
                                <img src={mainImage} alt={product.name} />
                            </div>
                            <div className="thumbnail-gallery">
                                {product.thumbnails?.map((thumb, index) => (
                                    <div 
                                        key={index} 
                                        className={`thumbnail ${mainImage === thumb ? 'active' : ''}`} 
                                        onClick={() => setMainImage(thumb)}
                                    >
                                        <img src={thumb} alt={`${product.name} thumbnail ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="product-info-details">
                            <div className="product-meta">
                                <span className="category">Best Seller</span>
                            </div>
                            <h1>{product.name}</h1>
                            <p className="price">${product.price.toFixed(2)}</p>
                            
                            <h4 className="description-title">Description</h4>
                            <p>{product.description}</p>
                            
                            <div className="product-actions">
                                <div className="quantity-selector">
                                    <div className="quantity-input">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                        <input type="number" id="quantity" value={quantity} readOnly />
                                        <button onClick={() => setQuantity(q => q + 1)}>+</button>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-large add-to-cart-btn" onClick={handleAddToCart}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
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

export default ProductDetail;