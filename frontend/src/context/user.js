import { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '../services/AuthService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user information from the token when the context is initialized
    const userData = AuthService.getUserFromToken();
    setUser(userData);
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser: setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
