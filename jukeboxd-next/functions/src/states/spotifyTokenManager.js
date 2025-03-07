import { SpotifyAPIController } from '../utils/SpotifyAPIController';

class spotifyTokenManager {
  constructor() {
    this.token = null;
    this.tokenExpiration = null;
  }

  // A method to get the current token, checking expiration and refreshing if necessary
  async getToken() {
    if (!this.token || (this.tokenExpiration && Date.now() >= this.tokenExpiration)) {
      await this.fetchToken();
    }
    return this.token;
  }

  // Method to actually fetch a new token
  async fetchToken() {
    try {
      const tokenData = await SpotifyAPIController.getToken(); // Make the API call to fetch the token

      if (tokenData) {
        this.token = tokenData.access_token;
        this.tokenExpiration = tokenData.expires_at;
      } else {
        throw new Error('Failed to fetch Spotify token');
      }
    } catch (error) {
      console.error('Error fetching Spotify token:', error);
    }
  }
}

// Singleton instance of the TokenService
const spotifyTokenService = new spotifyTokenManager();

export default spotifyTokenService;