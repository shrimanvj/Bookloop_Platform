import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Check for existing auth data in localStorage
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        
        if (storedToken && storedUserId) {
            setToken(storedToken);
            setUserId(storedUserId);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (userData) => {
        if (userData.token && userData.userId) {
            localStorage.setItem('token', userData.token);
            localStorage.setItem('userId', userData.userId);
            setToken(userData.token);
            setUserId(userData.userId);
            setIsAuthenticated(true);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setToken(null);
        setUserId(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 