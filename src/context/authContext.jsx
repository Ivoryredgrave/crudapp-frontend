import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { login as loginService, logout as logoutService } from '../API/authServices';
import { getSessionData, setSessionData, removeSessionData } from '../utils/storageUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isLogged, setIsLogged] = useState(() => getSessionData('isLogged') === 'true');
  const [user, setUser] = useState(() => {
    const savedUser = getSessionData('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const serializedUser = user ? JSON.stringify(user) : null;
    setSessionData('isLogged', isLogged);
    if (serializedUser) {
      setSessionData('user', serializedUser);
    } else {
      removeSessionData('user');
    }
  }, [isLogged, user]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'user') {
        const storedUser = getSessionData('user');
        const serializedUser = user ? JSON.stringify(user) : null;
        if (storedUser === null || storedUser !== serializedUser) {
          logout();
        }
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  const login = async (username, password) => {
    return await loginService(username, password, setIsLogged, setUser);
  };

  const logout = () => {
    logoutService(setIsLogged, setUser);
  };

  return (
    <AuthContext.Provider value={{ isLogged, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};