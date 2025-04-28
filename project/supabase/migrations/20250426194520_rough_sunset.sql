/*
  # Add INSERT policy for profiles table

  1. Security Changes
    - Add INSERT policy to profiles table to allow new users to create their profile
    - Policy ensures users can only create their own profile (id matches auth.uid())

  Note: Existing SELECT and UPDATE policies are already correct and remain unchanged
*/

CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);