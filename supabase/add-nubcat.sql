-- Fix the sequence for the ID column (run this first if you get duplicate key errors)
SELECT setval('tokens_id_seq', (SELECT MAX(id) FROM tokens));

-- Add nubcat token to the database
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'nubcat',
    'nub',
    'GtDZKAqvMZMnti46ZewMiXCa4oXF4bZxwQPoKzXPFxZn',
    0,
    '83G6VzJzLRCnHBsLATj94VCpRimyyqwuN6ZfL11McADL',
    NULL,
    'https://dd.dexscreener.com/ds-data/tokens/solana/GtDZKAqvMZMnti46ZewMiXCa4oXF4bZxwQPoKzXPFxZn.png'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
