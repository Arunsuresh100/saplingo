import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the Context
const CartContext = createContext();

// 2. Create the custom hook for easy access
export const useCart = () => {
    return useContext(CartContext);
};

// 3. Create the Provider Component
export const CartProvider = ({ children }) => {
    // This function runs ONCE when the component first loads.
    // It checks localStorage for an existing cart.
    const getInitialCart = () => {
        try {
            const savedCart = localStorage.getItem('cartItems');
            // If a cart is found, parse it from JSON; otherwise, return an empty array.
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            // If parsing fails for any reason, start with an empty cart for safety.
            return [];
        }
    };

    // Initialize the cart state using the function above.
    const [cartItems, setCartItems] = useState(getInitialCart);

    // This useEffect hook runs EVERY time the `cartItems` state changes.
    // Its job is to save the new state back into localStorage.
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // --- Cart Management Functions ---
    // These functions work exactly as before. They update the state,
    // and the `useEffect` above automatically handles saving the changes.

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

    const clearCart = () => {
        setCartItems([]);
    };

    // The value object holds the state and functions to be shared with the rest of the app.
    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    };

    // This is the correct, single return statement with no extra tags.
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};