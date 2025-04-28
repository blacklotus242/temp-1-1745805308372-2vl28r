/*
  # Insert Default Chat Prompts

  1. Changes
    - Insert 4 default system prompts into chat_prompts table
    - Set is_default to true for all prompts
    - Set user_id to NULL as these are system prompts

  2. Security
    - No changes to existing RLS policies
*/

-- First, clear any existing default prompts to avoid duplicates
DELETE FROM chat_prompts WHERE is_default = true;

-- Insert new default prompts
INSERT INTO chat_prompts (title, emoji, system_prompt, is_default, created_at, updated_at) VALUES
  (
    'General Chat',
    '🤖',
    'You are a helpful AI assistant ready to assist with any task.',
    true,
    now(),
    now()
  ),
  (
    'Cosmic Coach',
    '🌟',
    'You are a wise, motivating cosmic guide helping the user grow.',
    true,
    now(),
    now()
  ),
  (
    'Business Strategist',
    '📈',
    'You are a focused business expert helping users build and optimize businesses.',
    true,
    now(),
    now()
  ),
  (
    'Creative Brainstormer',
    '🎨',
    'You are an inspiring creative mind ready to generate ideas for writing, projects, and design.',
    true,
    now(),
    now()
  );