import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- IMPORT AXIOS

// --- Context and Asset Imports ---
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import bg1 from '../assets/img/bg-imgs/bg1.png';
import bg2 from '../assets/img/bg-imgs/bg2.png';
import bg3 from '../assets/img/bg-imgs/bg3.png';

// --- Static Data for Slider ---
const slidesData = [
    { bgImage: bg1, title: "From Our Greenhouse to Your Home", text: "Discover premium, organically nurtured saplings ready to bring life and beauty to your space.", buttonText: "Shop All Plants", link: "/shop" },
    { bgImage: bg2, title: "Taste the Freshness You've Grown", text: "Explore our vibrant collection of fruit tree saplings and start your home orchard today.", buttonText: "Explore Fruit Trees", link: "/shop" },
    { bgImage: bg3, title: "Elevate Your Interior with Greenery", text: "Find the perfect indoor plants to purify your air and create a calming, natural ambiance.", buttonText: "View Houseplants", link: "/shop" }
];

const Home = () => {
    // --- Hooks ---
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { userInfo, logout, loading: userContextLoading } = useUser();
    
    // --- State for Product Data (Now from API) ---
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState('');

    // --- State for UI components ---
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const autoPlayRef = useRef(null);
    const slidesWithClones = [slidesData[slidesData.length - 1], ...slidesData, slidesData[0]];
    
    // --- EFFECT TO FETCH PRODUCTS FROM API ---
    useEffect(() => {
        const fetchAndSetFeaturedProducts = async () => {
            setLoadingProducts(true);
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                const featuredNames = ['Mango Sapling', 'Lemon Tree', 'Rose Bush', 'Snake Plant', 'Fiddle Leaf Fig'];
                const filtered = data.filter(p => featuredNames.includes(p.name));
                setFeaturedProducts(filtered);
            } catch (err) {
                setError('Could not load best-sellers. Please try again later.');
                console.error(err);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchAndSetFeaturedProducts();
    }, []);

    // --- Effect for Admin Redirection ---
    useEffect(() => {
        if (!userContextLoading && userInfo && userInfo.isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [userInfo, userContextLoading, navigate]);

    // --- Effect for Live Search on Featured Products ---
    useEffect(() => {
        setFilteredProducts(
            featuredProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, featuredProducts]);

    // --- Event Handlers & Other Effects ---
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };
    const handleAddToCart = (product) => {
        addToCart({ ...product, id: product._id }, 1); // Ensure we use _id
        navigate('/cart');
    };
    
    // Slider and dropdown effects...
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const handleNext = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    }, [isTransitioning]);

    // --- THIS IS THE FIX ---
    const handlePrev = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev - 1);
    }, [isTransitioning]);
    // --- END OF FIX ---

    useEffect(() => {
        if (isTransitioning) { clearInterval(autoPlayRef.current); return; }
        autoPlayRef.current = setInterval(handleNext, 5000);
        return () => clearInterval(autoPlayRef.current);
    }, [isTransitioning, handleNext]);

    const handleTransitionEnd = () => {
        if (currentIndex === 0) {
            setCurrentIndex(slidesData.length);
        } else if (currentIndex === slidesWithClones.length - 1) {
            setCurrentIndex(1);
        }
        setIsTransitioning(false);
    };
    const sliderStyle = {
        transform: `translateX(-${currentIndex * 100}%)`,
        transition: !isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
    };
    
    if (userContextLoading || (userInfo && userInfo.isAdmin)) {
        return null;
    }

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

            {/* Hero Slider Section */}
            <section className="hero-slider">
                <div className="slider-wrapper" style={sliderStyle} onTransitionEnd={handleTransitionEnd}>
                     {slidesWithClones.map((slide, index) => (
                        <div key={index} className="slide" style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), url(${slide.bgImage})` }}>
                            <div className="container"><div className="hero-content"><h1>{slide.title}</h1><p>{slide.text}</p><Link to={slide.link} className="btn btn-primary hero_button">{slide.buttonText}</Link></div></div>
                        </div>
                    ))}
                </div>
                {/* This onClick will now work correctly */}
                <button className="slider-nav prev" onClick={handlePrev}>&lt;</button>
                <button className="slider-nav next" onClick={handleNext}>&gt;</button>
            </section>
            
            <section className="why-choose-us">
                 <div className="container">
                    <div className="section-title-centered">
                        <h2>Why Choose Saplingo?</h2>
                        <p>Your green journey, simplified and supported.</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22l1.1-1.1a2 2 0 0 1 3.4-2.4L8 20l.9-1.3a2 2 0 0 1 2.5-2.2l2.3.9a2 2 0 0 1 1.6 2.5l-1 4A2 2 0 0 1 12.3 22H2z"></path><path d="M11 2c.5 1.5.5 3.3.1 5.2-1 4.6-3 8.3-5 11"></path><path d="m10 10 3-3.5a2 2 0 0 1 3.5 2.5L12 13.5"></path></svg></div>
                            <h3>Sustainably Grown</h3>
                            <p>Every sapling is raised using organic, eco-friendly methods for a healthier start.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><path d="M2 11h20"></path></svg></div>
                            <h3>Protective Packaging</h3>
                            <p>Our custom, secure packaging ensures your new plants arrive at your door safe and ready to thrive.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg></div>
                            <h3>Lifetime Plant Support</h3>
                            <p>From potting to pruning, our team of green thumbs is here to help you succeed on your planting journey.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="featured-products">
                <div className="container">
                    <div className="section-header">
                        <div className="section-title-group">
                            <h2 className="section-title">Explore Our Best-Sellers</h2>
                            <p className="section-subtitle">Hand-picked favorites that our community loves. Perfect for any home or garden.</p>
                        </div>
                        <div className="product-search">
                            <input type="text" placeholder="Search best-sellers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <button aria-label="Search"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
             fill="none" 
             stroke="currentColor" 
             strokeWidth="2" 
             strokeLinecap="round" 
             strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg></button>
                        </div>
                    </div>
                    {loadingProducts ? <p style={{ textAlign: 'center', padding: '3rem 0'}}>Loading Best-Sellers...</p> :
                     error ? <p className="api-message error">{error}</p> :
                     (
                        <>
                            <div className="product-carousel-wrapper">
                                <div className="product-grid">
                                    {filteredProducts.map((product) => (
                                        <div key={product._id} className="product-card" data-name={product.name}>
                                            <Link to={`/product/${product._id}`}>
                                                <div className="product-image-container">
                                                    <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                                                </div>
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
                            </div>
                            {filteredProducts.length === 0 && (
                                <div id="no-results-message" style={{padding: '2rem 0', textAlign: 'center'}}>
                                    <h3>No Saplings Found</h3>
                                    <p>We couldn't find any best-sellers matching your search for "{searchTerm}".</p>
                                </div>
                            )}
                        </>
                    )}
                    <div className="section-footer">
                        <Link to="/shop" className="btn btn-primary">Show All Products</Link>
                    </div>
                </div>
            </section>
            
            <section className="how-it-works">
                <div className="container">
                    <div className="section-title-centered">
                        <h2>Your Green Delivery in 3 Easy Steps</h2>
                        <p>From our nursery to your doorstep, the process is simple and transparent.</p>
                    </div>
                    <div className="steps-grid">
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg></div>
                            <h3>Choose Your Plant</h3>
                            <p>Browse our curated collection and find the perfect green companion for your space.</p>
                        </div>
                        <div className="step-item">
                            <div className="step-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                            <div className="step-number">2</div>
                            <h3>We Pack With Care</h3>
                            <p>Our experts use breathable, secure packaging to ensure your plant is safe on its journey.</p>
                        </div>
                        <div className="step-item">
                            <div className="step-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>
                            <div className="step-number">3</div>
                            <h3>Arrives At Your Door</h3>
                            <p>Your new plant arrives healthy, happy, and ready to brighten up your home.</p>
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

export default Home;