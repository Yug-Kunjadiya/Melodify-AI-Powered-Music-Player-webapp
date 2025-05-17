import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function Search() {
  const [query, setQuery] = useState('');
  const { songs, playSong, currentSong, isPlaying, toggleLikeSong, isSongLiked } = usePlayer();
  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [recentSearches] = useState(['Electronic', 'Jazz', 'Pop Hits 2024', 'Workout Mix']);

  useEffect(() => {
    if (query.trim()) {
      const filtered = songs.filter(
        song =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase()) ||
          song.album.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(songs);
    }
  }, [query, songs]);

  return (
    <div className="flex-1 overflow-auto p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {!query && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Recent Searches</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setQuery(search)}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors"
                >
                  <span className="font-medium">{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">
            {query ? 'Search Results' : 'All Songs'}
          </h2>
          <div className="bg-white/5 backdrop-blur-xl rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="py-4 px-4 text-left font-medium w-8">#</th>
                  <th className="py-4 px-4 text-left font-medium">Title</th>
                  <th className="py-4 px-4 text-left font-medium hidden md:table-cell">Album</th>
                  <th className="py-4 px-4 text-left font-medium w-20">Duration</th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">No results found.</td>
                  </tr>
                ) : (
                  filteredSongs.map((song, index) => (
                    <tr
                      key={song.id}
                      className="group hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => playSong(song)}
                    >
                      <td className="py-3 px-4">
                        <div className="relative w-4 h-4">
                          <span className="group-hover:hidden">{index + 1}</span>
                          <Play className="hidden group-hover:block h-4 w-4" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={song.cover_url}
                            alt={song.title}
                            className="w-10 h-10 rounded"
                          />
                          <div>
                            <div className="font-medium">{song.title}</div>
                            <div className="text-sm text-gray-400">{song.artist}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-gray-400">
                        {song.album}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={e => { e.stopPropagation(); toggleLikeSong(song.id); }}
                            aria-label={isSongLiked(song.id) ? 'Unlike' : 'Like'}
                          >
                            <Heart className={`h-4 w-4 ${isSongLiked(song.id) ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} fill={isSongLiked(song.id) ? 'currentColor' : 'none'} />
                          </button>
                          <span className="text-gray-400">{song.duration}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}