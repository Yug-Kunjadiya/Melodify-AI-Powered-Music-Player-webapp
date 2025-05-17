import React, { useState } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, 
  Volume2, Shuffle, Repeat, Heart,
  Search as SearchIcon, Home as HomeIcon, Library as LibraryIcon, PlusSquare,
  Menu, ArrowLeft, VolumeX, Volume1, Brain, X, Upload as UploadIcon, Smile
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { usePlayer } from './context/PlayerContext';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Home from './pages/Home';
import Library from './pages/Library';
import Upload from './pages/Upload';
import FaceDetection from './lib/FaceDetection';
import { getRandomSongForEmotion } from './lib/emotionToSong';
import { supabase } from './lib/supabaseClient';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [playlists, setPlaylists] = useState<{ name: string; songs: number }[]>([]);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [suggestedSong, setSuggestedSong] = useState<{ title: string; artist: string } | null>(null);

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim()) {
      try {
        const { data: playlist, error } = await supabase
          .from('playlists')
          .insert({ name: newPlaylistName })
          .select()
          .single();

        if (error) throw error;

        setPlaylists([...playlists, { name: playlist.name, songs: 0 }]);
        setNewPlaylistName('');
        setIsCreatingPlaylist(false);
      } catch (err) {
        console.error('Error creating playlist:', err);
      }
    }
  };

  const handleEmotionDetected = (emotion: string) => {
    setCurrentEmotion(emotion);
    const song = getRandomSongForEmotion(emotion);
    setSuggestedSong(song);
  };

  return (
    <div className="w-64 bg-black/30 backdrop-blur-xl p-6 flex flex-col gap-8 h-full">
      <div className="flex items-center gap-2">
        {location.pathname !== '/' && (
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Menu className="h-8 w-8" />
          <span>Melodify</span>
        </div>
      </div>

      <nav className="flex flex-col gap-4">
        <Link
          to="/"
          className={`flex items-center gap-3 ${
            location.pathname === '/' ? 'text-white' : 'text-gray-300'
          } hover:text-white transition-colors`}
        >
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          to="/search"
          className={`flex items-center gap-3 ${
            location.pathname === '/search' ? 'text-white' : 'text-gray-300'
          } hover:text-white transition-colors`}
        >
          <SearchIcon className="h-5 w-5" />
          <span>Search</span>
        </Link>
        <Link
          to="/library"
          className={`flex items-center gap-3 ${
            location.pathname === '/library' ? 'text-white' : 'text-gray-300'
          } hover:text-white transition-colors`}
        >
          <LibraryIcon className="h-5 w-5" />
          <span>Your Library</span>
        </Link>
        <Link
          to="/upload"
          className={`flex items-center gap-3 ${
            location.pathname === '/upload' ? 'text-white' : 'text-gray-300'
          } hover:text-white transition-colors`}
        >
          <UploadIcon className="h-5 w-5" />
          <span>Upload Song</span>
        </Link>
      </nav>

      <div className="mt-4">
        <button
          onClick={() => setShowCamera(!showCamera)}
          className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
            showCamera ? 'bg-purple-500/20 text-purple-500' : 'text-gray-300 hover:bg-white/10'
          }`}
        >
          <Smile className="w-5 h-5" />
          <span>Mood Detection</span>
        </button>

        {showCamera && (
          <div className="mt-4 p-4 bg-black/50 rounded-lg">
            <FaceDetection onEmotionDetected={handleEmotionDetected} />
            {currentEmotion && (
              <div className="mt-4 text-white">
                <p className="text-sm text-gray-400">Current Mood:</p>
                <p className="text-lg font-semibold capitalize">{currentEmotion}</p>
                {suggestedSong && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Suggested Song:</p>
                    <p className="text-lg font-semibold">{suggestedSong.title}</p>
                    <p className="text-sm text-gray-300">{suggestedSong.artist}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
{/* 
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold">Your Playlists</span>
          <button
            onClick={() => setIsCreatingPlaylist(true)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <PlusSquare className="h-5 w-5" />
          </button>
        </div>
        {isCreatingPlaylist && (
          <div className="mb-4">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name"
              className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreatePlaylist();
                } else if (e.key === 'Escape') {
                  setIsCreatingPlaylist(false);
                  setNewPlaylistName('');
                }
              }}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCreatePlaylist}
                className="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 rounded transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreatingPlaylist(false);
                  setNewPlaylistName('');
                }}
                className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {playlists.map((playlist) => (
            <div key={playlist.name} className="group cursor-pointer">
              <div className="flex items-center justify-between text-gray-400 group-hover:text-white transition-colors">
                <span>{playlist.name}</span>
                <span className="text-sm">{playlist.songs} songs</span>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      <button
        onClick={logout}
        className="mt-auto text-gray-400 hover:text-white transition-colors text-sm"
      >
        Sign Out
      </button>
    </div>
  );
}

function PlayerBar() {
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    currentTime, 
    duration,
    togglePlay,
    setVolume,
    setCurrentTime,
    skipForward,
    skipBackward
  } = usePlayer();
  const [isLiked, setIsLiked] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-64 right-0 bg-black/80 backdrop-blur-xl p-4 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={currentSong.cover_url} alt={currentSong.title} className="w-14 h-14 rounded" />
          <div>
            <h4 className="font-semibold">{currentSong.title}</h4>
            <p className="text-sm text-gray-400">{currentSong.artist}</p>
          </div>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`ml-4 transition-colors ${isLiked ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
          <div className="flex items-center gap-6">
            <Shuffle className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            <button
              onClick={skipBackward}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack className="h-6 w-6" />
            </button>
            <button 
              className={`rounded-full p-2 transition-all ${isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-white hover:bg-gray-200'}`}
              onClick={togglePlay}
            >
              {isPlaying ? 
                <Pause className={`h-6 w-6 ${isPlaying ? 'text-white' : 'text-black'}`} /> : 
                <Play className={`h-6 w-6 ${isPlaying ? 'text-white' : 'text-black'}`} />
              }
            </button>
            <button
              onClick={skipForward}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="h-6 w-6" />
            </button>
            <Repeat className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-gray-600 rounded-full relative group">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleTimeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="h-full bg-white rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100" />
              </div>
            </div>
            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {volume === 0 ? (
            <VolumeX className="h-5 w-5" />
          ) : volume < 50 ? (
            <Volume1 className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
          <div className="w-24 h-1 bg-gray-600 rounded-full relative group">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="h-full bg-white rounded-full relative"
              style={{ width: `${volume}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MusicPlayer() {
  const { currentSong } = usePlayer();
  
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white flex">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
        {currentSong && <PlayerBar />}
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={isAuthenticated ? <MusicPlayer /> : <Login />}
      />
    </Routes>
  );
}

export default App;