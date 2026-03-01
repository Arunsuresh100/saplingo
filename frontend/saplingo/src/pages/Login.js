import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [apiMessage, setApiMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setAuth, userInfo, loading: userContextLoading } = useUser();

    // Effect to handle redirection after login state is confirmed.
    // The AuthRedirect component now handles most of this, but this is a good safeguard.
    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            navigate('/admin/dashboard');
        } else if (userInfo) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setApiMessage(null);
        setLoading(true);

        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password }, config);
            
            // This is the only action on success. The useEffect will handle the redirect.
            setAuth(data);

        } catch (error) {
            setLoading(false);
            setApiMessage(error.response?.data?.message || 'An unexpected error occurred.');
        }
    };
    
    // Prevent rendering if the context is still checking auth status
    if (userContextLoading) {
        return null;
    }

    return (
        <div className="auth-page-wrapper-new">
            <div className="auth-art-panel">
                <div className="auth-art-content">
                    <Link to="/" className="logo">Saplingo</Link>
                    <h2>Welcome Back to Your Green Oasis</h2>
                    <p>Sign in to continue your journey with us.</p>
                </div>
            </div>
            <div className="auth-form-panel-new">
                <div className="auth-form-container">
                    <div className="auth-form-header">
                        <Link to="/" className="back-link">&larr; Back to Home</Link>
                        <h2>Member Login</h2>
                    </div>

                    {apiMessage && <p className="api-message error">{apiMessage}</p>}

                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input type={showPassword ? "text" : "password"} id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <svg className="icon icon-eye-off" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    ) : (
                                        <svg className="icon icon-eye" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </span>
                            </div>
                        </div>
                        
                        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                            {loading ? 'Logging In...' : 'Login'}
                        </button>
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