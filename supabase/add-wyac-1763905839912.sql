-- Add WOMAN YELLING AT CAT (WYAC) token to the database
-- Generated on 2025-11-23T13:50:39.911Z

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
    'WOMAN YELLING AT CAT',
    'WYAC',
    'BEgBsVSKJSxreiCE1XmWWq8arnwit7xDqQXSWYgay9xP',
    0,
    '9uutkg2u657epumxsqpx3zvw2ltraejnbvc5u61tknmb',
    NULL,
    'https://cdn.dexscreener.com/cms/images/3d314195c7699da40e0fd144f4725368abd675273f2591e70b7c65ed885446f3?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
