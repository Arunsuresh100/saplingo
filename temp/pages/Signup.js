import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
    // --- State Management ---
    // A single state object to hold all form data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });

    // State to hold validation errors
    const [errors, setErrors] = useState({});

    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // --- Helper Functions ---
    // A single handler to update the formData state for any input
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    // --- Validation Logic ---
    const validate = () => {
        let tempErrors = {};
        // Full Name validation
        if (!formData.fullName.trim()) tempErrors.fullName = "Full Name is required.";
        
        // Email validation
        if (!formData.email) {
            tempErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Email is not valid.";
        }

        // Mobile validation
        if (!formData.mobile) {
            tempErrors.mobile = "Mobile number is required.";
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            tempErrors.mobile = "Mobile number must be 10 digits.";
        }

        // Password validation
        if (!formData.password) {
            tempErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            tempErrors.password = "Password must be at least 8 characters long.";
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            tempErrors.confirmPassword = "Please confirm your password.";
        } else if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(tempErrors);
        // Returns true if there are no errors, false otherwise
        return Object.keys(tempErrors).length === 0;
    };


    // --- Form Submission Handler ---
    const handleSignup = (event) => {
        event.preventDefault();
        
        if (validate()) {
            // ** BACKEND INTEGRATION LATER **
            // If validation passes, you'll send the data to your backend.
            // const { fullName, email, mobile, password } = formData;
            // axios.post('/api/users/register', { fullName, email, mobile, password });
            
            console.log('Form is valid. Submitting data:', formData);
            alert('Account created successfully! (Placeholder - not connected to backend)');
            // Optionally reset form here
        } else {
            console.log('Form has errors.');
        }
    };

    return (
        <div className="auth-page-wrapper-new">
            {/* Left Side Panel */}
            <div className="auth-art-panel">
                <div className="auth-art-content">
                    <Link to="/" className="logo">Saplingo</Link>
                    <h2>Start Your Green Journey Today</h2>
                    <p>Create an account to save your favorites and check out faster.</p>
                </div>
            </div>

            {/* Right Side Form Panel */}
            <div className="auth-form-panel-new">
                <div className="auth-form-container">
                    <div className="auth-form-header">
                        <Link to="/" className="back-link">&larr; Back to Home</Link>
                        <h2>Create an Account</h2>
                    </div>
                    
                    <form className="auth-form" onSubmit={handleSignup} noValidate>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} />
                            {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobile">Mobile number</label>
                            <input type="tel" id="mobile" placeholder="Enter your mobile number" value={formData.mobile} onChange={handleChange} />
                            {errors.mobile && <p className="error-text">{errors.mobile}</p>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input type={showPassword ? "text" : "password"} id="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} />
                                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <svg className="icon icon-eye-off" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg className="icon icon-eye" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                                </span>
                            </div>
                            {errors.password && <p className="error-text">{errors.password}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-wrapper">
                                <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
                                <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <svg className="icon icon-eye-off" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg className="icon icon-eye" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                                </span>
                            </div>
                            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                        </div>

                        <button type="submit" className="btn btn-primary btn-large">Create Account</button>
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