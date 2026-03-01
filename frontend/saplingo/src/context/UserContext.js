// src/context/UserContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
        setLoading(false);
    }, []);

    // NEW, SIMPLER function to set authentication state
    const setAuth = (userData) => {
        if (userData) {
            localStorage.setItem('userInfo', JSON.stringify(userData));
            setUserInfo(userData);
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
    };

    const value = {
        userInfo,
        loading,
        setAuth, // We now export setAuth instead of login
        logout,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};