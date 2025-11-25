-- Create swaps table to store user swap data
CREATE TABLE swaps (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  wallet_address TEXT NOT NULL,
  payment_currency TEXT NOT NULL,
  swap_amount DECIMAL NOT NULL,
  token_address TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  token_amount DECIMAL NOT NULL,
  token_price DECIMAL NOT NULL,
  fee_amount DECIMAL NOT NULL,
  tx_signature TEXT NOT NULL,
  swap_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted'
);

-- Migration: Add status column to existing table
-- ALTER TABLE swaps ADD COLUMN status TEXT NOT NULL DEFAULT 'submitted';

-- Create indexes for faster queries
CREATE INDEX idx_swaps_wallet ON swaps(wallet_address);
CREATE INDEX idx_swaps_created_at ON swaps(created_at);
CREATE INDEX idx_swaps_token_address ON swaps(token_address);
CREATE INDEX idx_swaps_tx_signature ON swaps(tx_signature);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE swaps ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts from anyone (for storing swaps)
CREATE POLICY "Allow insert for all" ON swaps
  FOR INSERT
  WITH CHECK (true);

-- Policy to allow reads (adjust based on your needs)
CREATE POLICY "Allow read for all" ON swaps
  FOR SELECT
  USING (true);
