-- Add multiple tokens to the database
-- Generated on 2025-11-23T14:04:47.561Z
-- Total tokens: 1

-- Fix the sequence for the ID column (prevents duplicate key errors)
SELECT setval('tokens_id_seq', (SELECT MAX(id) FROM tokens));


-- nubcat (nub)
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
    '83g6vzjzlrcnhbslatj94vcprimyyqwun6zfl11mcadl',
    NULL,
    'https://cdn.dexscreener.com/cms/images/7490db4cfcde6a4f27c602fb698ff8c09bef149e2aca1bb2dcf6651984ee52c5?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
