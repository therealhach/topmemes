-- Add multiple tokens to the database
-- Generated on 2025-11-25T10:54:09.332Z
-- Total tokens: 16
-- Categories: cats: 2, others: 14

-- Fix the sequence for the ID column (prevents duplicate key errors)
SELECT setval('tokens_id_seq', (SELECT MAX(id) FROM tokens));


-- Mog Coin (Mog) [cats] [ethereum]
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
    'Mog Coin',
    'Mog',
    '0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a',
    0,
    '0xc2eab7d33d3cb97692ecb231a5d0e4a649cb539d',
    NULL,
    'https://cdn.dexscreener.com/cms/images/830392e34129c07bc012bd814a2b0c1d0a385f4d7bd7ca6069246c402cc63de3?width=800&height=800&quality=90',
    'cats',
    'ethereum'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category,
    chain = EXCLUDED.chain;


-- Real Smurf Cat (SMURFCAT) [cats] [ethereum]
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
    'Real Smurf Cat',
    'SMURFCAT',
    '0xfF836A5821E69066c87E268bC51b849FaB94240C',
    0,
    '0x977c5fcf7a552d38adcde4f41025956855497c6d',
    NULL,
    'https://cdn.dexscreener.com/cms/images/72bab2d53fdd2f79830afa600f63a3889fde476b0abd7d73594de73b45b09ea3?width=800&height=800&quality=90',
    'cats',
    'ethereum'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category,
    chain = EXCLUDED.chain;


-- SPX6900 (SPX) [others] [ethereum]
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
    'SPX6900',
    'SPX',
    '0xE0f63A424a4439cBE457D80E4f4b51aD25b2c56C',
    0,
    '0x52c77b0cb827afbad022e6d6caf2c44452edbc39',
    NULL,
    'https://cdn.dexscreener.com/cms/images/4bb3c10a18160c945786d4bd3a990ddf2134fbc456524a476a70531776446b5e?width=800&height=800&quality=90',
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


-- BOBO (BOBO) [others] [ethereum]
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
    'BOBO',
    'BOBO',
    '0xB90B2A35C65dBC466b04240097Ca756ad2005295',
    0,
    '0xe945683b3462d2603a18bdfbb19261c6a4f03ad1',
    NULL,
    'https://cdn.dexscreener.com/cms/images/4c8129ce37b3f128a3dd88ca353ef15d1512f0abc3948e83a2760c7230a797ec?width=800&height=800&quality=90',
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


-- Department Of Government Efficiency (DOGE) [others] [ethereum]
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
    'Department Of Government Efficiency',
    'DOGE',
    '0x1121AcC14c63f3C872BFcA497d10926A6098AAc5',
    0,
    '0x308c6fbd6a14881af333649f17f2fde9cd75e2a6',
    NULL,
    'https://cdn.dexscreener.com/cms/images/7e6ad02f9c5b59bf37b2f5adeead77e451f6d8c59157afd006a0ec7da3469da6?width=800&height=800&quality=90',
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


-- Apu Apustaja (APU) [others] [ethereum]
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
    'Apu Apustaja',
    'APU',
    '0x594DaaD7D77592a2b97b725A7AD59D7E188b5bFa',
    0,
    '0x5ced44f03ff443bbe14d8ea23bc24425fb89e3ed',
    NULL,
    'https://cdn.dexscreener.com/cms/images/c31d0baeb13adffde4532cd8eda2ef608dd63345f099e6f03c347e034d6371bb?width=800&height=800&quality=90',
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


-- Joe Coin (JOE) [others] [ethereum]
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
    'Joe Coin',
    'JOE',
    '0x76e222b07C53D28b89b0bAc18602810Fc22B49A8',
    0,
    '0x704ad8d95c12d7fea531738faa94402725acb035',
    NULL,
    'https://cdn.dexscreener.com/cms/images/2f2cf8849814de01b0a1a685e16be3f8dfd6c473d73b76b1145e0e6c074626b1?width=800&height=800&quality=90',
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


-- Neiro (Neiro) [others] [ethereum]
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
    'Neiro',
    'Neiro',
    '0x812Ba41e071C7b7fA4EBcFB62dF5F45f6fA853Ee',
    0,
    '0xc555d55279023e732ccd32d812114caf5838fd46',
    NULL,
    'https://cdn.dexscreener.com/cms/images/539ffc4fd8fc9aac1c51f8157c3a2ec6b744b0d371b6db1207f53e5dd5fa10d1?width=800&height=800&quality=90',
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


-- Andy (ANDY) [others] [ethereum]
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
    'Andy',
    'ANDY',
    '0x68BbEd6A47194EFf1CF514B50Ea91895597fc91E',
    0,
    '0xa1bf0e900fb272089c9fd299ea14bfccb1d1c2c0',
    NULL,
    'https://cdn.dexscreener.com/cms/images/8db87241c05b8ca13d84d5908f89771e1ec6b256c8e78a5c52b1a67f59fdccb2?width=800&height=800&quality=90',
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


-- PeiPei (PEIPEI) [others] [ethereum]
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
    'PeiPei',
    'PEIPEI',
    '0x3fFEea07a27Fab7ad1df5297fa75e77a43CB5790',
    0,
    '0xbf16540c857b4e32ce6c37d2f7725c8eec869b8b',
    NULL,
    'https://cdn.dexscreener.com/cms/images/89074bebce1f030c05fed0c99f4bca4999197c15c4ea79fef3eef590849363ec?width=800&height=800&quality=90',
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


-- HarryPotterObamaSonic10Inu (BITCOIN) [others] [ethereum]
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
    'HarryPotterObamaSonic10Inu',
    'BITCOIN',
    '0x72e4f9F808C49A2a61dE9C5896298920Dc4EEEa9',
    0,
    '0x0c30062368eefb96bf3ade1218e685306b8e89fa',
    NULL,
    'https://cdn.dexscreener.com/cms/images/64f45551990a40ca081f880abfe7047c9b07a7080c6e76f9b2ebdfa532478dff?width=800&height=800&quality=90',
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


-- Wojak Coin (WOJAK) [others] [ethereum]
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
    'Wojak Coin',
    'WOJAK',
    '0x5026F006B85729a8b14553FAE6af249aD16c9aaB',
    0,
    '0x0f23d49bc92ec52ff591d091b3e16c937034496e',
    NULL,
    'https://cdn.dexscreener.com/cms/images/4a08d69e8b1d9d809ed80bf08029afd8f47cb4bdc6b6f39bccae9300d11c72cd?width=800&height=800&quality=90',
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


-- pepeCoin (pepecoin) [others] [ethereum]
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
    'pepeCoin',
    'pepecoin',
    '0xA9E8aCf069C58aEc8825542845Fd754e41a9489A',
    0,
    '0xddd23787a6b80a794d952f5fb036d0b31a8e6aff',
    NULL,
    'https://cdn.dexscreener.com/cms/images/9965df36841c49718cb57ed6bae20ddded12008b11010b52d2e4d98acd2cac71?width=800&height=800&quality=90',
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


-- Non-Playable Coin (NPC) [others] [ethereum]
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
    'Non-Playable Coin',
    'NPC',
    '0x8eD97a637A790Be1feff5e888d43629dc05408F6',
    0,
    '0x69c7bd26512f52bf6f76fab834140d13dda673ca',
    NULL,
    'https://cdn.dexscreener.com/cms/images/3ed99e720cc9e3568beb2df4507a36984362991bbaae8b5d67dcf3a00d41335e?width=800&height=800&quality=90',
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


-- Jesus Coin (JESUS) [others] [ethereum]
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
    'Jesus Coin',
    'JESUS',
    '0xba386A4Ca26B85FD057ab1Ef86e3DC7BdeB5ce70',
    0,
    '0x8f1b19622a888c53c8ee4f7d7b4dc8f574ff9068',
    NULL,
    'https://cdn.dexscreener.com/cms/images/b857960284144b15ccad09cdfe1d6490c50851fe48512cb86bcd1dce052d342c?width=800&height=800&quality=90',
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


-- Turbo (TURBO) [others] [ethereum]
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
    'Turbo',
    'TURBO',
    '0xA35923162C49cF95e6BF26623385eb431ad920D3',
    0,
    '0x7baece5d47f1bc5e1953fbe0e9931d54dab6d810',
    NULL,
    'https://cdn.dexscreener.com/cms/images/dc98afaa920f78906d33d12ed37762b6958075062bd3c6b1dea9beac97400f67?width=800&height=800&quality=90',
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
