// src/pages/Shop.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { allProducts } from '../data/productData';
import { useCart } from '../context/CartContext'; // Import useCart hook

const sortOptions = {
    'default': 'Sort by: Default',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low'
};

const Shop = () => {
    const { addToCart } = useCart(); // Get addToCart from context
    const navigate = useNavigate(); // Initialize navigate for redirection

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortValue, setSortValue] = useState('default');
    const [displayedProducts, setDisplayedProducts] = useState(allProducts);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('no-scroll', isMenuOpen);
        const handleEscape = (e) => e.key === 'Escape' && isMenuOpen && setIsMenuOpen(false);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.classList.remove('no-scroll');
        };
    }, [isMenuOpen]);

    useEffect(() => {
        let processedProducts = [...allProducts];
        if (searchTerm) {
            processedProducts = processedProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (sortValue === 'price-asc') {
            processedProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            processedProducts.sort((a, b) => b.price - a.price);
        }
        setDisplayedProducts(processedProducts);
    }, [searchTerm, sortValue]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleSortChange = (value) => {
        setSortValue(value);
        setIsDropdownOpen(false);
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1); // Add a single item
        navigate('/cart');     // Go to the cart page
    };

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
            <section className="shop-page">
                <div className="container">
                    <div className="shop-header">
                        <h2>Explore Our Saplings</h2>
                        <div className="filters">
                            <div className="shop-search">
                                <input type="text" placeholder="Search for plants..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                <button aria-label="Search">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </button>
                            </div>
                            <div className={`custom-select-wrapper ${isDropdownOpen ? 'open' : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <div className="custom-select">
                                    <span className="custom-select-trigger">{sortOptions[sortValue]}</span>
                                    <div className="arrow"></div>
                                </div>
                                <div className="custom-options">
                                    {Object.entries(sortOptions).map(([value, label]) => (
                                        <span key={value} className={`custom-option ${sortValue === value ? 'selected' : ''}`} data-value={value} onClick={() => handleSortChange(value)}>
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shop-grid">
                        {displayedProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <Link to={`/product/${product.id}`}>
                                    <div className="product-image-container"><img src={product.image} alt={product.name} /></div>
                                </Link>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="price">${product.price.toFixed(2)}</p>
                                    <div className="product-actions">
                                        <Link to={`/product/${product.id}`} className="btn btn-secondary">Quick View</Link>
                                        <button onClick={() => handleAddToCart(product)} className="btn btn-primary">Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {displayedProducts.length === 0 && (
                        <div id="no-results-message">
                            <h3>No Saplings Found</h3>
                            <p>We couldn't find any products matching your search. Try a different term!</p>
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

export default Shop;