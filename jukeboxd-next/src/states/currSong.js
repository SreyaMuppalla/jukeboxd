import { atom } from 'jotai';

// Define an atom to hold the count state
export const currSong = atom(null); // Initial value is 0

// Below is the desire json structure(Can be updated):
/**
 * name: string - song/album/artist name
 * image: string - song/album/artest image url
 */