-- Add Pepe (PEPE) token to the database
-- Generated on 2025-11-25T10:45:12.700Z
-- Chain: ethereum
-- Category: others

-- Fix the sequence for the ID column (prevents duplicate key errors)
SELECT setval('tokens_id_seq', (SELECT MAX(id) FROM tokens));

INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url,
    category,
    chain
) VALUES (
    'Pepe',
    'PEPE',
    '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
    0,
    '0xa43fe16908251ee70ef74718545e4fe6c5ccec9f',
    NULL,
    'https://cdn.dexscreener.com/cms/images/ae001139fa1fcd24f8421d82caf72d8e06fabafab33b089c5d2e6d18039354e7?width=800&height=800&quality=90',
    'others',
    'ethereum'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category,
    chain = EXCLUDED.chain;
