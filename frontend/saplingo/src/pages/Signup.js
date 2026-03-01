// src/pages/Signup.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    // --- State Management ---
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    
    // NEW: State to track which fields the user has interacted with
    const [touched, setTouched] = useState({
        fullName: false,
        email: false,
        mobile: false,
        password: false,
        confirmPassword: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiMessage, setApiMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // --- Real-time Validation Logic ---
    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'fullName':
                if (!value.trim()) error = "Full Name is required.";
                break;
            case 'email':
                if (!value) {
                    error = "Email is required.";
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = "Email is not valid.";
                }
                break;
            case 'mobile':
                if (!value) {
                    error = "Mobile number is required.";
                } else if (!/^\d{10}$/.test(value)) {
                    error = "Mobile number must be exactly 10 digits.";
                }
                break;
            case 'password':
                if (!value) {
                    error = "Password is required.";
                } else if (value.length < 8) {
                    error = "Password must be at least 8 characters long.";
                }
                break;
            case 'confirmPassword':
                if (!value) {
                    error = "Please confirm your password.";
                } else if (formData.password !== value) {
                    error = "Passwords do not match.";
                }
                break;
            default:
                break;
        }
        return error;
    };

    // --- Update useEffect to re-validate on change ---
    useEffect(() => {
        // This function re-runs validation on all touched fields whenever formData changes.
        const newErrors = {};
        Object.keys(touched).forEach(fieldName => {
            if (touched[fieldName]) {
                const error = validateField(fieldName, formData[fieldName]);
                if (error) {
                    newErrors[fieldName] = error;
                }
            }
        });
        setErrors(newErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, touched]); // Re-run whenever form data or touched state changes


    // --- UPDATED handleChange to include validation and touched state ---
    const handleChange = (e) => {
        const { id, value } = e.target;
        
        // Update form data state
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));

        // Mark the field as touched if it hasn't been already
        if (!touched[id]) {
            setTouched(prevTouched => ({
                ...prevTouched,
                [id]: true
            }));
        }
    };
    
    // --- UPDATED handleBlur to mark fields as touched ---
    // This handles the case where a user clicks into a field and then clicks out.
    const handleBlur = (e) => {
        const { id } = e.target;
        setTouched(prevTouched => ({
            ...prevTouched,
            [id]: true
        }));
    };


    // --- Form Submission Handler ---
    const handleSignup = async (event) => {
        event.preventDefault();
        setApiMessage(null);

        // Mark all fields as touched to show all errors on submit attempt
        setTouched({
            fullName: true,
            email: true,
            mobile: true,
            password: true,
            confirmPassword: true
        });

        // Perform a final validation check
        const newErrors = {};
        Object.keys(formData).forEach(fieldName => {
            const error = validateField(fieldName, formData[fieldName]);
            if (error) {
                newErrors[fieldName] = error;
            }
        });
        setErrors(newErrors);

        // If there are no errors, proceed with API call
        if (Object.keys(newErrors).length === 0) {
            setLoading(true);

            try {
                const userData = {
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password
                };
                const config = { headers: { 'Content-Type': 'application/json' } };
                
                await axios.post('http://localhost:5000/api/users/register', userData, config);

                setLoading(false);
                setApiMessage('Account created successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);

            } catch (error) {
                setLoading(false);
                setApiMessage(
                    error.response?.data?.message || 'An unexpected error occurred. Please try again.'
                );
            }
        } else {
            console.log('Form has validation errors.');
        }
    };

    return (
        <div className="auth-page-wrapper-new">
            <div className="auth-art-panel">
                <div className="auth-art-content">
                    <Link to="/" className="logo">Saplingo</Link>
                    <h2>Start Your Green Journey Today</h2>
                    <p>Create an account to save your favorites and check out faster.</p>
                </div>
            </div>
            <div className="auth-form-panel-new">
                <div className="auth-form-container">
                    <div className="auth-form-header">
                        <Link to="/" className="back-link">&larr; Back to Home</Link>
                        <h2>Create an Account</h2>
                    </div>
                    
                    {apiMessage && <p className={`api-message ${apiMessage.includes('successfully') ? 'success' : 'error'}`}>{apiMessage}</p>}

                    <form className="auth-form" onSubmit={handleSignup} noValidate>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} />
                            {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobile">Mobile number</label>
                            <input type="tel" id="mobile" placeholder="Enter your mobile number" value={formData.mobile} onChange={handleChange} onBlur={handleBlur} maxLength="10" />
                            {errors.mobile && <p className="error-text">{errors.mobile}</p>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input type={showPassword ? "text" : "password"} id="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} onBlur={handleBlur} />
                                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <svg className="icon icon-eye-off" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg className="icon icon-eye" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                                </span>
                            </div>
                            {errors.password && <p className="error-text">{errors.password}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-wrapper">
                                <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
                                <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <svg className="icon icon-eye-off" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg className="icon icon-eye" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                                </span>
                            </div>
                            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                        </div>

                        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                    <div className="auth-switch-link">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;