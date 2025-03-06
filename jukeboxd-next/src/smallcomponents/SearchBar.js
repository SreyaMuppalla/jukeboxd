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
import { currItem } from '@/states/currItem';
import { searchUsers } from '@/backend/users';
import { useAtom } from 'jotai';
import spotifyTokenService from '../states/spotifyTokenManager'; // Import the singleton

const SearchBar = ({ type: searchBarType }) => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [queryType, setQueryType] = useState('song');

  const router = useRouter();
  const [selectedItem, setSelectedItem] = useAtom(currItem);

  // Fetch token on mount
  useEffect(() => {
    const initializeToken = async () => {
      try {
        await spotifyTokenService.getToken(); // Fetch token from the singleton
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    initializeToken();
  }, []);

  // Debounced fetch recommendations
  const debouncedFetchRecommendations = useCallback(
    debounce(async (inputQuery, queryType) => {
      if (inputQuery.length > 2) {
        const token = await spotifyTokenService.getToken(); // Get the current token

        try {
          let results = [];
          if (queryType === 'song') {
            results = await SpotifyAPIController.searchSongs(token, inputQuery);
          } else if (queryType === 'artist') {
            results = await SpotifyAPIController.searchArtists(token, inputQuery);
          } else if (queryType === 'album') {
            results = await SpotifyAPIController.searchAlbums(token, inputQuery);
          } else if (queryType === 'profile') {
            results = await searchUsers(inputQuery);
            if (results) {
              if (Array.isArray(results) === false) {
                results = [results];
              }
            } else {
              results = [];
            }
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
            }
            else {
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
    []
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
      const selectedImages = item.album?.images || item.images || ''; // Handle song, artist, or album image

      console.log(item)

      let itemInfo = {
        album_id: item.id,
        album_name: item.name,
        artists: item.artists.map(artist => ({
          id: artist.id,
          name: artist.name
        })),  // Array of artist ids and names
        song_id: null,
        song_name: null,
        images: selectedImages,
        review_type: queryType,  // Either 'album' or 'song'
      };
    
      if (queryType === 'song') {
        itemInfo = {
          ...itemInfo,
          album_id: item.album.id,
          album_name: item.album.name,
          song_id: item.id,
          song_name: item.name,
        };
      }
    
      setSelectedItem(itemInfo);
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
              <option value="profile">User</option>
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
                {
                (queryType === 'profile' && item.profilePicture) ||
                (queryType === 'song' && item.album?.images?.[0]?.url) ||
                (queryType === 'artist' && item.images?.[0]?.url) ||
                (queryType === 'album' && item.images?.[0]?.url) ? (
                  <img src={item.album?.images?.[0]?.url || item.images?.[0]?.url} alt={item.name} />
                ) : null}

                <RecommendationDetails>
                  {queryType === 'profile' ? (
                    <>
                      <span className="user-name">{item.username || 'Unknown User'}</span>
                    </>
                  ) : (
                    <>
                      <span className="song-title">{item.name}</span>
                      {(queryType === 'song' || queryType === 'album') && (
                        <span className="artist-name">
                          {item.artists && item.artists.length > 0 
                            ? item.artists.map((artist) => artist.name).join(', ') 
                            : 'Unknown Artist'}
                        </span>
                      )}
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