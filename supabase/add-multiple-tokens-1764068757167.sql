-- Add multiple tokens to the database
-- Generated on 2025-11-25T11:05:57.167Z
-- Total tokens: 9
-- Categories: ai: 1, others: 8

-- Fix the sequence for the ID column (prevents duplicate key errors)
SELECT setval('tokens_id_seq', (SELECT MAX(id) FROM tokens));


-- GROK (GROK) [ai] [ethereum]
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
    'GROK',
    'GROK',
    '0x8390a1DA07E376ef7aDd4Be859BA74Fb83aA02D5',
    0,
    '0x69c66beafb06674db41b22cfc50c34a93b8d82a2',
    NULL,
    'https://cdn.dexscreener.com/cms/images/24dd624d8ef7d806ed567d42ec85521ec0e1f74d9ebd07451de41eb27a4a613e?width=800&height=800&quality=90',
    'ai',
    'ethereum'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category,
    chain = EXCLUDED.chain;


-- 4CHAN (4CHAN) [others] [ethereum]
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
    '4CHAN',
    '4CHAN',
    '0xe0A458BF4AcF353cB45e211281A334BB1d837885',
    0,
    '0x4ff4c7c8754127cc097910cf9d80400adef5b65d',
    NULL,
    'https://cdn.dexscreener.com/cms/images/f744c798e2e80a7dba8dbfb84424876b474ebe84133aaaa1b3349439f612f2d6?width=800&height=800&quality=90',
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


-- MAGA (TRUMP) [others] [ethereum]
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
    'MAGA',
    'TRUMP',
    '0x576e2BeD8F7b46D34016198911Cdf9886f78bea7',
    0,
    '0xe4b8583ccb95b25737c016ac88e539d0605949e8',
    NULL,
    'https://cdn.dexscreener.com/cms/images/2046e1431e361ca570d55ef30f7f4bbac979ca9704e1d38d1c61617f43187f25?width=800&height=800&quality=90',
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


-- The Balkan Dwarf (Kekec) [others] [ethereum]
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
    'The Balkan Dwarf',
    'Kekec',
    '0x8C7AC134ED985367EADC6F727d79E8295E11435c',
    0,
    '0xc6e40537215c1e041616478d8cfe312b1847b997',
    NULL,
    'https://cdn.dexscreener.com/cms/images/b042251f9195eb4fd46837317f171f7befb94995177a188b279ca7c217d4d1dc?width=800&height=800&quality=90',
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


-- Everybody (Hold) [others] [ethereum]
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
    'Everybody',
    'Hold',
    '0x68B36248477277865c64DFc78884Ef80577078F3',
    0,
    '0x9e5f2b740e52c239da457109bcced1f2bb40da5b',
    NULL,
    'https://cdn.dexscreener.com/cms/images/2f18be08b9cf0edc1ca6998054db9aa0612ba26c10d111a4e7e6801419ba1a41?width=800&height=800&quality=90',
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


-- Stonks (STONKS) [others] [ethereum]
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
    'Stonks',
    'STONKS',
    '0x7D4A23832FaD83258B32ce4Fd3109Ceef4332aF4',
    0,
    '0x20790842e3b690bda633c8fa531167dae8547a2e',
    NULL,
    'https://cdn.dexscreener.com/cms/images/8614cd39cecc67d7402e63846054e897a8a159aea252d59a0349178fac5c8bfa?width=800&height=800&quality=90',
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


-- MSTR2100 (MSTR) [others] [ethereum]
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
    'MSTR2100',
    'MSTR',
    '0x42069026EAC8Eee0Fd9b5f7aDFa4f6E6D69a2B39',
    0,
    '0x318ba85ca49a3b12d3cf9c72cc72b29316971802',
    NULL,
    'https://cdn.dexscreener.com/cms/images/bc5fe9610c3b400b673a6c6c8edda89c398d765b153544f95cf4a2d5b1873633?width=800&height=800&quality=90',
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


-- Patriot (PATRIOT) [others] [ethereum]
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
    'Patriot',
    'PATRIOT',
    '0xE9732d4b1E7d3789004fF029f032bA3034db059c',
    0,
    '0x32c6d4f8c4e905f0218d2e8dca7e56d3d0acff09',
    NULL,
    'https://cdn.dexscreener.com/cms/images/d1bba251ffbee05bd65c1e3de3d2739db736166fc4f4bd63f29d81d5e54cbbf9?width=800&height=800&quality=90',
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


-- LABUBU (LABUBU) [others] [ethereum]
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
    'LABUBU',
    'LABUBU',
    '0xABC930fdD6bCBBC2b5ae0d338138A025ec12eE55',
    0,
    '0x64305e6ad49a5279b766ddd5bad7a1a5d06794d7',
    NULL,
    'https://cdn.dexscreener.com/cms/images/fde6f5e9a411a1e4396950e7546100a35a0b55f4f919926cd5441211f162dac4?width=800&height=800&quality=90',
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
