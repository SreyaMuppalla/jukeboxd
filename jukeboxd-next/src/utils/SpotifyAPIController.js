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
    
    const _searchTracks = async (token, query) => {
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

    const _getAlbumTracks = async (token, id) => {
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

    const _getAlbumDetails = async (token, id) => {

        const apiUrl = `https://api.spotify.com/v1/albums/${id}`;

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
            artists: data.artists.map(artist => ({
                id: artist.id,
                name: artist.name
            })),
            release_date: data.release_date,
            total_tracks: data.total_tracks,
            external_urls: data.external_urls.spotify,
            images: data.images // Array of image objects (useful for displaying album art)
            };
        } catch (error) {
            console.error('Error fetching album details:', error);
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
            release_date: data.release_date,
            images: data.album.images // Array of image objects (useful for displaying album art)
            };
        } catch (error) {
            console.error('Error fetching song details:', error);
            return null;
        }

    }
    const _getTopArtistDetails = async (token, id) => 
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

    return {
        getToken() {
            return _getToken();
        },
        searchTracks(token, query) {
            return _searchTracks(token, query);
        },
        searchArtists(token, query) {
            return _searchArtists(token, query);
        },
        searchAlbums(token, query) {
            return _searchAlbums(token, query);
        },
        getAlbumTracks(token, id)
        {
            return _getAlbumTracks(token, id);
        },
        getAlbumDetails(token, id)
        {
            return _getAlbumDetails(token, id);
        },
        getSongDetails(token, id)
        {
            return _getSongDetails(token, id);
        },
        getArtistsDetails(token, id)
        {
            return _getTopArtistDetails(token, id);
        }
    }
})();