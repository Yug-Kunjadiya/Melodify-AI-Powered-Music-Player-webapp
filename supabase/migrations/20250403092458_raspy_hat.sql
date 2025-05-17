/*
  # Create songs table and add initial data

  1. New Tables
    - `songs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `artist` (text)
      - `album` (text)
      - `duration` (text)
      - `cover_url` (text)
      - `audio_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `songs` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  album text NOT NULL,
  duration text NOT NULL,
  cover_url text NOT NULL,
  audio_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON songs
  FOR SELECT
  TO public
  USING (true);

-- Insert sample songs
INSERT INTO songs (title, artist, album, duration, cover_url, audio_url) VALUES
  (
    'Shayad',
    'Arijit Singh',
    'Shayads',
    '3:10',
    'https://i.ytimg.com/vi/MJyKN-8UncM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAHh4gaQYAtX7hBrpUbqICV7mPSdA',
    'https://izexnxqajwzmqesrgvak.supabase.co/storage/v1/object/public/songs/Shayad.mp3'
  ),
  (
    'Summer Breeze',
    'Ocean Waves',
    'Coastal Memories',
    '4:20',
    'https://images.unsplash.com/photo-1616356607338-fd87169ecf1a?w=300&h=300&fit=crop',
    'https://izexnxqajwzmqesrgvak.supabase.co/storage/v1/object/public/songs/summer-breeze.mp3'
  ),
  (
    'Urban Jungle',
    'City Lights',
    'Metropolitan',
    '3:55',
    'https://images.unsplash.com/photo-1671726203638-83742a2721a1?w=300&h=300&fit=crop',
    'https://izexnxqajwzmqesrgvak.supabase.co/storage/v1/object/public/songs/urban-jungle.mp3'
  ),
  (
    'Neon Nights',
    'Cyber Dreams',
    'Digital Age',
    '4:15',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=300&fit=crop',
    'https://izexnxqajwzmqesrgvak.supabase.co/storage/v1/object/public/songs/neon-nights.mp3'
  ),
  (
    'Dancing in the Sun',
    'Joy Riders',
    'Summer Vibes',
    '3:30',
    'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=300&h=300&fit=crop',
    'https://izexnxqajwzmqesrgvak.supabase.co/storage/v1/object/public/songs/dancing-in-the-sun.mp3'
  );