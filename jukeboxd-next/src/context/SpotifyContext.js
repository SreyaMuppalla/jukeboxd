import React, { createContext, useState, useEffect, useContext } from 'react';
import { SpotifyAPIController } from '../utils/SpotifyAPIController'; // Import your API controller

const SpotifyContext = createContext();

export const SpotifyProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);

  // Fetch token on component mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await SpotifyAPIController.getToken();
        setToken(token);
      } catch (error) {
        console.error('Error fetching token:', error);
        setError('Failed to fetch token.');
      }
    };
    fetchToken();
  }, []);

  return (
    <SpotifyContext.Provider value={{ token, error }}>
      {children}
    </SpotifyContext.Provider>
  );
};

// Custom hook to use the SpotifyContext
export const useSpotify = () => {
  return useContext(SpotifyContext);
};
