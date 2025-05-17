export interface Song {
  id: string;
  title: string;
  artist: string;
  emotion: string;
  audio_url: string;
  cover_url: string;
  album: string;
  duration: string;
}

// Import and re-export the database function
export { getRandomSongForEmotion } from './database'; 