-- Add Nigga Butt Token (NiggaButt) token to the database
-- Generated on 2025-11-23T23:02:46.996Z

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
    'Nigga Butt Token',
    'NiggaButt',
    '8fZL148nnC168RAVCZh4PkjvMZmxMEfMLDhoziWVPnqf',
    0,
    'bcdfb7vnroy57exbxaybnyl9thsvimu1umow1acxccfv',
    NULL,
    'https://cdn.dexscreener.com/cms/images/756ed77faee9140685be6749b00021e1c0049f51ecc843a64d6aae3e84ec492e?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
