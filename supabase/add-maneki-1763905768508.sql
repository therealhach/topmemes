-- Add MANEKI (MANEKI) token to the database
-- Generated on 2025-11-23T13:49:28.507Z

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
    'MANEKI',
    'MANEKI',
    '25hAyBQfoDhfWx9ay6rarbgvWGwDdNqcHsXS3jQ3mTDJ',
    0,
    '2apssvxfw6dgrqwwukfwujn6wvoyxuhjjapzyajvgddr',
    NULL,
    'https://cdn.dexscreener.com/cms/images/2d1e97e69f64c1e77db437f9a93a756f645d100ac2c8d2ae7efa244ab5b75351?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
