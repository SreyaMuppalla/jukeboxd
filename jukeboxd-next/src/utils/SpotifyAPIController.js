// Remove this import - it's causing the Node.js module errors
// import { getTraceEvents } from "next/dist/trace";

export const SpotifyAPIController = (function() {
    
    const clientId = '741e4ac323a24168ba7bc4463f9f47c3';
    const clientSecret = '529caac38f18436e8930f1e7c5e2755c';

    // private methods
    const _getToken = async () => {

        const tokenUrl = 'https://accounts.spotify.com/api/token';
    
        const body = new URLSearchParams({
            grant_type: 'client_credentials'
        });

        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
                },
                body: body.toString()
            });
            
            const data = await response.json();

            if (response.ok) {
                return {
                  access_token: data.access_token,
                  expires_at: Date.now() + data.expires_in * 1000, // Include expiration time in milliseconds
                };
              } else {
                throw new Error(`Error: ${data.error_description}`);
              }
            } catch (error) {
              console.error('Error fetching token:', error);
              return null; // Return null in case of error
            }
    }
    
    const _searchSongs = async (token, query) => {
        const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token }
        });

        const data = await result.json();
        return data.tracks.items;
    }

    const _searchArtists = async (token, query) => {
        const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=10`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token }
        });

        const data = await result.json();
        return data.artists.items;
    }

    const _searchAlbums = async (token, query) => {
        const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=10`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token }
        });

        const data = await result.json();
        return data.albums.items;
    }

    const _getAlbumDetails = async (token, id) => {

        try {
            // Step 1: Fetch album details
            const albumDetailsUrl = `https://api.spotify.com/v1/albums/${id}`;
            const albumResponse = await fetch(albumDetailsUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
        
            if (!albumResponse.ok) {
              throw new Error(`HTTP error! Status: ${albumResponse.status}`);
            }
        
            const albumData = await albumResponse.json();
        
            // Step 2: Fetch album tracks
            const albumTracksUrl = `https://api.spotify.com/v1/albums/${id}/tracks`;
            const tracksResponse = await fetch(albumTracksUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
        
            if (!tracksResponse.ok) {
              throw new Error(`HTTP error! Status: ${tracksResponse.status}`);
            }
        
            const tracksData = await tracksResponse.json();
        
        
            // Step 4: Return the combined album and tracks data
            return {
                id: albumData.id,
                name: albumData.name,
                artists: albumData.artists.map(artist => ({
                  id: artist.id,
                  name: artist.name,
                })),
                images: albumData.images, // Album art
                songs: tracksData.items.map(track => ({
                  id: track.id,
                  name: track.name,
                })), // List of track IDs and names
                review_score: 0,
                num_reviews: 0
              };
        
          } catch (error) {
            console.error('Error fetching album details and tracks:', error);
            return null;
          }
    }

    const _getSongDetails = async (token, id) => {
        const apiUrl = `https://api.spotify.com/v1/tracks/${id}`;

        try {
            const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
            });

            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Return the album details including artist names and IDs
            return {
            id: data.id,
            name: data.name,
            album: { id: data.album.id, name: data.album.name },
            artists: data.artists.map(artist => ({
                id: artist.id,
                name: artist.name
            })),
            images: data.album.images, // Array of image objects (useful for displaying album art)
            review_score: 0,
            num_reviews: 0
            };
        } catch (error) {
            console.error('Error fetching song details:', error);
            return null;
        }

    }
    const _getArtistDetails = async (token, id) => 
    {
        const apiUrl = `https://api.spotify.com/v1/artists/${id}`;

        try {
            const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
            });

            if (!response.ok) {
                console.log(response)
            throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Return the album details including artist names and IDs
            return {
            id: data.id,
            name: data.name,
            images: data.images // Array of image objects (useful for displaying album art)
            };
        } catch (error) {
            console.error('Error fetching song details:', error);
            return null;
        }
    }

    const _getAlbumSongs = async (token, id) => {
        const apiUrl = `https://api.spotify.com/v1/albums/${id}/tracks`;
        
        try {
            const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
            });

            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Return an object with all the tracks from the album, including the track id
            return data.items;
        } catch (error) {
            console.error('Error fetching album tracks:', error);
            return null;
        }
    }

    const _getTrendingSongs = async (token) => {
        const apiUrl = `https://api.spotify.com/v1/browse/new-releases`;

        try {
            const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
            });

            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Return the new releases
            return data.albums.items;
        } catch (error) {
            console.error('Error fetching trending songs:', error);
            return null;
        }
    }
    const _getArtistTopSongs = async (token, id) => {
        const apiUrl = `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`;

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            
            // Return the top tracks
            return data.tracks.map(track => ({
                id: track.id,
                name: track.name,
                album: { id: track.album.id, name: track.album.name },
                artists: track.artists.map(artist => ({
                    id: artist.id,
                    name: artist.name
                })),
                images: track.album.images
            }));
        } catch (error) {
            console.error('Error fetching artist top tracks:', error);
            return null;
        }
    };


    return {
        getToken() {
            return _getToken();
        },
        searchSongs(token, query) {
            return _searchSongs(token, query);
        },
        searchArtists(token, query) {
            return _searchArtists(token, query);
        },
        searchAlbums(token, query) {
            return _searchAlbums(token, query);
        },
        getAlbumDetails(token, id) {
            return _getAlbumDetails(token, id);
        },
        getAlbumSongs(token, id)
        {
            return _getAlbumSongs(token, id);
        },
        getSongDetails(token, id)
        {
            return _getSongDetails(token, id);
        },
        getArtistDetails(token, id) {
            return _getArtistDetails(token, id);
        },
        getArtistTopSongs(token, id) {
            return _getArtistTopSongs(token, id);
        },
        getTrendingSongs(token) {
            return _getTrendingSongs(token);
        }
    }
})();