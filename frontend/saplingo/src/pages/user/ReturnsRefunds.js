// src/pages/user/ReturnsRefunds.js

import React from 'react';
import { Link } from 'react-router-dom';

const ReturnsRefunds = () => {
    return (
        <div className="profile-content-section">
            <h3 className="profile-content-title">Returns & Refunds Policy</h3>
            
            <div className="policy-text">
                <p><strong>Our Commitment to You</strong></p>
                <p>
                    At Saplingo, we are dedicated to providing you with the healthiest, highest-quality saplings. If you are not 100% satisfied with your purchase, we are here to help.
                </p>

                <h4>30-Day Healthy Plant Guarantee</h4>
                <p>
                    We guarantee your plant will arrive in a healthy condition and will remain healthy for 30 days. If your plant arrives damaged or dies within this period, please follow the steps below to request a refund or replacement.
                </p>

                <h4>How to Request a Return</h4>
                <ol>
                    <li>
                        <strong>Contact Us:</strong> Please email our support team at <a href="mailto:support@saplingo.com">support@saplingo.com</a> within 30 days of receiving your order.
                    </li>
                    <li>
                        <strong>Provide Details:</strong> In your email, include your order number, the name of the plant, and a clear photo of the issue. This helps us understand what went wrong.
                    </li>
                    <li>
                        <strong>Review:</strong> Our team will review your request within 2 business days. We may offer care tips if we believe the plant can be revived.
                    </li>
                    <li>
                        <strong>Resolution:</strong> If a return is approved, we will offer you the choice of a full refund to your original payment method or a free replacement sent to you at no additional cost.
                    </li>
                </ol>

                <h4>Non-Refundable Items</h4>
                <p>
                    Please note that gift cards and items damaged due to improper care after the 30-day guarantee period are not eligible for refunds.
                </p>

                <p className="policy-footer">
                    Have questions? <Link to="/contact">Contact our support team</Link> anytime.
                </p>
            </div>
        </div>
    );
};

// --- THIS IS THE CRITICAL MISSING LINE ---
// This makes the component available to be imported by other files like Profile.js
export default ReturnsRefunds;