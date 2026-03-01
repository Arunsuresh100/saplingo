import React, { useState, useEffect, useRef, useCallback } from 'react'; // 1. IMPORT useCallback
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { allProducts } from '../data/productData'; 
import bg1 from '../assets/img/bg-imgs/bg1.png';
import bg2 from '../assets/img/bg-imgs/bg2.png';
import bg3 from '../assets/img/bg-imgs/bg3.png';

const slidesData = [
    { bgImage: bg1, title: "From Our Greenhouse to Your Home", text: "Discover premium, organically nurtured saplings ready to bring life and beauty to your space.", buttonText: "Shop All Plants", link: "/shop" },
    { bgImage: bg2, title: "Taste the Freshness You've Grown", text: "Explore our vibrant collection of fruit tree saplings and start your home orchard today.", buttonText: "Explore Fruit Trees", link: "/shop" },
    { bgImage: bg3, title: "Elevate Your Interior with Greenery", text: "Find the perfect indoor plants to purify your air and create a calming, natural ambiance.", buttonText: "View Houseplants", link: "/shop" }
];

const featuredProductIds = ['mango-sapling', 'lemon-tree', 'rose-bush', 'snake-plant', 'fiddle-leaf-fig'];
const initialProducts = allProducts.filter(p => featuredProductIds.includes(p.id));

const Home = () => {
    // State Management
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(initialProducts);

    // Carousel State
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const autoPlayRef = useRef(null);
    const slidesWithClones = [slidesData[slidesData.length - 1], ...slidesData, slidesData[0]];

    const navigate = useNavigate();
    const { addToCart } = useCart();

    // 2. WRAP HANDLERS IN useCallback
    // This memoizes the functions so they don't get recreated on every render,
    // making them stable dependencies for our useEffect hook.
    const handleNext = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    }, [isTransitioning]);

    const handlePrev = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev - 1);
    }, [isTransitioning]);

    // 3. THE NEW, ROBUST AUTOPLAY useEffect
    useEffect(() => {
        // This function will now re-run whenever `handleNext` or `isTransitioning` changes.
        
        // If we are in the middle of a transition, we clear the interval and do nothing.
        // This PAUSES the autoplay.
        if (isTransitioning) {
            clearInterval(autoPlayRef.current);
            return;
        }

        // If we are NOT transitioning, we start a new interval.
        // This RESUMES the autoplay.
        autoPlayRef.current = setInterval(handleNext, 5000);

        // The cleanup function is crucial. It clears the interval when the component
        // unmounts or before the effect runs again.
        return () => clearInterval(autoPlayRef.current);

    }, [isTransitioning, handleNext]); // Dependencies ensure the effect has the latest state.


    // General Effects (No changes)
    useEffect(() => {
        document.body.classList.toggle('no-scroll', isMenuOpen);
    }, [isMenuOpen]);
    useEffect(() => {
        setFilteredProducts(
            initialProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // This handles the "infinite loop" jump. No changes needed here.
    const handleTransitionEnd = () => {
        if (currentIndex === 0) {
            setIsTransitioning(true); // Prevent animation for the jump
            setCurrentIndex(slidesData.length);
        } else if (currentIndex === slidesWithClones.length - 1) {
            setIsTransitioning(true); // Prevent animation for the jump
            setCurrentIndex(1);
        }
        // This timeout ensures that the state update from the jump is processed
        // before we allow new transitions.
        setTimeout(() => setIsTransitioning(false), 50);
    };

    // The style calculation now also depends on isTransitioning for the jump effect
    const sliderStyle = {
        transform: `translateX(-${currentIndex * 100}%)`,
        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
    };
    
    // The handleAddToCart function (No changes)
    const handleAddToCart = (product) => {
        addToCart(product, 1);
        navigate('/cart');
    };

    // JSX (No changes in the structure)
    return (
        <>
            {/* ... Your entire JSX from header to footer remains exactly the same ... */}
            {/* Navigation Bar */}
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
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                        </div>
                    </nav>
                    <button id="menu-toggle" className="mobile-menu-toggle" aria-label="Open navigation" aria-expanded={isMenuOpen} onClick={toggleMenu}>
                        <span className="hamburger"></span>
                    </button>
                </div>
            </header>

            {/* Hero Carousel */}
            <section className="hero-slider">
                <div 
                    className="slider-wrapper" 
                    style={sliderStyle}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {slidesWithClones.map((slide, index) => (
                        <div key={index} className="slide" style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), url(${slide.bgImage})` }}>
                            <div className="container">
                                <div className="hero-content">
                                    <h1>{slide.title}</h1>
                                    <p>{slide.text}</p>
                                    <Link to={slide.link} className="btn btn-primary hero_button">{slide.buttonText}</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="slider-nav prev" onClick={handlePrev}>&lt;</button>
                <button className="slider-nav next" onClick={handleNext}>&gt;</button>
                <div className="slider-dots">
                     {slidesData.map((_, index) => {
                        let activeDotIndex = currentIndex - 1;
                        if (currentIndex === 0) activeDotIndex = slidesData.length - 1;
                        if (currentIndex === slidesWithClones.length - 1) activeDotIndex = 0;
                        return (
                           <button 
                                key={index} 
                                className={index === activeDotIndex ? 'dot active' : 'dot'} 
                                onClick={() => setCurrentIndex(index + 1)}
                           />
                        );
                     })}
                </div>
            </section>
            
            {/* The rest of your JSX from "Why Choose Us" to the footer is unchanged */}
            {/* Why Choose Us Section */}
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
            {/* Product Section */}
            <section className="featured-products">
                <div className="container">
                    <div className="section-header">
                        <div className="section-title-group">
                            <h2 className="section-title">Explore Our Best-Sellers</h2>
                            <p className="section-subtitle">Hand-picked favorites that our community loves. Perfect for any home or garden.</p>
                        </div>
                        <div className="product-search">
                            <input 
                                type="text" 
                                placeholder="Search best-sellers..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button aria-label="Search"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>
                        </div>
                    </div>
                    <div className="product-carousel-wrapper">
                        <div className="product-grid">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="product-card" data-name={product.name}>
                                    <Link to={`/product/${product.id}`}>
                                        <div className="product-image-container">
                                            <img src={product.image} alt={product.name} />
                                        </div>
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
                    </div>
                    {filteredProducts.length === 0 && (
                        <div id="no-results-message">
                            <h3>No Saplings Found</h3>
                            <p>We couldn't find any best-sellers matching your search for "{searchTerm}".</p>
                        </div>
                    )}
                    <div className="section-footer">
                        <Link to="/shop" className="btn btn-primary">Show All Products</Link>
                    </div>
                </div>
            </section>
            {/* "HOW IT WORKS" SECTION */}
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
            {/* FOOTER */}
            <footer className="footer">
                <div className="container"><p>&copy; 2024 Saplingo. All Rights Reserved.</p></div>
            </footer>
        </>
    );
};

export default Home;