import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
  isAdmin: string;
  email: string;
  iat: number; // "iat" (issued at) field1
  exp: number; // "exp" (expiration time) field
}


interface AuthContextType {
  user: DecodedToken | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define AuthProviderProps interface
interface AuthProviderProps {
  children: React.ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize user state
  const [user, setUser] = useState<DecodedToken | null>(null);
  

  
  // Update the decodeToken function
  const decodeToken = (token: string): DecodedToken => {
    try {
      // Decode token
      const decodedToken = jwtDecode(token) as DecodedToken;
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token');
    }
  };
  
  // Function to handle login
  const login = (token: string) => {
    // Store token in local storage
    localStorage.setItem('token', token);
    // Decode token and extract user information
    const userData = decodeToken(token);
    
    // Update user state
    setUser(userData);
    // console.log("User state:", user);

  };

  // Function to handle logout
  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    // Update user state
    setUser(null);

  };

  // Check for user authentication upon component mount and when token changes
// Inside AuthProvider component, useEffect hook

// Check for user authentication upon component mount and when token changes
useEffect(() => {
//   console.log("Checking for token...");
  const token = localStorage.getItem('token');
//   console.log("Token:", token);
  if (token) {
    const userData = decodeToken(token);
    // console.log("Decoded Token:", userData);
    setUser(userData);
  } else {
    setUser(null); // Ensure user is null if token is not present
  }
}, []);


  // Provide context value
  const contextValue: AuthContextType = {
    user,
    login,
    logout
  };

  // Render context provider with children
  return (
    <AuthContext.Provider value={contextValue}>
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
