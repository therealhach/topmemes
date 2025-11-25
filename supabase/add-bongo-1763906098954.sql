-- Add Bongo Cat (BONGO) token to the database
-- Generated on 2025-11-23T13:54:58.953Z

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
    'Bongo Cat',
    'BONGO',
    'HUdqc5MR5h3FssESabPnQ1GTgTcPvnNudAuLj5J6a9sU',
    0,
    '4rm63uqsnpqfhqczgkeamhpg7ree72y9q9r59chmj1hb',
    NULL,
    'https://cdn.dexscreener.com/cms/images/2c508485a7089256570374d5857fe15c6266160a3d77b95c30108bad2295fe5e?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
