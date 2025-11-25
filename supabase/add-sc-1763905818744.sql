-- Add Shark Cat (SC) token to the database
-- Generated on 2025-11-23T13:50:18.743Z

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
    'Shark Cat',
    'SC',
    '6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui',
    0,
    'bszedbevwrqvksaf558eppwcm16avepyhm2hgsq9wzyy',
    NULL,
    'https://cdn.dexscreener.com/cms/images/9dff2b73980785dd7de7d5a8b65afdab5cfdf022da24b72ff1a1beebcdbd8ac8?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
