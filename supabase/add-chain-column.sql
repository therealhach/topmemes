-- Add chain column to existing tokens table
ALTER TABLE public.tokens ADD COLUMN IF NOT EXISTS chain TEXT DEFAULT 'solana';

-- Update all existing tokens to 'solana' (in case any are NULL)
UPDATE public.tokens SET chain = 'solana' WHERE chain IS NULL;
