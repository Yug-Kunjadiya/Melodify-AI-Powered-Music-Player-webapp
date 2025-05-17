import React, { useState } from 'react';
import { Play, Heart, Smile } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  isLiked?: boolean;
}

const moods = [
  { name: 'Happy', icon: Smile, color: 'from-yellow-500 to-orange-500' },
  { name: 'Sad', icon: Smile, color: 'from-blue-500 to-purple-500' },
  { name: 'Party', icon: Smile, color: 'from-pink-500 to-red-500' },
  { name: 'Focus', icon: Smile, color: 'from-green-500 to-teal-500' },
  { name: 'Chill', icon: Smile, color: 'from-indigo-500 to-purple-500' }
];

const mockLikedSongs: Song[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Eclipse',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
    isLiked: true
  },
  {
    id: '2',
    title: 'Summer Breeze',
    artist: 'Ocean Waves',
    cover: 'https://images.unsplash.com/photo-1616356607338-fd87169ecf1a?w=300&h=300&fit=crop',
    isLiked: true
  }
];

const moodBasedSongs: Record<string, Song[]> = {
  'Happy': [
    {
      id: '3',
      title: 'Dancing in the Sun',
      artist: 'Joy Riders',
      cover: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=300&h=300&fit=crop'
    },
    {
      id: '4',
      title: 'Bright Day',
      artist: 'Sunshine Band',
      cover: 'https://images.unsplash.com/photo-1530982011887-3cc11cc85693?w=300&h=300&fit=crop'
    }
  ],
  'Sad': [
    {
      id: '5',
      title: 'Rainy Days',
      artist: 'Blue Notes',
      cover: 'https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?w=300&h=300&fit=crop'
    }
  ],
  'Party': [
    {
      id: '6',
      title: 'Night Fever',
      artist: 'Electric Dreams',
      cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop'
    }
  ],
  'Focus': [
    {
      id: '7',
      title: 'Deep Concentration',
      artist: 'Mind Flow',
      cover: 'https://images.unsplash.com/photo-1516916759473-600c07bc12d4?w=300&h=300&fit=crop'
    }
  ],
  'Chill': [
    {
      id: '8',
      title: 'Sunset Vibes',
      artist: 'Chill Wave',
      cover: 'https://images.unsplash.com/photo-1515266591878-f93e32bc5937?w=300&h=300&fit=crop'
    }
  ]
};

export default function Library() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [view, setView] = useState<'liked' | 'playlists' | 'ai'>('liked');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(null);
  const { songs, likedSongs, playSong, playlists, createPlaylist, removePlaylist } = usePlayer();

  const suggestedSongs = selectedMood ? moodBasedSongs[selectedMood] : [];
  const likedSongList = songs.filter(song => likedSongs.includes(song.id));

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={() => setView('liked')}
            className={`px-4 py-2 rounded-full ${
              view === 'liked'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 hover:bg-white/10'
            } transition-colors`}
          >
            Liked Songs
          </button>
          <button
            onClick={() => setView('playlists')}
            className={`px-4 py-2 rounded-full ${
              view === 'playlists'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 hover:bg-white/10'
            } transition-colors`}
          >
            Your Playlists
          </button>
          <button
            onClick={() => setView('ai')}
            className={`px-4 py-2 rounded-full ${
              view === 'ai'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 hover:bg-white/10'
            } transition-colors`}
          >
            AI Suggestions
          </button>
        </div>

        {view === 'liked' && (
          <>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart className="h-6 w-6 fill-purple-500 text-purple-500" />
              Liked Songs
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {likedSongList.length === 0 ? (
                <p className="text-gray-400 col-span-full">No liked songs yet.</p>
              ) : (
                likedSongList.map((song) => (
                  <div
                    key={song.id}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer group"
                    onClick={() => playSong(song)}
                  >
                    <img
                      src={song.cover_url}
                      alt={song.title}
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold">{song.title}</h3>
                    <p className="text-gray-400">{song.artist}</p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="mt-4 bg-green-500 rounded-full p-3 hover:bg-green-400 transition-colors">
                        <Play className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {view === 'playlists' && (
          <>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Play className="h-6 w-6" />
              Your Playlists
            </h2>
            <form onSubmit={handleCreatePlaylist} className="mb-6 flex gap-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                placeholder="New playlist name"
                className="px-4 py-2 rounded-lg bg-white/10 text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                Create
              </button>
            </form>
            {playlists.length === 0 ? (
              <p className="text-gray-400">No playlists yet. Create one above!</p>
            ) : (
              <div className="space-y-6">
                {playlists.map(playlist => (
                  <div key={playlist.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{playlist.name}</h3>
                      <button
                        className="text-red-400 hover:text-red-600 text-sm"
                        onClick={() => removePlaylist(playlist.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <button
                      className="text-purple-400 hover:underline text-sm mb-2"
                      onClick={() => setExpandedPlaylistId(expandedPlaylistId === playlist.id ? null : playlist.id)}
                    >
                      {expandedPlaylistId === playlist.id ? 'Hide Songs' : 'Show Songs'}
                    </button>
                    {expandedPlaylistId === playlist.id && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                        {playlist.songIds.length === 0 ? (
                          <p className="text-gray-400 col-span-full">No songs in this playlist.</p>
                        ) : (
                          playlist.songIds.map(songId => {
                            const song = songs.find(s => s.id === songId);
                            if (!song) return null;
                            return (
                              <div
                                key={song.id}
                                className="bg-white/10 rounded-lg p-3 cursor-pointer group"
                                onClick={() => playSong(song)}
                              >
                                <img
                                  src={song.cover_url}
                                  alt={song.title}
                                  className="w-full aspect-square object-cover rounded mb-2"
                                />
                                <h4 className="font-semibold truncate">{song.title}</h4>
                                <p className="text-gray-400 truncate text-sm">{song.artist}</p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === 'ai' && (
          <>
            <h2 className="text-2xl font-bold mb-6">AI Mood Suggestions</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
              {moods.map((mood) => {
                const Icon = mood.icon;
                return (
                  <button
                    key={mood.name}
                    onClick={() => setSelectedMood(mood.name)}
                    className={`p-4 rounded-xl bg-gradient-to-br ${
                      mood.color
                    } hover:opacity-90 transition-opacity ${
                      selectedMood === mood.name ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    <Icon className="h-8 w-8 mb-2 mx-auto" />
                    <span className="block text-center font-medium">
                      {mood.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedMood && (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  Suggested for {selectedMood} mood
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {suggestedSongs.map((song) => (
                    <div
                      key={song.id}
                      className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-full aspect-square object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold">{song.title}</h3>
                      <p className="text-gray-400">{song.artist}</p>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="mt-4 bg-green-500 rounded-full p-3 hover:bg-green-400 transition-colors">
                          <Play className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}