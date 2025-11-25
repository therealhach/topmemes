-- Add harold (harold) token to the database
-- Generated on 2025-11-23T14:25:26.158Z

-- Fix the sequence for the ID column (prevents duplicate key errors)
SELECT setval('tokens_id_seq', (SELECT MAX(id) FROM tokens));

INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'harold',
    'harold',
    'EjmDTt8G3T725eFSV7oWmGD8J848guo3LZ1EB3RfwGSw',
    0,
    '5wuxqapq7ezfoo2z6ql3svxa9djroxqk2fsafurnwvqy',
    NULL,
    'https://cdn.dexscreener.com/cms/images/aa0631678bcb4f68e52ad9fad6fbe778a9731cd6925349fd18f41253aa428f1f?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
