import React, { useState } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function Home() {
  const { songs, playSong, currentSong, isPlaying, toggleLikeSong, isSongLiked, playlists, addSongToPlaylist } = usePlayer();
  const [playlistMenuOpen, setPlaylistMenuOpen] = useState<string | null>(null);

  return (
    <div className="p-8 pb-32">
      <div>
        <h1 className="text-3xl font-bold mb-6">All Songs</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {songs.map((song) => (
            <div 
              key={song.id} 
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer group relative"
              onClick={() => playSong(song)}
            >
              <div className="relative">
                <img 
                  src={song.cover_url} 
                  alt={song.title} 
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                <div className={`absolute bottom-4 right-4 ${
                  currentSong?.id === song.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity`}>
                  <button className="bg-green-500 rounded-full p-3 hover:bg-green-400 transition-colors">
                    {currentSong?.id === song.id && isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </button>
                </div>
                <button
                  className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-pink-200 transition-colors z-10"
                  onClick={e => { e.stopPropagation(); toggleLikeSong(song.id); }}
                  aria-label={isSongLiked(song.id) ? 'Unlike' : 'Like'}
                >
                  <Heart className={`h-5 w-5 ${isSongLiked(song.id) ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} fill={isSongLiked(song.id) ? 'currentColor' : 'none'} />
                </button>
                <div className="absolute top-4 left-4 z-10">
                  <button
                    className="bg-white/80 rounded-full p-2 hover:bg-blue-200 transition-colors text-blue-500 font-bold text-lg"
                    onClick={e => { e.stopPropagation(); setPlaylistMenuOpen(playlistMenuOpen === song.id ? null : song.id); }}
                    aria-label="Add to Playlist"
                  >
                    +
                  </button>
                  {playlistMenuOpen === song.id && (
                    <div className="absolute left-0 mt-2 bg-white rounded shadow-lg p-2 w-40">
                      {playlists.length === 0 ? (
                        <div className="text-gray-400 text-sm">No playlists</div>
                      ) : (
                        playlists.map(playlist => (
                          <button
                            key={playlist.id}
                            className="block w-full text-left px-2 py-1 hover:bg-blue-100 rounded text-sm text-gray-800"
                            onClick={e => {
                              e.stopPropagation();
                              addSongToPlaylist(playlist.id, song.id);
                              setPlaylistMenuOpen(null);
                            }}
                          >
                            {playlist.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-semibold truncate">{song.title}</h3>
              <p className="text-gray-400 truncate">{song.artist}</p>
              <p className="text-sm text-gray-500 mt-1">{song.album}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}