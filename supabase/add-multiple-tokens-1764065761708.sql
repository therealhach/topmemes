-- Add multiple tokens to the database
-- Generated on 2025-11-25T10:16:01.708Z
-- Total tokens: 9
-- Categories: cats: 3, ai: 1, others: 5

-- Fix the sequence for the ID column (prevents duplicate key errors)
SELECT setval('tokens_id_seq', (SELECT MAX(id) FROM tokens));


-- Bongo Cat (BONGO) [cats]
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url,
    category
) VALUES (
    'Bongo Cat',
    'BONGO',
    'HPJALtLtydXym5Tbv6udQCKcXSihnz3B7aD3PNMNbonk',
    0,
    'fnj4vsd3xcdzmsqljan1w5vw7jjdxxbzkmjbxqw2rak9',
    NULL,
    'https://cdn.dexscreener.com/cms/images/56d515606dd2a33e314684d1943f596ad22eb5212056f462d3c3c6da9287b91e?width=800&height=800&quality=90',
    'cats'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category;


-- spinning cat (OIIAOIIA) [cats]
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url,
    category
) VALUES (
    'spinning cat',
    'OIIAOIIA',
    'VaxZxmFXV8tmsd72hUn22ex6GFzZ5uq9DVJ5wA5pump',
    0,
    'hz6rzhc96ctvx3hqikodbsdord3lh5nelyuyxgu4f3ee',
    NULL,
    'https://cdn.dexscreener.com/cms/images/241a49c5bb709450c8ca13fe3be9d9302089dace73a583867ea1eb3f4b0dcc9b?width=800&height=800&quality=90',
    'cats'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category;


-- el gato (ELGATO) [cats]
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url,
    category
) VALUES (
    'el gato',
    'ELGATO',
    'F47vvwFYuLioQsqEVAjqdY6Yihc8wVRiUcfHGcBR9XUs',
    0,
    'g7ekgxy38naqlzektmcde6gagleo6bzhmbhemhhuwtac',
    NULL,
    'https://cdn.dexscreener.com/cms/images/6bf11654bdcde4b8478373cb665f1da5e348d0df46a569fc651db1460701ae4c?width=800&height=800&quality=90',
    'cats'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category;


-- Pippin (pippin) [ai]
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url,
    category
) VALUES (
    'Pippin',
    'pippin',
    'Dfh5DzRgSvvCFDoYc2ciTkMrbDfRKybA4SoFbPmApump',
    0,
    '8wwcnqdzjcy5pt7akhupafknv2txca9sq6ybkgzlbvdt',
    NULL,
    'https://cdn.dexscreener.com/cms/images/d237de55618e54fd7d66593ff2adf3ad8c092398f9049a31f1dcb1b23ad1dff8?width=800&height=800&quality=90',
    'ai'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category;


-- OFFICIAL TRUMP (TRUMP) [others]
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url,
    category
) VALUES (
    'OFFICIAL TRUMP',
    'TRUMP',
    '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN',
    0,
    '9d9mb8kooffad3sctgztkxqypkshx6ezhbkio89ixyy2',
    NULL,
    'https://cdn.dexscreener.com/cms/images/85a2613c51c8ded8e51b1b3910487ab66691cb60fecec7d0905481a603bba899?width=800&height=800&quality=90',
    'others'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category;


-- SPX6900 (Wormhole) (SPX) [others]
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url,
    category
) VALUES (
    'SPX6900 (Wormhole)',
    'SPX',
    'J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr',
    0,
    '9t1h1udj558impnkepsn1fqkpc4xspq6cqsf6uestftr',
    NULL,
    'https://cdn.dexscreener.com/cms/images/4bb3c10a18160c945786d4bd3a990ddf2134fbc456524a476a70531776446b5e?width=800&height=800&quality=90',
    'others'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category;


-- BOOK OF MEME (BOME) [others]
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url,
    category
) VALUES (
    'BOOK OF MEME',
    'BOME',
    'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82',
    0,
    'dsuvc5qf5ljhhv5e2td184ixotsncnwj7i4jja4xsrmt',
    NULL,
    'https://cdn.dexscreener.com/cms/images/1fdb1c93b76e5aed7324c2c541558fd75fe7ffb3d0d0fb9ee8370cbac5890e4e?width=800&height=800&quality=90',
    'others'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category;


-- TROLL (TROLL) [others]
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url,
    category
) VALUES (
    'TROLL',
    'TROLL',
    '5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2',
    0,
    '4w2cysotx6czaugmmwg13hdpy4qemg2czekyeqyk9ama',
    NULL,
    'https://cdn.dexscreener.com/cms/images/97b02493a3a6aa5c7433cfa8ccd4732e6d73b9ebe70cfe43f0c258c4de83593c?width=800&height=800&quality=90',
    'others'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category;


-- jelly-my-jelly (jellyjelly) [others]
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url,
    category
) VALUES (
    'jelly-my-jelly',
    'jellyjelly',
    'FeR8VBqNRSUD5NtXAj2n3j1dAHkZHfyDktKuLXD4pump',
    0,
    '3bc2e2rxcfvf9op22lvbansvwos2t98q6ercroayqydq',
    NULL,
    'https://cdn.dexscreener.com/cms/images/46d5915766d45749a96fb9917aee70166b40a8df7fe2a61a2cc0eb5e9a4c2e48?width=800&height=800&quality=90',
    'others'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category;
