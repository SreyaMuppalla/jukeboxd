import { atom } from 'jotai';
import { SpotifyAPIController } from '../utils/SpotifyAPIController';

// Atom to hold the current token
export const tokenAtom = atom(null);

// Atom to hold the token expiration time
export const tokenExpirationAtom = atom(null);

// Fetch token function, which will be used to update token and expiration atoms
export const fetchTokenAtom = atom(
  (get) => get(tokenAtom), // Getter for token state
  async (get, set) => {
    const token = get(tokenAtom);
    const tokenExpiration = get(tokenExpirationAtom);

    try {
      // Check if the token is expired or missing
      if (!token || (tokenExpiration && Date.now() >= tokenExpiration)) {
        const tokenData = await SpotifyAPIController.getToken();
        if (tokenData) {
          set(tokenAtom, tokenData.access_token); // Set new token
          set(tokenExpirationAtom, tokenData.expires_at); // Set expiration time
        }
      }
    } catch (error) {
      console.error('Error fetching Spotify token:', error);
    }
  }
);