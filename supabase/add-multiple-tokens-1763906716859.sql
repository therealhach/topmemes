-- Add multiple tokens to the database
-- Generated on 2025-11-23T14:05:16.859Z
-- Total tokens: 22

-- Fix the sequence for the ID column (prevents duplicate key errors)
SELECT setval('tokens_id_seq', (SELECT MAX(id) FROM tokens));


-- nubcat (nub)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'nubcat',
    'nub',
    'GtDZKAqvMZMnti46ZewMiXCa4oXF4bZxwQPoKzXPFxZn',
    0,
    '83g6vzjzlrcnhbslatj94vcprimyyqwun6zfl11mcadl',
    NULL,
    'https://cdn.dexscreener.com/cms/images/7490db4cfcde6a4f27c602fb698ff8c09bef149e2aca1bb2dcf6651984ee52c5?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Nailong (Nailong)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Nailong',
    'Nailong',
    'mkvXiNBpa8uiSApe5BrhWVJaT87pJFTZxRy7zFapump',
    0,
    '29oxiuz7rxtxssegpupntexvsjgqyz2mr6w6zf8nhsqe',
    NULL,
    'https://cdn.dexscreener.com/cms/images/6c49540f9bd2368a13d5f9f02217949b1106545d063512d5c1a5880244f3477b?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- USELESS COIN (USELESS)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'USELESS COIN',
    'USELESS',
    'Dz9mQ9NzkBcCsuGPFJ3r1bS4wgqKMHBPiVuniW8Mbonk',
    0,
    'q2sphpduwfmg7m7wwrqklrn619caucfrsmhvjffodsp',
    NULL,
    'https://cdn.dexscreener.com/cms/images/4f8af59f26d45252fb4379d4b1a1e61d0b419fd34dab2ec9f3ba77585d1783cb?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- just buy $1 worth of this coin ($1)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'just buy $1 worth of this coin',
    '$1',
    'GHichsGq8aPnqJyz6Jp1ASTK4PNLpB5KrD6XrfDjpump',
    0,
    'hzlxx6sovixoqb2kydgt1gweckz9oornv8n3xn6uvfez',
    NULL,
    'https://cdn.dexscreener.com/cms/images/4dedbabcd9b45c3cfae170b42298c2ba834c564e80fae737d0803dd11b3a2329?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- alon (ALON)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'alon',
    'ALON',
    '8XtRWb4uAAJFMP4QQhoYYCWR6XXb7ybcCdiqPwz9s5WS',
    0,
    'eb9qkfiszkd185kdwlkzrmrejkeba2ah2bk7spnmopej',
    NULL,
    'https://cdn.dexscreener.com/cms/images/1a083c0e91b278817828e518ef7ab5513e75b79019cc9c569f033b8aa8fe1d41?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Believe In Something (bis)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Believe In Something',
    'bis',
    '2GPJhV9jNrj7TaLYMRgWkcy6sTKLcwntv7nZ7qDyMRGM',
    0,
    'cf1uefqbt2wv4qujnkhgsr6c8y6invukoqbpczawazeb',
    NULL,
    'https://cdn.dexscreener.com/cms/images/d1c45ab645cc7e3b3a3d170feec07cfc3e47101026aa12ac27f834bc4fd5d78b?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- real. (real)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'real.',
    'real',
    'Cy4DSbZW4CE6cG6HDqQFhXxpHTdm41SY9hBB1JG6pump',
    0,
    'eqpmjhlxejgrtg8ichvqqk78uv228tspjpm5oztqwdnf',
    NULL,
    'https://cdn.dexscreener.com/cms/images/20cfd0ab5255ef5ff2c73d93c93b04f8499564b18f94c5bdea97e4768512096f?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Meme Coin Millionaire (RICH)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Meme Coin Millionaire',
    'RICH',
    'GRFK7sv4KhkMzJ7BXDUBy4PLyZVBeXuW1FeaT6Mnpump',
    0,
    'ek84xpantx8e5v8yjantb3pjwktwija6cszaq619e9nw',
    NULL,
    'https://cdn.dexscreener.com/cms/images/6dd608f8a999b1808f1d20a91a6838c38eb28ac9858ede0d365d15c84e5cb146?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Generational Wealth (wealth)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Generational Wealth',
    'wealth',
    'GFRxeCdpomjJaYQEuwPDAPghyBD3H9zqnWY2HJPjpump',
    0,
    'cf5vpldsrwxp1bekmwlohdzp7mzkevube2bh4m2w7ksr',
    NULL,
    'https://cdn.dexscreener.com/cms/images/ddc8fe4ae6b2f29780bab8eabad2c8461f8a21b04f9c0f0713af1568be378caf?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Bet more (BET)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Bet more',
    'BET',
    '5CLSw4viyMLfnRHHxZpDF8CuZt5e1ceq1AJqd4GjAJNX',
    0,
    '52jvv57ca7epw5guvcs49fa9tics2vksm8x2xekfpe4x',
    NULL,
    'https://cdn.dexscreener.com/cms/images/1ca0fc1ee6975c7167eaf44665b488273b50e6325dbf1acd506028c678221e32?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Liquid Solana Derivative 42069 (LSD)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Liquid Solana Derivative 42069',
    'LSD',
    'DDti34vnkrCehR8fih6dTGpPuc3w8tL4XQ4QLQhc3xPa',
    0,
    '4mn64cnw83xatyz1sun57kkvtdhn2wkzifhvl3spbj9c',
    NULL,
    'https://cdn.dexscreener.com/cms/images/b9093d88a9479fcb254e740540d382411f6831cc366bb0413497258bd71020f7?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- BASED (BASED)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'BASED',
    'BASED',
    'Em4rcuhX6STfB7mxb66dUXDmZPYCjDiQFthvzSzpump',
    0,
    '2kdetobhycwvu8m6c2nrpdgyaijloj3r3ahnk4sb4bzz',
    NULL,
    'https://cdn.dexscreener.com/cms/images/7f2c0e3d33fb1b34134330422e6730fcb73af8e1ad14f9204687dba450873f5c?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Generational Wealth (wealth)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Generational Wealth',
    'wealth',
    'GFRxeCdpomjJaYQEuwPDAPghyBD3H9zqnWY2HJPjpump',
    0,
    'cf5vpldsrwxp1bekmwlohdzp7mzkevube2bh4m2w7ksr',
    NULL,
    'https://cdn.dexscreener.com/cms/images/ddc8fe4ae6b2f29780bab8eabad2c8461f8a21b04f9c0f0713af1568be378caf?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- zerebro (ZEREBRO)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'zerebro',
    'ZEREBRO',
    '8x5VqbHA8D7NkD52uNuS5nnt3PwA8pLD34ymskeSo2Wn',
    0,
    '3sjnocnkkhwpvxygdtem8rccihsgc9jsfzuuazkbvrvp',
    NULL,
    'https://cdn.dexscreener.com/cms/images/2eb3b0a304e9ed93ee44ff263a7cd1c5b376589644b70618aef104a037f391c2?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- test griffain.com (GRIFFAIN)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'test griffain.com',
    'GRIFFAIN',
    'KENJSUYLASHUMfHyy5o4Hp2FdNqZg1AsUPhfH2kYvEP',
    0,
    'cpsmssqi3p9vmvnqxrdwvbsbcwyuhbggncrw7morbq3g',
    NULL,
    'https://cdn.dexscreener.com/cms/images/5e450081609e72dfaaf692052cddcd67be9cd6cf2f51f269439bba874c5a4f7f?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Just a chill guy (CHILLGUY)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Just a chill guy',
    'CHILLGUY',
    'Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump',
    0,
    '93tjgwff5ac5thymi8c4wejvvqq4tumemuyw1leyz7bu',
    NULL,
    'https://cdn.dexscreener.com/cms/images/20ae19e21d577f3aead6ae8722a7a3a66c5376cbf11f10d278807bef32551b46?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Goatseus Maximus (GOAT)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Goatseus Maximus',
    'GOAT',
    'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
    0,
    '9tb2ohu5p16bpbarqd3n27wnkf51ukfs8z1gzzldxvzw',
    NULL,
    'https://cdn.dexscreener.com/cms/images/e857505d98436d21d13451a83c93ff4db36d0b53829af8070ddae75845d9b459?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Peanut the Squirrel  (Pnut )
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Peanut the Squirrel ',
    'Pnut ',
    '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump',
    0,
    '4azrpnefcj7iw28rju5auyeqhycvdcnm8cswyl51ay9i',
    NULL,
    'https://cdn.dexscreener.com/cms/images/778498984ea5b6eb7c9d74e1e81a2547c88a41ae80f6c840c94a7c3b7829bcd5?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Purple Pepe (PURPE)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Purple Pepe',
    'PURPE',
    'HBoNJ5v8g71s2boRivrHnfSB5MVPLDHHyVjruPfhGkvL',
    0,
    'cpoyfgana6mjrujsgexu9mpdghmtwd5rvyesgej4zofj',
    NULL,
    'https://cdn.dexscreener.com/cms/images/015aa1aa85be3ba818d89cc5cc200db976beda650822ed7314512d6d7edce874?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Mumu the Bull (MUMU)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Mumu the Bull',
    'MUMU',
    '5LafQUrVco6o7KMz42eqVEJ9LW31StPyGjeeu5sKoMtA',
    0,
    'fvmzrd1qc66zw8vprw15xn1n5owupqpqgnq5oh18mr4e',
    NULL,
    'https://cdn.dexscreener.com/cms/images/0e4962f24453be79eafae2029ce44978ac6d273f5d228cd19c491d13dda2d9a1?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- First Convicted RACCON (FRED)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'First Convicted RACCON',
    'FRED',
    'CNvitvFnSM5ed6K28RUNSaAjqqz5tX1rA5HgaBN9pump',
    0,
    '8sqndszijlrlnxmfqbpzxbbhsujrjur7cefqcqzqz1hq',
    NULL,
    'https://cdn.dexscreener.com/cms/images/dbc567efa09ecec1699657893b3804511027be983ecab60f8bcc246682df64d1?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- SLERF (SLERF)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'SLERF',
    'SLERF',
    '7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3',
    0,
    'agfnrluscrd2e4nwqxw73hdbsn7ekeub2jhx7tx9ytyc',
    NULL,
    'https://cdn.dexscreener.com/cms/images/6f43abd0ed3d46732e02f2a5f15610beed2b25d0d25fac7aa4ca113d6f45012f?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
