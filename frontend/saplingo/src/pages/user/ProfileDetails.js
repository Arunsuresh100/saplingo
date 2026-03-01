// src/pages/user/ProfileDetails.js

import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

const ProfileDetails = () => {
    const { userInfo, setAuth } = useUser();
    
    // --- State for form data ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // --- State for password visibility ---
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // --- State for API messages ---
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // --- NEW: State for real-time validation ---
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({
        password: false,
        confirmPassword: false
    });

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo]);

    // --- NEW: Validation logic ---
    const validateField = (fieldName, value) => {
        let error = '';
        switch (fieldName) {
            case 'password':
                // This validation only runs if the user has started typing in the password field.
                // An empty password is still valid for submission (meaning "don't change").
                if (value && value.length < 8) {
                    error = "Password must be at least 8 characters long.";
                }
                break;
            case 'confirmPassword':
                if (password && value !== password) {
                    error = "Passwords do not match.";
                }
                break;
            default:
                break;
        }
        return error;
    };

    // --- NEW: useEffect to run validation on change ---
    useEffect(() => {
        const newErrors = {};
        // Only validate fields that the user has interacted with
        if (touched.password) {
            const passwordError = validateField('password', password);
            if (passwordError) newErrors.password = passwordError;
        }
        if (touched.confirmPassword) {
            const confirmPasswordError = validateField('confirmPassword', confirmPassword);
            if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
        }
        // Also, re-validate confirmPassword whenever the original password changes
        if (touched.confirmPassword) {
             const confirmPasswordError = validateField('confirmPassword', confirmPassword);
             if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
             else delete errors.confirmPassword; // Clear error if it's now valid
        }

        setErrors(newErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password, confirmPassword, touched]);


    // --- NEW: Generic handlers for password fields ---
    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'password') {
            setPassword(value);
        } else if (id === 'confirmPassword') {
            setConfirmPassword(value);
        }
        // Mark the field as touched when the user starts typing
        if (!touched[id]) {
            setTouched(prev => ({ ...prev, [id]: true }));
        }
    };

    const handleBlur = (e) => {
        const { id } = e.target;
        setTouched(prev => ({ ...prev, [id]: true }));
    };

    // --- Main submit handler ---
    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrors({});

        // Perform final validation check
        if (password && password !== confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' });
            return;
        }
        if (password && password.length < 8) {
            setErrors({ password: 'Password must be at least 8 characters long.' });
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
            };

            const updateData = { name, email };
            // Only include the password if the user actually entered one
            if (password) {
                updateData.password = password;
            }

            const { data } = await axios.put('http://localhost:5000/api/users/profile', updateData, config);
            
            setAuth(data);
            setLoading(false);
            setMessage('Profile updated successfully!');
            setPassword('');
            setConfirmPassword('');
            setTouched({ password: false, confirmPassword: false }); // Reset touched state
            setTimeout(() => setMessage(''), 3000);

        } catch (err) {
            setLoading(false);
            const specificError = err.response?.data?.message || 'An error occurred. Please check your details.';
            // Set error in the main API message area
            setMessage(''); // Clear any success message
            setErrors({ api: specificError }); // Use the errors state for a more consistent look
        }
    };

    return (
        <div className="profile-content-section">
            <h3 className="profile-content-title">Profile Details</h3>
            
            {message && <p className="api-message success">{message}</p>}
            {errors.api && <p className="api-message error">{errors.api}</p>}
            
            <form onSubmit={submitHandler} className="info-form professional-form" noValidate>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <div className="password-wrapper">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            placeholder="Leave blank to keep the same" 
                            value={password} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                           {showPassword ? <svg className="icon icon-eye-off" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg className="icon icon-eye" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                        </span>
                    </div>
                    {/* --- NEW: Real-time error message --- */}
                    {errors.password && <p className="error-text">{errors.password}</p>}
                </div>

                 <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="password-wrapper">
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            id="confirmPassword" 
                            placeholder="Confirm new password" 
                            value={confirmPassword} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                           {showConfirmPassword ? <svg className="icon icon-eye-off" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg className="icon icon-eye" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                        </span>
                    </div>
                     {/* --- NEW: Real-time error message --- */}
                    {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                </div>

                <button type="submit" className="btn btn-primary btn-profile-save" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default ProfileDetails;