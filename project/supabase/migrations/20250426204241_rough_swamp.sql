/*
  # Add Subtasks Support

  1. New Tables
    - `subtasks`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks.id)
      - `title` (text)
      - `is_complete` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `subtasks` table
    - Add policy for users to manage their own subtasks
    - Cascade delete when parent task is deleted

  3. Changes
    - Add foreign key constraint to link subtasks to tasks
    - Add automatic timestamp update trigger
*/

-- Create subtasks table
CREATE TABLE IF NOT EXISTS subtasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title text NOT NULL,
  is_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own subtasks
CREATE POLICY "Users can manage their own subtasks"
  ON subtasks
  FOR ALL
  TO authenticated
  USING (
    task_id IN (
      SELECT id FROM tasks WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    task_id IN (
      SELECT id FROM tasks WHERE user_id = auth.uid()
    )
  );

-- Create function to handle timestamp updates
CREATE OR REPLACE FUNCTION handle_subtask_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER subtask_updated
  BEFORE UPDATE ON subtasks
  FOR EACH ROW
  EXECUTE FUNCTION handle_subtask_update();