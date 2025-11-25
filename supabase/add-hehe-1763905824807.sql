-- Add hehe (hehe) token to the database
-- Generated on 2025-11-23T13:50:24.806Z

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
    'hehe',
    'hehe',
    'BreuhVohXX5fv6q41uyb3sojtAuGoGaiAhKBMtcrpump',
    0,
    '23kjarate7xthaq7c5xbjjyk5cyg1sna2ikcpsiacbvp',
    NULL,
    'https://cdn.dexscreener.com/cms/images/480c061a9f99598e9dacaa96d1585bdcaeacc0eb9684b7cde4b55e966ce1cfbd?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
