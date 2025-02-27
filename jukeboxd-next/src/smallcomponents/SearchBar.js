import { useState, useEffect } from 'react';
import {
  SearchBarContainer,
  SearchInput,
  RecommendationList,
  RecommendationItem,
  RecommendationDetails,
  DropdownContainer,
  SearchDropdown,
} from '@/styles/StyledComponents'; // Assuming these styled components exist
import { useRouter } from 'next/router'; // Import useRouter from Next.js
import { SpotifyAPIController } from '@/utils/SpotifyAPIController'; // Import your API controller
import { useAtom } from 'jotai';
import { fetchTokenAtom, tokenAtom, tokenExpirationAtom } from '@/states/spotifyTokenManager'; // Updated import
import { currSong } from '@/states/currSong';

const SearchBar = (props) => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [token, _] = useAtom(tokenAtom); // Access token state
  const [tokenExpiration, __] = useAtom(tokenExpirationAtom); // Access token expiration time
  const [, fetchToken] = useAtom(fetchTokenAtom); // Trigger token fetch
  const [queryType, setQueryType] = useState('track'); // Default to 'track'
  const router = useRouter(); // Use Next.js router for dynamic navigation
  const [selectedSong, setSelectedSong] = useAtom(currSong);
  const searchBarType = props.type; // Use props.type for search bar type

  // Fetch token on component mount
  useEffect(() => {
    const fetchTokenOnMount = async () => {
      try {
        await fetchToken(); // Ensure token is fetched on load
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchTokenOnMount(); // Call the function
  }, [fetchToken]); // fetchToken as dependency

  // Fetch recommendations when the query changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (query.length > 2) { // Start searching when the user types at least 3 characters
        
        console.log(searchBarType)

        // Check if the token is expired
        if (!token || Date.now() >= tokenExpiration) {
          console.log('Token expired, fetching a new one...');
          await fetchToken(); // Refresh the token if expired
        }

        try {
          let results = [];
          if (queryType === 'track') {
            results = await SpotifyAPIController.searchTracks(token, query); // Fetch 20 results
          } else if (queryType === 'artist') {
            results = await SpotifyAPIController.searchArtists(token, query); // Fetch 20 results
          } else if (queryType === 'album') {
            results = await SpotifyAPIController.searchAlbums(token, query); // Fetch 20 results
          }

          // Filtering logic for albums
          const uniqueResults = results.filter((item, index, self) => {
            if (queryType === 'album') {
              return index === self.findIndex((t) =>
                t.name === item.name &&
                t.release_date === item.release_date &&
                t.total_tracks === item.total_tracks &&
                t.artists.map(artist => artist.name).join(', ') === item.artists.map(artist => artist.name).join(', ')
              );
            } else if (queryType === 'track') {
              return index === self.findIndex((t) =>
                t.name === item.name &&
                t.album?.name === item.album?.name &&
                t.album?.release_date === item.album?.release_date &&
                t.artists.map(artist => artist.name).join(', ') === item.artists.map(artist => artist.name).join(', ')
              );
            } else {
              return index === self.findIndex((t) => t.id === item.id);
            }
          });

          // Set the first 5 unique recommendations
          setRecommendations(uniqueResults.slice(0, 5));
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      } else {
        setRecommendations([]); // Clear recommendations if query is too short
      }
    };

    fetchRecommendations();
  }, [query, token, queryType, fetchToken, tokenExpiration]); // Added tokenExpiration as a dependency to check expiration

  const handleHeaderClick = (item) => {
    if (queryType === 'album') {
      router.push(`/album-page/${item.id}`); // Navigate to /album-page/[id]
    } else if (queryType === 'track') {
      router.push(`/song-page/${item.id}`); // Navigate to /song-page/[id]
    } else if (queryType === 'artist') {
      router.push(`/artist-page/${item.id}`); // Navigate to /artist-page/[id]
    }

    setQuery(''); // Clear search input after navigation
    setRecommendations([]);
  };

  // Set selected Song
  function handleReviewClick(item) {
    // DEBUGGING PRINT
    // console.log(item);

    // Determine the image based on queryType
    let selectedImage = '';

    if (queryType === 'track' && item.album && item.album.images.length > 0) {
      selectedImage = item.album.images[0].url;
    } else if (queryType === 'album' && item.images && item.images.length > 0) {
      selectedImage = item.images[0].url;
    } else if (
      queryType === 'artist' &&
      item.images &&
      item.images.length > 0
    ) {
      selectedImage = item.images[0].url;
    }
    setSelectedSong({
      name: item.name,
      image: selectedImage,
    });
    setRecommendations([]);
    setQuery('');
  }

  function handleClick(item) {
    if (searchBarType === 'review') {
      handleReviewClick(item);
    } else if (searchBarType === 'header') {
      handleHeaderClick(item);
    }
  }

  return (
    <SearchBarContainer>
      <DropdownContainer>
        <SearchDropdown
          value={queryType}
          onChange={(e) => setQueryType(e.target.value)}
        >
          {/* Conditionally render dropdown options based on searchBarType */}
          {searchBarType === 'header' && (
            <>
              <option value="track">Track</option>
              <option value="artist">Artist</option>
              <option value="album">Album</option>
            </>
          )}
          {searchBarType === 'review' && (
            <>
              <option value="track">Track</option>
              <option value="album">Album</option>
            </>
          )}
        </SearchDropdown>
      </DropdownContainer>

      <SearchInput
        type="text"
        placeholder={`Search for ${queryType}s...`} // Dynamic placeholder
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {recommendations.length > 0 && (
        <RecommendationList>
          {recommendations.map((item) => (
            <RecommendationItem
              key={item.id}
              onClick={() => handleClick(item)} // On item click, navigate
            >
              {/* Display album images, artist images, or song images */}
              {queryType === 'track' && item.album && item.album.images.length > 0 && (
                <img src={item.album.images[0].url} alt={item.name} />
              )}
              {queryType === 'artist' && item.images && item.images.length > 0 && (
                <img src={item.images[0].url} alt={item.name} />
              )}
              {queryType === 'album' && item.images && item.images.length > 0 && (
                <img src={item.images[0].url} alt={item.name} />
              )}

              <RecommendationDetails>
                <span className="song-title">{item.name}</span>
                {queryType === 'track' || queryType === 'album' ? (
                  <span className="artist-name">
                    {item.artists.map((artist) => artist.name).join(', ')}
                  </span>
                ) : null} {/* No special artist handling for artist search */}
              </RecommendationDetails>
            </RecommendationItem>
          ))}
        </RecommendationList>
      )}
    </SearchBarContainer>
  );
};

export default SearchBar;