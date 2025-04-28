/*
  # Add Pinned Status to Integrations

  1. Changes
    - Add pinned column to integrations table (boolean)
    - Set default value to false
    - Update existing rows

  2. Security
    - Existing RLS policies remain unchanged
*/

ALTER TABLE integrations
ADD COLUMN IF NOT EXISTS pinned boolean DEFAULT false;

-- Update existing rows to have pinned = false
UPDATE integrations SET pinned = false WHERE pinned IS NULL;