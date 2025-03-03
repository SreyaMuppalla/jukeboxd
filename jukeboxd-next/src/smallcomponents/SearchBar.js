import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash'; // Import debounce from lodash
import {
  SearchBarContainer,
  SearchInputContainer,
  SearchInput,
  RecommendationList,
  RecommendationItem,
  RecommendationDetails,
  DropdownContainer,
  SearchDropdown,
} from '@/styles/StyledComponents'; // Assuming these styled components exist
import { useRouter } from 'next/router';
import { SpotifyAPIController } from '@/utils/SpotifyAPIController';
import { useAtom } from 'jotai';
import { fetchTokenAtom, tokenAtom, tokenExpirationAtom } from '@/states/spotifyTokenManager';
import { currSong } from '@/states/currSong';

const SearchBar = ({ type: searchBarType }) => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [queryType, setQueryType] = useState('song');

  const router = useRouter();
  const [selectedSong, setSelectedSong] = useAtom(currSong);

  // Token-related states
  const [token] = useAtom(tokenAtom);
  const [tokenExpiration] = useAtom(tokenExpirationAtom);
  const [, fetchToken] = useAtom(fetchTokenAtom);

  // Fetch token on mount
  useEffect(() => {
    const initializeToken = async () => {
      try {
        await fetchToken();
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    initializeToken();
  }, [fetchToken]);

  // Debounced fetch recommendations
const debouncedFetchRecommendations = useCallback(
  debounce(async (inputQuery, queryType) => {
    if (inputQuery.length > 2) {
      if (!token || Date.now() >= tokenExpiration) {
        await fetchToken();
      }

      try {
        let results = [];
        if (queryType === 'song') {
          results = await SpotifyAPIController.searchSongs(token, inputQuery);
        } else if (queryType === 'artist') {
          results = await SpotifyAPIController.searchArtists(token, inputQuery);
        } else if (queryType === 'album') {
          results = await SpotifyAPIController.searchAlbums(token, inputQuery);
        }

        const uniqueResults = results.filter((item, index, self) => {
          if (queryType === 'album') {
            return index === self.findIndex((t) =>
              t.name === item.name &&
              t.release_date === item.release_date &&
              t.total_tracks === item.total_tracks &&
              t.artists.map((artist) => artist.name).join(', ') === item.artists.map((artist) => artist.name).join(', ')
            );
          } else if (queryType === 'song') {
            return index === self.findIndex((t) =>
              t.name === item.name &&
              t.album?.name === item.album?.name &&
              t.album?.release_date === item.album?.release_date &&
              t.artists.map((artist) => artist.name).join(', ') === item.artists.map((artist) => artist.name).join(', ')
            );
          } else {
            return index === self.findIndex((t) => t.id === item.id);
          }
        });

        setRecommendations(uniqueResults.slice(0, 5));
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    } else {
      setRecommendations([]);
    }
  }, 300), // 300ms debounce delay
  [token, tokenExpiration, fetchToken]
);

// Handle query type change
useEffect(() => {
  setRecommendations([]); // Clear recommendations immediately on query type change
  debouncedFetchRecommendations(query, queryType); // Fetch new recommendations based on the new query type
}, [queryType, query]); // Trigger when queryType or query changes

  // Handle clicks based on the search bar type
  const handleItemClick = (item) => {
    const navigateToPage = (page, id) => {
      router.push(`/${page}-page/${id}`);
      setQuery(''); // Clear input after navigation
      setRecommendations([]);
    };

    const handleReviewSelection = () => {
      const selectedImage =
        item.album?.images?.[0]?.url || item.images?.[0]?.url || ''; // Handle song, artist, or album image

      setSelectedSong({ name: item.name, image: selectedImage });
      setQuery(''); // Clear input after selection
      setRecommendations([]);
    };

    searchBarType === 'review' ? handleReviewSelection() : navigateToPage(queryType, item.id);
  };

  return (
    <SearchBarContainer>
      <DropdownContainer>
        <SearchDropdown value={queryType} onChange={(e) => setQueryType(e.target.value)}>
          {/* Dynamic dropdown options based on searchBarType */}
          {searchBarType === 'header' && (
            <>
              <option value="song">Song</option>
              <option value="artist">Artist</option>
              <option value="album">Album</option>
            </>
          )}
          {searchBarType === 'review' && (
            <>
              <option value="song">Song</option>
              <option value="album">Album</option>
            </>
          )}
        </SearchDropdown>
      </DropdownContainer>

      <SearchInputContainer>
      <SearchInput
        type="text"
        placeholder={`Search for ${queryType}s...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {recommendations.length > 0 && (
        <RecommendationList>
          {recommendations.map((item) => (
            <RecommendationItem key={item.id} onClick={() => handleItemClick(item)}>
              {/* Conditionally render images for song, artist, or album */}
              {(queryType === 'song' && item.album?.images?.[0]?.url) ||
              (queryType === 'artist' && item.images?.[0]?.url) ||
              (queryType === 'album' && item.images?.[0]?.url) ? (
                <img src={item.album?.images?.[0]?.url || item.images?.[0]?.url} alt={item.name} />
              ) : null}

              <RecommendationDetails>
              <span className="song-title">{item.name}</span>
            {(queryType === 'song' || queryType === 'album') && (
              <>
                {console.log('Current item:', item, 'Query Type:', queryType)}
                <span className="artist-name">
                  {item.artists && item.artists.length > 0 ? item.artists.map((artist) => artist.name).join(', ') : 'Unknown Artist'}
                </span>
              </>
          )}
              </RecommendationDetails>
            </RecommendationItem>
          ))}
        </RecommendationList>
      )}
    </SearchInputContainer>
    </SearchBarContainer>
  );
};

export default SearchBar;
