/*
  # Add UPI settings table

  1. New Tables
    - `upi_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `upi_id` (text)
      - `name` (text)
      - `is_default` (boolean)
      - `bank_name` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on upi_settings table
    - Add policy for authenticated users to manage their own UPI settings
*/

CREATE TABLE IF NOT EXISTS upi_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  upi_id text NOT NULL,
  name text NOT NULL,
  is_default boolean DEFAULT false,
  bank_name text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, upi_id)
);

-- Enable RLS
ALTER TABLE upi_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own UPI settings"
  ON upi_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to ensure only one default UPI setting per user
CREATE OR REPLACE FUNCTION update_default_upi_setting()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE upi_settings
    SET is_default = false
    WHERE user_id = NEW.user_id
    AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to manage default UPI settings
CREATE TRIGGER manage_default_upi_setting
  BEFORE INSERT OR UPDATE ON upi_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_default_upi_setting();