/*
  # Enhance Tasks Table

  1. Changes
    - Add priority column (text)
    - Add category column (text)
    - Add tags column (text array)
    - Update status check constraint
    - Add priority check constraint

  2. Security
    - Existing RLS policies remain unchanged
*/

ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS tags text[];

-- Update existing status check constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
  CHECK (status IN ('pending', 'in_progress', 'completed', 'archived'));