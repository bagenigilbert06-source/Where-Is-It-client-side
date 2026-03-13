import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  getIdToken 
} from 'firebase/auth';
import auth from '../../firebase/firebase.init';
import { schoolConfig } from '../../config/schoolConfig';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    // Create user with Firebase, then register profile in MongoDB
    const createUser = async (email, password, displayName, photoURL) => {
        setLoading(true);
        try {
            // Create Firebase user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Update Firebase profile
            await updateProfile(firebaseUser, {
                displayName: displayName,
                photoURL: photoURL,
            });

            // Get Firebase ID token
            const token = await getIdToken(firebaseUser);
            localStorage.setItem('firebaseToken', token);

            // Register user profile in MongoDB
            try {
                await axios.post(`${API_URL}/auth/register`, {
                    email: firebaseUser.email,
                    displayName: displayName,
                    photoURL: photoURL,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (mongoErr) {
                console.warn('MongoDB registration note:', mongoErr.message);
                // Don't fail if user already exists in MongoDB
            }

            return firebaseUser;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Sign in with Firebase email/password
    const singInUser = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await getIdToken(userCredential.user);
            localStorage.setItem('firebaseToken', token);
            return userCredential;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Sign out user
    const signOutUser = async () => {
        setLoading(true);
        localStorage.removeItem('firebaseToken');
        return signOut(auth);
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        const googleProvider = new GoogleAuthProvider();
        setLoading(true);
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const firebaseUser = userCredential.user;
            
            const token = await getIdToken(firebaseUser);
            localStorage.setItem('firebaseToken', token);

            // Sync Google user profile to MongoDB
            try {
                await axios.post(`${API_URL}/auth/register`, {
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (mongoErr) {
                console.warn('MongoDB sync note:', mongoErr.message);
            }

            return userCredential;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Determine user role based on email
    const determineUserRole = (userEmail) => {
        if (!userEmail) return null;
        if (schoolConfig.adminEmails.includes(userEmail)) {
            return 'admin';
        }
        return 'student';
    };

    // Monitor Firebase authentication state
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            if (currentUser?.email) {
                try {
                    // Get and store Firebase ID token
                    const token = await getIdToken(currentUser);
                    localStorage.setItem('firebaseToken', token);

                    // Set axios default header for API requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Determine user role
                    const role = determineUserRole(currentUser.email);
                    setUserRole(role);

                    setLoading(false);
                } catch (err) {
                    console.error('Token error:', err);
                    setLoading(false);
                }
            } else {
                // Clear data on logout
                setUserRole(null);
                localStorage.removeItem('firebaseToken');
                delete axios.defaults.headers.common['Authorization'];
                setLoading(false);
            }
        });

        return () => unSubscribe();
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
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
