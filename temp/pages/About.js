import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- Import Images ---
// Make sure these paths are correct for your project structure
import aboutSubImg from '../assets/img/bg-imgs/about-sub.png';
import teamMember1 from '../assets/img/bg-imgs/team-member1.png';
import teamMember2 from '../assets/img/bg-imgs/team-member2.png';
import teamMember3 from '../assets/img/bg-imgs/team-member3.png';

const About = () => {
    // --- State and Logic for Mobile Menu (reusable) ---
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

    return (
        <>
            {/* Navigation Bar */}
            <header className={`site-header ${isMenuOpen ? 'menu-open' : ''}`}>
                <div className="container header-container">
                    <Link to="/" className="logo-link"><h1 className="logo">Saplingo</h1></Link>
                    <nav className="main-navigation" id="main-nav">
                        <ul className="nav-list">
                            <li><Link to="/" className="nav-link">Home</Link></li>
                            <li><Link to="/shop" className="nav-link">Shop</Link></li>
                            <li><Link to="/about" className="nav-link active">About Us</Link></li>
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

            {/* About Us Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <h1>Rooted in Passion, Grown with Purpose</h1>
                    <p>Connecting people with nature, one sapling at a time.</p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="our-story">
                <div className="container story-grid">
                    <div className="story-image">
                        <img src={aboutSubImg} alt="Lush green saplings in a nursery" />
                    </div>
                    <div className="story-content">
                        <h2 className="section-title">From a Small Garden to a Thriving Community</h2>
                        <p>Saplingo was born from a simple idea: that anyone can experience the joy of watching something grow. What started as a passion for organic farming in a small backyard has blossomed into a platform dedicated to sharing that passion with you.</p>
                        <p>We believe in sustainable practices, fair support for local farmers, and the simple happiness that a new plant can bring to a home. Our mission is to provide the highest quality, healthiest saplings and the knowledge you need to help them flourish.</p>
                    </div>
                </div>
            </section>

            {/* Our Core Values Section */}
            <section className="our-values">
                <div className="container">
                    <div className="section-title-centered">
                        <h2>The Saplingo Promise</h2>
                        <p>Our commitment to you and to our planet.</p>
                    </div>
                    <div className="values-grid">
                        <div className="value-item">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                            </div>
                            <h3>Quality & Health</h3>
                            <p>Every sapling is nurtured with care and inspected for health before it begins its journey to you.</p>
                        </div>
                        <div className="value-item">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"></path><path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10"></path></svg>
                            </div>
                            <h3>Sustainability First</h3>
                            <p>We use 100% organic growing methods and eco-friendly packaging to minimize our footprint.</p>
                        </div>
                        <div className="value-item">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </div>
                            <h3>Community Support</h3>
                            <p>We partner directly with local farmers, ensuring they receive fair prices for their incredible work.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet The Team Section */}
            <section className="meet-the-team">
                <div className="container">
                    <div className="section-title-centered">
                        <h2>Meet Our Green Thumbs</h2>
                        <p>The passionate team dedicated to your planting success.</p>
                    </div>
                    <div className="team-grid">
                        <div className="team-member">
                            <img src={teamMember1} alt="Photo of Jane Doe" />
                            <h3>Jane Doe</h3>
                            <p>Founder & Chief Botanist</p>
                        </div>
                        <div className="team-member">
                            <img src={teamMember2} alt="Photo of John Smith" />
                            <h3>John Smith</h3>
                            <p>Head of Nursery Operations</p>
                        </div>
                        <div className="team-member">
                            <img src={teamMember3} alt="Photo of Emily White" />
                            <h3>Emily White</h3>
                            <p>Customer Happiness Lead</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Start Your Green Journey?</h2>
                    <p>Explore our collection of healthy, happy saplings and find your new green friend today.</p>
                    <Link to="/shop" className="btn btn-primary btn-large">Shop All Plants</Link>
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

export default About;