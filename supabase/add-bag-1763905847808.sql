-- Add catwifbag (BAG) token to the database
-- Generated on 2025-11-23T13:50:47.807Z

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
    'catwifbag',
    'BAG',
    'D8r8XTuCrUhLheWeGXSwC3G92RhASficV3YA7B2XWcLv',
    0,
    'bv7mm5twlxsukrrrwzec6tfaj22gadvcch5viazfnzc',
    NULL,
    'https://cdn.dexscreener.com/cms/images/235620f2b8eccbee012692d51c20645fe22acd0da26dc7cc5a3ec7fc14e3ca96?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
