import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('firebaseToken', token);
          
          // Fetch user data from backend
          try {
            const response = await api.get('/api/users/me');
            if (isMounted) {
              setUserData(response.data);
            }
          } catch (error) {
            // User might not exist in backend yet, that's okay
            console.log('User data not found in backend:', error.message);
            if (isMounted) {
              setUserData(null);
            }
          }
        } else {
          setUser(null);
          setUserData(null);
          localStorage.removeItem('firebaseToken');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const register = async (name, email, password, photoURL) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (photoURL) {
        await updateProfile(userCredential.user, { photoURL });
      }
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseToken', token);
      
      // Register user in backend
      await api.post('/api/auth/register', {
        name,
        email,
        photoURL: photoURL || userCredential.user.photoURL || ''
      });
      
      toast.success('Registration successful!');
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseToken', token);
      
      // Register user in backend if not exists
      try {
        await api.post('/api/auth/register', {
          name: userCredential.user.displayName || 'User',
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL || ''
        });
      } catch (err) {
        // User might already exist, that's okay
      }
      
      toast.success('Login successful!');
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseToken', token);
      
      // Register user in backend
      await api.post('/api/auth/register', {
        name: userCredential.user.displayName || 'User',
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL || ''
      });
      
      toast.success('Login successful!');
      return userCredential.user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('firebaseToken');
      setUserData(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await api.get('/api/users/me');
      setUserData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  };

  const value = {
    user,
    userData,
    loading,
    register,
    login,
    googleLogin,
    logout,
    refreshUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

