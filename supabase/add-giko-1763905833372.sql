-- Add Giko Cat (GIKO) token to the database
-- Generated on 2025-11-23T13:50:33.372Z

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
    'Giko Cat',
    'GIKO',
    '3WPep4ufaToK1aS5s8BL9inzeUrt4DYaQCiic6ZkkC1U',
    0,
    'a1wy7bbm3vanbtfg9sqsxmyjpf17t3y1ugwlmd35nkxz',
    NULL,
    'https://cdn.dexscreener.com/cms/images/24c55931003f9ba0809052d9d2da26b6018200ec5efc576a6d16eef68646e43c?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
