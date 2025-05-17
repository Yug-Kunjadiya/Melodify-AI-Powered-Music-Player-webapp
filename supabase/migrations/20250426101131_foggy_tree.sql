/*
  # Create playlists and user_songs tables

  1. New Tables
    - `playlists`
      - `id` (uuid, primary key)
      - `name` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
    
    - `playlist_songs`
      - `playlist_id` (uuid, references playlists)
      - `song_id` (uuid, references songs)
      - `added_at` (timestamp)
      - Primary key is (playlist_id, song_id)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their playlists
*/

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create playlist_songs table
CREATE TABLE IF NOT EXISTS playlist_songs (
  playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE,
  song_id uuid REFERENCES songs(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (playlist_id, song_id)
);

-- Enable RLS
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- Policies for playlists
CREATE POLICY "Users can create their own playlists"
  ON playlists
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own playlists"
  ON playlists
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists"
  ON playlists
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists"
  ON playlists
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for playlist_songs
CREATE POLICY "Users can add songs to their playlists"
  ON playlist_songs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE id = playlist_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view songs in their playlists"
  ON playlist_songs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE id = playlist_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove songs from their playlists"
  ON playlist_songs
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE id = playlist_id
      AND user_id = auth.uid()
    )
  );