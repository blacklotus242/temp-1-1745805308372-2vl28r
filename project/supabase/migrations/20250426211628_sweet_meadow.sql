/*
  # Expand Integration Services

  1. Changes
    - Update integrations_service_check constraint to include more services
    - Add new services: notion, gmail, google_drive, shopify, slack, trello, docusign, twitter, facebook, gcp

  2. Security
    - Existing RLS policies remain unchanged
*/

-- Drop existing constraint
ALTER TABLE integrations DROP CONSTRAINT IF EXISTS integrations_service_check;

-- Add new constraint with expanded service list
ALTER TABLE integrations ADD CONSTRAINT integrations_service_check 
  CHECK (service IN (
    'google_calendar',
    'asana',
    'genius_scan',
    'mileiq',
    'notion',
    'gmail',
    'google_drive',
    'shopify',
    'slack',
    'trello',
    'docusign',
    'twitter',
    'facebook',
    'gcp'
  ));