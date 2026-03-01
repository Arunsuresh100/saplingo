// backend/models/userModel.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
        
        // --- ADD THIS NEW FIELD ---
        shippingAddress: {
            address: { type: String },
            city: { type: String },
            postalCode: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

// --- Purpose: A method to compare the entered password with the hashed password in the DB ---
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- Purpose: A middleware function that runs BEFORE a new user is saved ---
// This will automatically hash the password if it's new or has been changed.
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        next();
    }
    // Generate a "salt" to make the hash more secure
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;