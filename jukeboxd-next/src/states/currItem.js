import { atom } from 'jotai';

// Define an atom to hold the count state
export const currItem = atom(null); // Initial value is 0

// Below is the desire json structure(Can be updated):
/**
 * song_name: string - song/album/artist name
 * song_id: string - song/album/artist 
 * album_name: string - song
 * album_id : string - album_id
 * image: string - song/album/artst image url
 */