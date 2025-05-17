import { Song } from './emotionToSong';

// Sample songs with actual audio URLs
export const songs: Song[] = [
  {
    id: 'happy1',
    title: "Happy",
    artist: "Pharrell Williams",
    emotion: "happy",
    audio_url: "https://storage.googleapis.com/emotion-songs/happy.mp3",
    cover_url: "https://storage.googleapis.com/emotion-songs/happy-cover.jpg",
    album: "G I R L",
    duration: "3:53"
  },
  {
    id: 'sad1',
    title: "Someone Like You",
    artist: "Adele",
    emotion: "sad",
    audio_url: "https://storage.googleapis.com/emotion-songs/someone.mp3",
    cover_url: "https://storage.googleapis.com/emotion-songs/someone-cover.jpg",
    album: "21",
    duration: "4:45"
  },
  {
    id: 'angry1',
    title: "Killing in the Name",
    artist: "Rage Against the Machine",
    emotion: "angry",
    audio_url: "https://storage.googleapis.com/emotion-songs/killing.mp3",
    cover_url: "https://storage.googleapis.com/emotion-songs/killing-cover.jpg",
    album: "Rage Against the Machine",
    duration: "5:13"
  },
  {
    id: 'surprised1',
    title: "Thriller",
    artist: "Michael Jackson",
    emotion: "surprised",
    audio_url: "https://storage.googleapis.com/emotion-songs/thriller.mp3",
    cover_url: "https://storage.googleapis.com/emotion-songs/thriller-cover.jpg",
    album: "Thriller",
    duration: "5:57"
  },
  {
    id: 'fearful1',
    title: "The Sound of Silence",
    artist: "Simon & Garfunkel",
    emotion: "fearful",
    audio_url: "https://storage.googleapis.com/emotion-songs/sound-of-silence.mp3",
    cover_url: "https://storage.googleapis.com/emotion-songs/sound-of-silence-cover.jpg",
    album: "Sounds of Silence",
    duration: "3:05"
  },
  {
    id: 'disgusted1',
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    emotion: "disgusted",
    audio_url: "https://storage.googleapis.com/emotion-songs/teen-spirit.mp3",
    cover_url: "https://storage.googleapis.com/emotion-songs/teen-spirit-cover.jpg",
    album: "Nevermind",
    duration: "5:01"
  },
  {
    id: 'neutral1',
    title: "Clocks",
    artist: "Coldplay",
    emotion: "neutral",
    audio_url: "https://storage.googleapis.com/emotion-songs/clocks.mp3",
    cover_url: "https://storage.googleapis.com/emotion-songs/clocks-cover.jpg",
    album: "A Rush of Blood to the Head",
    duration: "5:07"
  },
  {
    id: 'shaabaashiyaan1',
    title: "Shaabaashiyaan",
    artist: "Vishal Dadlani, Benny Dayal",
    emotion: "happy",
    audio_url: "https://storage.googleapis.com/emotion-songs/shaabaashiyaan.mp3",
    cover_url: "https://storage.googleapis.com/emotion-songs/shaabaashiyaan-cover.jpg",
    album: "Mission Mangal",
    duration: "3:45"
  },
  {
    id: 'shayad1',
    title: "Shayad",
    artist: "Arijit Singh",
    emotion: "sad",
    audio_url: "https://storage.googleapis.com/emotion-songs/shayad.mp3",
    cover_url: "https://storage.googleapis.com/emotion-songs/shayad-cover.jpg",
    album: "Love Aaj Kal",
    duration: "4:07"
  }
];

// Function to get a song by ID
export const getSongById = (id: string): Song | undefined => {
  return songs.find(song => song.id === id);
};

// Function to get songs by emotion
export const getSongsByEmotion = (emotion: string): Song[] => {
  return songs.filter(song => song.emotion.toLowerCase() === emotion.toLowerCase());
};

// Function to get a random song for an emotion
export const getRandomSongForEmotion = (emotion: string): Song => {
  const emotionSongs = getSongsByEmotion(emotion);
  if (emotionSongs.length === 0) {
    // If no songs found for the emotion, return a random song
    return songs[Math.floor(Math.random() * songs.length)];
  }
  return emotionSongs[Math.floor(Math.random() * emotionSongs.length)];
}; 