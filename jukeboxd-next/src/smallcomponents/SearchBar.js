import { useState, useEffect } from 'react';
import {
  SearchBarContainer,
  SearchInput,
  RecommendationList,
  RecommendationItem,
  RecommendationDetails,
  DropdownContainer,
  SearchDropdown,
} from '../styles/StyledComponents'; // Assuming these styled components exist
import { SpotifyAPIController } from '../utils/SpotifyAPIController'; // Import your API controller

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [token, setToken] = useState('');
  const [queryType, setQueryType] = useState('track'); // Default to 'track'

  // Fetch token on component mount
  useEffect(() => {
    const fetchToken = async () => {
      const token = await SpotifyAPIController.getToken();
      console.log(token);
      setToken(token);
    };
    fetchToken();
  }, []);

  // Fetch recommendations when the query changes
  useEffect(() => {
    if (query.length > 2) { // Start searching when the user types at least 3 characters
      const fetchRecommendations = async () => {
        let results = [];
        if (queryType === 'track') {
          results = await SpotifyAPIController.searchTracks(token, query, 20); // Fetch 20 results
        } else if (queryType === 'artist') {
          results = await SpotifyAPIController.searchArtists(token, query, 20); // Fetch 20 results
        } else if (queryType === 'album') {
          results = await SpotifyAPIController.searchAlbums(token, query, 20); // Fetch 20 results
        }

        // Filtering logic for albums
        const uniqueResults = results.filter((item, index, self) => {
          if (queryType === 'album') {
            // For albums, check name, release date, total tracks, and artists
            return index === self.findIndex((t) =>
              t.name === item.name &&
              t.release_date === item.release_date &&
              t.total_tracks === item.total_tracks &&
              t.artists.map(artist => artist.name).join(', ') === item.artists.map(artist => artist.name).join(', ')
            );
          } else if (queryType === 'track') {
            // For tracks, check name, release date, album, and artists
            return index === self.findIndex((t) =>
              t.name === item.name &&
              t.album?.name === item.album?.name && // Check if they belong to the same album
              t.album?.release_date === item.album?.release_date && // Compare album release date
              t.artists.map(artist => artist.name).join(', ') === item.artists.map(artist => artist.name).join(', ')
            );
          } else {
            // For artists, fallback to filtering by 'id'
            return index === self.findIndex((t) => t.id === item.id);
          }
        });

        console.log(uniqueResults)

        // Set the first 5 unique recommendations
        setRecommendations(uniqueResults.slice(0, 5));
      };
      fetchRecommendations();
    } else {
      setRecommendations([]); // Clear recommendations if query is too short
    }
  }, [query, token, queryType]);

  return (
    <SearchBarContainer>
      <DropdownContainer>
        <SearchDropdown
          value={queryType} // Make sure this is consistent
          onChange={(e) => setQueryType(e.target.value)} // Update the state on change
        >
          <option value="track">Track</option>
          <option value="artist">Artist</option>
          <option value="album">Album</option>
        </SearchDropdown>
      </DropdownContainer>

      <SearchInput
        type="text"
        placeholder={`Search for ${queryType}s...`} // Dynamic placeholder based on the queryType
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {recommendations.length > 0 && (
        <RecommendationList>
          {recommendations.map((item) => (
            <RecommendationItem key={item.id}>
               {queryType === 'track' && item.album && item.album.images.length > 0 && (
               <img src={item.album.images[0].url} alt={item.name} />
              )}

              {queryType === 'album' && item.images && item.images.length > 0 && (
                <img src={item.images[0].url} alt={item.name} />
              )}

              {queryType === 'artist' && item.images && item.images.length > 0 && (
                <img src={item.images[0].url} alt={item.name} />
              )}
              <RecommendationDetails>
                <span className="song-title">{item.name}</span>
                {queryType === 'track' || queryType === 'album' && (
              <span className="artist-name">
                {item.artists.map(artist => artist.name).join(', ')}
              </span>
              )}
              </RecommendationDetails>
            </RecommendationItem>
          ))}
        </RecommendationList>
      )}
    </SearchBarContainer>
  );
};

export default SearchBar;