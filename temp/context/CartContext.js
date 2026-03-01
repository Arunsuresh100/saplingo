// src/context/CartContext.js

import React, { createContext, useState, useContext } from 'react';

// 1. Create the context (No changes here)
const CartContext = createContext();

// 2. Create a custom hook for easy access (No changes here)
export const useCart = () => {
    return useContext(CartContext);
};

// 3. Create ONE SINGLE Provider Component with all functions
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // --- THIS IS THE NEW FUNCTION, NOW INSIDE THE CORRECT PROVIDER ---
    const clearCart = () => {
        setCartItems([]); // Simply sets the cart to an empty array
    };


    // The value object now includes ALL functions, including clearCart
    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart, // <-- EXPORTING THE NEW FUNCTION
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};