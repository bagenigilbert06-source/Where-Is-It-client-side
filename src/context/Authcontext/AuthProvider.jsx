import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import axios from 'axios';
import { schoolConfig } from '../../config/schoolConfig';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null); // 'admin', 'student', or null

    // Helper function to determine user role
    const determineUserRole = (userEmail) => {
        if (!userEmail) return null;
        if (schoolConfig.adminEmails.includes(userEmail)) {
            return 'admin';
        }
        return 'student';
    };

    // Register user with backend
    const createUser = async (email, password, displayName, photoURL) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                email,
                password,
                displayName,
                photoURL,
            });

            const userData = response.data.user;
            setUser(userData);
            localStorage.setItem('token', response.data.token);
            const role = determineUserRole(userData.email);
            setUserRole(role);

            return userData;
        } catch (error) {
            setLoading(false);
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    // Login user with backend
    const singInUser = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            const userData = response.data.user;
            setUser(userData);
            localStorage.setItem('token', response.data.token);
            const role = determineUserRole(userData.email);
            setUserRole(role);

            return userData;
        } catch (error) {
            setLoading(false);
            throw error.response?.data?.message || 'Login failed';
        }
    };

    // Logout user
    const signOutUser = async () => {
        try {
            setUser(null);
            setUserRole(null);
            localStorage.removeItem('token');
            return true;
        } catch (error) {
            throw error;
        }
    };

    // Restore session from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Verify token and get user data
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                // You can make a call to get current user if needed
                // For now, assume the user data can be fetched when needed
                setLoading(false);
            } catch (error) {
                console.error('Token validation error:', error);
                localStorage.removeItem('token');
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    // Set token in axios headers when user changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [user]);

    const authInfo = {
        user,
        loading,
        userRole,
        isAdmin: userRole === 'admin',
        createUser,
        singInUser,
        signOutUser,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
