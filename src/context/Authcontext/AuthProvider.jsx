import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, getIdToken } from 'firebase/auth';
import auth from '../../firebase/firebase.init';
import axios from 'axios';
import { schoolConfig } from '../../config/schoolConfig';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null); // 'admin', 'student', or null

    const createUser = async (email, password, name, photo) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // After the user is created, update their profile
                const user = userCredential.user;
                await updateProfile(user, {
                    displayName: name,
                    photoURL: photo,
                });

                // Get Firebase ID token
                const token = await getIdToken(user);
                localStorage.setItem('firebaseToken', token);

                // Register user on backend
                try {
                    await axios.post(`${API_URL}/auth/register`, {
                        email,
                        displayName: name,
                        photoURL: photo,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (err) {
                    console.error('Backend registration error:', err);
                }

                return user;
            });
    }

    const singInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Get Firebase ID token on login
                const token = await getIdToken(userCredential.user);
                localStorage.setItem('firebaseToken', token);
                return userCredential;
            });
    }

    const signOutUser = () => {
        setLoading(true);
        localStorage.removeItem('firebaseToken');
        return signOut(auth);
    }

    // Sign in with Google
    const signInWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider();
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
            .then(async (userCredential) => {
                // Get Firebase ID token on Google signin
                const token = await getIdToken(userCredential.user);
                localStorage.setItem('firebaseToken', token);

                // Register/update user on backend
                try {
                    await axios.post(`${API_URL}/auth/register`, {
                        email: userCredential.user.email,
                        displayName: userCredential.user.displayName,
                        photoURL: userCredential.user.photoURL,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (err) {
                    console.error('Backend Google registration error:', err);
                }

                return userCredential;
            });
    };

    // Helper function to determine user role
    const determineUserRole = (userEmail) => {
        if (!userEmail) return null;
        if (schoolConfig.adminEmails.includes(userEmail)) {
            return 'admin';
        }
        return 'student';
    };

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser?.email) {
                try {
                    // Get and store Firebase ID token
                    const token = await getIdToken(currentUser);
                    localStorage.setItem('firebaseToken', token);

                    // Determine user role based on email
                    const role = determineUserRole(currentUser.email);
                    setUserRole(role);

                    setLoading(false);
                } catch (err) {
                    console.error('Token error:', err);
                    setLoading(false);
                }
            } else {
                // Clear token on logout
                setUserRole(null);
                localStorage.removeItem('firebaseToken');
                setLoading(false);
            }
        });
    
        return () => {
            unSubscribe();
        };
    }, []);
    

    const authInfo = {
        user,
        loading,
        userRole,
        isAdmin: userRole === 'admin',
        createUser,
        singInUser,
        signOutUser,
        signInWithGoogle,
    }
    return (
        <AuthContext.Provider value={authInfo}>
                {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
