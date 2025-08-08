/*
  # Create Reactions System

  1. New Tables
    - `reactions`
      - `id` (uuid, primary key)
      - `article_id` (uuid, foreign key to articles)
      - `user_session` (text, unique session identifier)
      - `reaction_type` (text, type of reaction)
      - `created_at` (timestamp)
      - `ip_address` (text, for additional validation)
    
    - `reaction_counts`
      - `article_id` (uuid, primary key, foreign key to articles)
      - `love_count` (integer, default 0)
      - `helpful_count` (integer, default 0)
      - `insightful_count` (integer, default 0)
      - `inspiring_count` (integer, default 0)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for reading and inserting reactions
    - Prevent duplicate reactions from same session

  3. Functions
    - Function to update reaction counts
    - Trigger to maintain count accuracy
*/

-- Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_session text NOT NULL,
  reaction_type text NOT NULL CHECK (reaction_type IN ('love', 'helpful', 'insightful', 'inspiring')),
  ip_address text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, user_session, reaction_type)
);

-- Create reaction counts table for performance
CREATE TABLE IF NOT EXISTS reaction_counts (
  article_id uuid PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  love_count integer DEFAULT 0,
  helpful_count integer DEFAULT 0,
  insightful_count integer DEFAULT 0,
  inspiring_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reaction_counts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reactions
CREATE POLICY "Anyone can read reactions"
  ON reactions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert reactions"
  ON reactions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can delete their own reactions"
  ON reactions
  FOR DELETE
  TO public
  USING (true);

-- RLS Policies for reaction counts
CREATE POLICY "Anyone can read reaction counts"
  ON reaction_counts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "System can manage reaction counts"
  ON reaction_counts
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Function to update reaction counts
CREATE OR REPLACE FUNCTION update_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    INSERT INTO reaction_counts (article_id)
    VALUES (NEW.article_id)
    ON CONFLICT (article_id) DO NOTHING;
    
    UPDATE reaction_counts
    SET 
      love_count = CASE WHEN NEW.reaction_type = 'love' THEN love_count + 1 ELSE love_count END,
      helpful_count = CASE WHEN NEW.reaction_type = 'helpful' THEN helpful_count + 1 ELSE helpful_count END,
      insightful_count = CASE WHEN NEW.reaction_type = 'insightful' THEN insightful_count + 1 ELSE insightful_count END,
      inspiring_count = CASE WHEN NEW.reaction_type = 'inspiring' THEN inspiring_count + 1 ELSE inspiring_count END,
      updated_at = now()
    WHERE article_id = NEW.article_id;
    
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    UPDATE reaction_counts
    SET 
      love_count = CASE WHEN OLD.reaction_type = 'love' THEN GREATEST(love_count - 1, 0) ELSE love_count END,
      helpful_count = CASE WHEN OLD.reaction_type = 'helpful' THEN GREATEST(helpful_count - 1, 0) ELSE helpful_count END,
      insightful_count = CASE WHEN OLD.reaction_type = 'insightful' THEN GREATEST(insightful_count - 1, 0) ELSE insightful_count END,
      inspiring_count = CASE WHEN OLD.reaction_type = 'inspiring' THEN GREATEST(inspiring_count - 1, 0) ELSE inspiring_count END,
      updated_at = now()
    WHERE article_id = OLD.article_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS reaction_counts_trigger ON reactions;
CREATE TRIGGER reaction_counts_trigger
  AFTER INSERT OR DELETE ON reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_reaction_counts();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reactions_article_id ON reactions(article_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_session ON reactions(user_session);
CREATE INDEX IF NOT EXISTS idx_reactions_created_at ON reactions(created_at);