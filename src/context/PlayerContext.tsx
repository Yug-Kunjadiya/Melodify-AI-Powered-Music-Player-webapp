import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover_url: string;
  audio_url: string;
}

interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  songs: Song[];
  playlists: Playlist[];
  playSong: (song: Song) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
  likedSongs: string[];
  toggleLikeSong: (songId: string) => void;
  isSongLiked: (songId: string) => boolean;
  createPlaylist: (name: string) => void;
  removePlaylist: (playlistId: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songs, setSongs] = useState<Song[]>([]);
  const [audio] = useState(new Audio());
  const [likedSongs, setLikedSongs] = useState<string[]>(() => {
    const stored = localStorage.getItem('likedSongs');
    return stored ? JSON.parse(stored) : [];
  });
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const stored = localStorage.getItem('playlists');
    return stored ? JSON.parse(stored) : [];
  });

  // Validate audio URL format
  const isValidAudioFormat = (url: string): boolean => {
    const supportedFormats = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
    return supportedFormats.some(format => url.toLowerCase().endsWith(format));
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching songs:', error.message);
          return;
        }

        if (data) {
          setSongs(data);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching songs:', error.message);
        }
      }
    };

    fetchSongs();

    const subscription = supabase
      .channel('songs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'songs' }, () => {
        fetchSongs();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentSong) {
      if (!currentSong.audio_url || typeof currentSong.audio_url !== 'string') {
        console.error('Invalid audio URL format:', currentSong.audio_url);
        setIsPlaying(false);
        return;
      }

      const getAudioUrl = async () => {
        try {
          // Pre-load the audio to check if it's valid
          audio.src = currentSong.audio_url;
          audio.volume = volume / 100;
          
          if (isPlaying) {
            try {
              await audio.play();
            } catch (error) {
              console.error('Error playing audio:', error);
              setIsPlaying(false);
            }
          }
        } catch (error) {
          console.error('Error loading audio:', error instanceof Error ? error.message : 'Unknown error');
          setIsPlaying(false);
        }
      };

      getAudioUrl();
    }
  }, [currentSong]);

  useEffect(() => {
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e: Event) => {
      const error = e as ErrorEvent;
      console.error('Audio playback error:', error.message || 'Unknown error occurred');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const playSong = async (song: Song) => {
    if (!song.audio_url) {
      console.error('Song has no audio URL:', song);
      return;
    }

    if (currentSong?.id === song.id) {
      togglePlay();
      return;
    }

    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = async () => {
    if (!currentSong?.audio_url) {
      console.error('No audio source available');
      setIsPlaying(false);
      return;
    }

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      setIsPlaying(false);
    }
  };

  const toggleLikeSong = (songId: string) => {
    setLikedSongs((prev) => {
      let updated;
      if (prev.includes(songId)) {
        updated = prev.filter(id => id !== songId);
      } else {
        updated = [...prev, songId];
      }
      localStorage.setItem('likedSongs', JSON.stringify(updated));
      return updated;
    });
  };

  const isSongLiked = (songId: string) => likedSongs.includes(songId);

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songIds: []
    };
    setPlaylists(prev => {
      const updated = [...prev, newPlaylist];
      localStorage.setItem('playlists', JSON.stringify(updated));
      return updated;
    });
  };

  const removePlaylist = (playlistId: string) => {
    setPlaylists(prev => {
      const updated = prev.filter(p => p.id !== playlistId);
      localStorage.setItem('playlists', JSON.stringify(updated));
      return updated;
    });
  };

  const addSongToPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => {
      const updated = prev.map(p =>
        p.id === playlistId && !p.songIds.includes(songId)
          ? { ...p, songIds: [...p.songIds, songId] }
          : p
      );
      localStorage.setItem('playlists', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => {
      const updated = prev.map(p =>
        p.id === playlistId
          ? { ...p, songIds: p.songIds.filter(id => id !== songId) }
          : p
      );
      localStorage.setItem('playlists', JSON.stringify(updated));
      return updated;
    });
  };

  const skipForward = () => {
    if (!currentSong || songs.length === 0) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % songs.length;
    const nextSong = songs[nextIndex];
    playSong(nextSong);
  };

  const skipBackward = () => {
    if (!currentSong || songs.length === 0) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    if (currentIndex === -1) return;
    
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    const previousSong = songs[previousIndex];
    playSong(previousSong);
  };

  return (
    <PlayerContext.Provider value={{
      currentSong,
      isPlaying,
      volume,
      currentTime,
      duration,
      songs,
      playlists,
      playSong,
      togglePlay,
      setVolume,
      skipForward,
      skipBackward,
      setCurrentTime: (time) => {
        audio.currentTime = time;
        setCurrentTime(time);
      },
      likedSongs,
      toggleLikeSong,
      isSongLiked,
      createPlaylist,
      removePlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}