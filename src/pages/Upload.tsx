import React, { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [duration, setDuration] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile || !audioFile) {
      setError('Please select both cover image and audio file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Upload cover image
      const coverPath = `covers/${Date.now()}-${coverFile.name}`;
      const { error: coverError } = await supabase.storage
        .from('songs')
        .upload(coverPath, coverFile);

      if (coverError) throw coverError;

      // Get cover URL
      const { data: coverData } = supabase.storage
        .from('songs')
        .getPublicUrl(coverPath);

      // Upload audio file
      const audioPath = `audio/${Date.now()}-${audioFile.name}`;
      const { error: audioError } = await supabase.storage
        .from('songs')
        .upload(audioPath, audioFile);

      if (audioError) throw audioError;

      // Get audio URL
      const { data: audioData } = supabase.storage
        .from('songs')
        .getPublicUrl(audioPath);

      // Insert song record
      const { error: dbError } = await supabase
        .from('songs')
        .insert({
          title,
          artist,
          album,
          duration,
          cover_url: coverData.publicUrl,
          audio_url: audioData.publicUrl
        });

      if (dbError) throw dbError;

      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload song');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-8 pb-32">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <UploadIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Upload Song</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Artist
              </label>
              <input
                type="text"
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Album
              </label>
              <input
                type="text"
                required
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (e.g., 3:45)
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                pattern="^\d+:\d{2}$"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Audio File
              </label>
              <input
                type="file"
                accept="audio/*"
                required
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className={`w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? 'Uploading...' : 'Upload Song'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}