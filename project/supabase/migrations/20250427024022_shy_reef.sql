/*
  # Test Supabase Connection

  This migration verifies that our connection to Supabase is working correctly
  by attempting to create a simple function.
*/

CREATE OR REPLACE FUNCTION test_connection()
RETURNS text AS $$
BEGIN
  RETURN 'Connection successful';
END;
$$ LANGUAGE plpgsql;