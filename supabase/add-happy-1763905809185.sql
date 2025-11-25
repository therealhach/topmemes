-- Add Happy Cat (HAPPY) token to the database
-- Generated on 2025-11-23T13:50:09.184Z

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
    'Happy Cat',
    'HAPPY',
    'HAPPYwgFcjEJDzRtfWE6tiHE9zGdzpNky2FvjPHsvvGZ',
    0,
    '3xguwbzq2pbpecygynrhespiokanfnnpvyhgpbfopxsz',
    NULL,
    'https://cdn.dexscreener.com/cms/images/5c5cd2ef298608a6fff9015aeeb7aa0078f8dfd096ef3d4a948cb12aa5a9b2bd?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
