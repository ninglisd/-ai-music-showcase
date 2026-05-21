-- Schema for AI Music Showcase
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Songs table
CREATE TABLE songs (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT NOT NULL,
  artist     TEXT NOT NULL,
  genre      TEXT NOT NULL,
  duration   INTEGER NOT NULL,
  audio_path TEXT NOT NULL,
  cover      TEXT NOT NULL DEFAULT 'from-violet-600 via-purple-500 to-cyan-400',
  color      TEXT NOT NULL DEFAULT '#5c66f6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lyrics table
CREATE TABLE lyrics (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id    UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  time       INTEGER NOT NULL,
  text       TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX lyrics_song_id_idx ON lyrics(song_id);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER songs_updated_at
  BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS — enable on both tables
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lyrics ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "songs_public_read" ON songs FOR SELECT USING (true);
CREATE POLICY "lyrics_public_read" ON lyrics FOR SELECT USING (true);

-- Storage bucket
-- Create via Supabase Dashboard: Storage → New Bucket → name "music", Public bucket = ON
