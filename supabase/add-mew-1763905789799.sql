-- Add cat in a dogs world (MEW) token to the database
-- Generated on 2025-11-23T13:49:49.799Z

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
    'cat in a dogs world',
    'MEW',
    'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',
    0,
    '879f697iudjgmevrkrcnw21fcxiaeljk1ffsw2atebce',
    NULL,
    'https://cdn.dexscreener.com/cms/images/33effe52dd5b1f6574ca5baaca9c02fecdecb557607a2a72889ceb0537eae9be?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
