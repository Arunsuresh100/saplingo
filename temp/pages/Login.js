import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    // --- State Management ---
    // State to hold the values of the form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State to manage the visibility of the password
    const [showPassword, setShowPassword] = useState(false);

    // --- Event Handlers ---
    const handleLogin = (event) => {
        event.preventDefault(); // Prevent the browser from reloading the page
        
        // ** BACKEND INTEGRATION LATER **
        // Here is where you will use Axios to send the login data to your backend.
        // For example:
        // try {
        //   const response = await axios.post('/api/users/login', { email, password });
        //   // Handle successful login (e.g., save token, redirect user)
        // } catch (error) {
        //   // Handle login error (e.g., show an error message)
        // }

        console.log('Login attempt with:', { email, password });
        alert('Login functionality is not yet connected to the backend.');
    };

    return (
        <div className="auth-page-wrapper-new">
            {/* Left Side: Artistic Panel */}
            <div className="auth-art-panel">
                <div className="auth-art-content">
                    <Link to="/" className="logo">Saplingo</Link>
                    <h2>Welcome Back to Your Green Oasis</h2>
                    <p>Sign in to continue your journey with us.</p>
                </div>
            </div>

            {/* Right Side: Form Panel */}
            <div className="auth-form-panel-new">
                <div className="auth-form-container">
                    <div className="auth-form-header">
                        <Link to="/" className="back-link">&larr; Back to Home</Link>
                        <h2>Member Login</h2>
                    </div>
                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="you@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    id="password" 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                    {/* Conditionally render the correct eye icon based on state */}
                                    {showPassword ? (
                                        <svg className="icon icon-eye-off" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    ) : (
                                        <svg className="icon icon-eye" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </span>
                            </div>
                        </div>
                        
                        <button type="submit" className="btn btn-primary btn-large">Login</button>
                    </form>
                    <div className="auth-switch-link">
                        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;