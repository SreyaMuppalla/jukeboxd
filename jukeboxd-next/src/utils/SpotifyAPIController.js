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
                return data.access_token; // Return the access token
            } else {
                throw new Error(`Error: ${data.error_description}`);
            }
        } catch (error) {
            console.error('Error fetching token:', error);
            return null; // Return null in case of an error
        }
    }
    
    const _searchTracks = async (token, query) => {
        console.log(token)
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
        }
    }
})();