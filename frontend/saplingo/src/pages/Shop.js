import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- 1. IMPORT AXIOS
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext'; // <-- 2. IMPORT USER CONTEXT

const sortOptions = {
    'default': 'Sort by: Default',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low'
};

const Shop = () => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { userInfo, logout } = useUser(); // <-- 3. GET USER INFO

    // --- 4. NEW STATE FOR DYNAMIC DATA ---
    const [allDbProducts, setAllDbProducts] = useState([]); // Master list from DB
    const [displayedProducts, setDisplayedProducts] = useState([]); // Filtered/sorted list
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- State for UI and Header ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortValue, setSortValue] = useState('default');
    const [isSortDropdownOpen, setSortDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // --- 5. NEW EFFECT TO FETCH DATA ---
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setAllDbProducts(data);
            } catch (err) {
                setError('Could not load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // --- 6. UPDATED EFFECT FOR FILTERING ---
    // This now works on the state from the database, not the static file.
    useEffect(() => {
        let processedProducts = [...allDbProducts];
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
    }, [searchTerm, sortValue, allDbProducts]);
    
    // --- Event Handlers (mostly unchanged) ---
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleSortChange = (value) => {
        setSortValue(value);
        setSortDropdownOpen(false);
    };

    const handleAddToCart = (product) => {
        // Add database '_id' as 'id' for cart compatibility
        addToCart({ ...product, id: product._id }, 1);
        navigate('/cart');
    };

    const handleLogout = () => {
        logout();
        setUserDropdownOpen(false);
        navigate('/login');
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
                            {userInfo ? (
                                <div className="user-dropdown-menu" ref={dropdownRef}>
                                    <button className="avatar-button" onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}>
                                        <span className="avatar-initials">{userInfo.name.charAt(0)}</span>
                                    </button>
                                    {isUserDropdownOpen && (
                                         <div className="dropdown-content">
                                            <div className="dropdown-header">
                                                <span className="dropdown-user-name">Hello, {userInfo.name.split(' ')[0]}</span>
                                                <span className="dropdown-user-email">{userInfo.email}</span>
                                            </div>
                                            <Link to="/profile" state={{ view: 'details' }} className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>Profile Settings</Link>
                                            <Link to="/cart" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>My Cart</Link>
                                            <Link to="/profile" state={{ view: 'orders' }} className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>My Orders</Link>
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
            <section className="shop-page">
                <div className="container">
                    <div className="shop-header">
                        <h2>Explore Our Saplings</h2>
                        <div className="filters">
                            <div className="shop-search"><input type="text" placeholder="Search for plants..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /><button aria-label="Search"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" 
             strokeWidth="2" 
             strokeLinecap="round" 
             strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button></div>
                            <div className={`custom-select-wrapper ${isSortDropdownOpen ? 'open' : ''}`} onClick={() => setSortDropdownOpen(!isSortDropdownOpen)}>
                                <div className="custom-select"><span className="custom-select-trigger">{sortOptions[sortValue]}</span><div className="arrow"></div></div>
                                <div className="custom-options">
                                    {Object.entries(sortOptions).map(([value, label]) => (
                                        <span key={value} className={`custom-option ${sortValue === value ? 'selected' : ''}`} data-value={value} onClick={() => handleSortChange(value)}>{label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {loading ? <p style={{ textAlign: 'center', padding: '4rem 0' }}>Loading Products...</p> : 
                     error ? <p className="api-message error">{error}</p> :
                     (
                        <>
                            <div className="shop-grid">
                                {displayedProducts.map((product) => (
                                    <div key={product._id} className="product-card">
                                        <Link to={`/product/${product._id}`}>
                                            <div className="product-image-container"><img src={`http://localhost:5000${product.image}`} alt={product.name} /></div>
                                        </Link>
                                        <div className="product-info">
                                            <h3>{product.name}</h3>
                                            <p className="price">${product.price.toFixed(2)}</p>
                                            <div className="product-actions">
                                                <Link to={`/product/${product._id}`} className="btn btn-secondary">Quick View</Link>
                                                <button onClick={() => handleAddToCart(product)} className="btn btn-primary">Add to Cart</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {displayedProducts.length === 0 && !loading && (
                                <div id="no-results-message">
                                    <h3>No Saplings Found</h3>
                                    <p>We couldn't find any products matching your search or there are no products available.</p>
                                </div>
                            )}
                        </>
                     )}
                </div>
            </section>
            <footer className="footer"><div className="container"><p>&copy; 2024 Saplingo. All Rights Reserved.</p></div></footer>
        </>
    );
};

export default Shop;