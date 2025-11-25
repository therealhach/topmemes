-- Add multiple tokens to the database
-- Generated on 2025-11-23T14:11:40.268Z
-- Total tokens: 28

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


-- ai16z (ai16z)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'ai16z',
    'ai16z',
    'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
    0,
    'duyfmgxa4knxv2sm754ukw1gz6b3zksaf4e7iby4fg9r',
    NULL,
    'https://cdn.dexscreener.com/cms/images/f88abc595c9b7385c582d97f9a113c8339f51ffc46d4bf25b96e49723b30e2da?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- AI Rig Complex (arc)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'AI Rig Complex',
    'arc',
    '61V8vBaqAGMpgDQi4JcAwo1dmBGHsyhzodcPqnEVpump',
    0,
    'j3b6dvhes2y1cbmtvz5tcwxnegsjjdbukxduvdpoqms7',
    NULL,
    'https://cdn.dexscreener.com/cms/images/952429eb5f770cb20d90492e438aa92bf61d33fa6aaaeca0186d2862d68fc21c?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Ava AI (AVA)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Ava AI',
    'AVA',
    'DKu9kykSfbN5LBfFXtNNDPaX35o4Fv6vJ9FKk7pZpump',
    0,
    'gjvw8jqspkg5ogjyd3zozfaejsshtajs5zfrext8l12k',
    NULL,
    'https://cdn.dexscreener.com/cms/images/786c9d35f50b4fd28668584463ee9f85a2d6e9696e6a2070674f48cfa2434864?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Alchemist AI (ALCH)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Alchemist AI',
    'ALCH',
    'HNg5PYJmtqcmzXrv6S9zP1CDKk5BgDuyFBxbvNApump',
    0,
    'fydf3vkqfbcvntsbi7l7lremrfpmxkbqqgagnpg1hxxd',
    NULL,
    'https://cdn.dexscreener.com/cms/images/2eb3cb7607a5331385421301279d0fbc35f6e1dac31a773c3261cba73306c390?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Shoggoth (Shoggoth)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Shoggoth',
    'Shoggoth',
    'H2c31USxu35MDkBrGph8pUDUnmzo2e4Rf4hnvL2Upump',
    0,
    'y8yywu9gycysome99jkdvsfr4ehneeqpwtr8qugpbwx',
    NULL,
    'https://cdn.dexscreener.com/cms/images/03d592b00198f25816f985e82c253b90e3f4e647e8b623d94a964e0c7dd4d8a1?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- ORBIT (GRIFT)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'ORBIT',
    'GRIFT',
    'GekTNfm84QfyP2GdAHZ5AgACBRd69aNmgA5FDhZupump',
    0,
    '7dxuxn2dxtydhi2ywqvvqjwewob9mlfth4hzddowkvjy',
    NULL,
    'https://cdn.dexscreener.com/cms/images/ab0048a76a06936db430b8c40615fb04ebead0f1e9ff27aad9f3b8542d258114?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- SAD HAMSTER (HAMMY)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'SAD HAMSTER',
    'HAMMY',
    '26KMQVgDUoB6rEfnJ51yAABWWJND8uMtpnQgsHQ64Udr',
    0,
    'x131b3frgn4b8ue51eyvrnzwutubgom93uryrnteefy',
    NULL,
    'https://cdn.dexscreener.com/cms/images/3a2cefbcb3d46edd0121bea5ed66414a9808f2cbafc02c71dc75fa7da72f24b3?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- PeiPei (PEIPEI)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'PeiPei',
    'PEIPEI',
    'H4PDo8ngWwC4quPTRWfTr2HorUQ2Ep4G3JVeJHMfkZAT',
    0,
    '7unnmsqsaqnvjrlp85uetseb879e4eqsgyrvezrwps4x',
    NULL,
    'https://cdn.dexscreener.com/cms/images/7672ca3cb76890bcbf581d2bfda69b119dde390f67147ca6c76506af62a6bc0d?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- GIGACHAD (GIGA)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'GIGACHAD',
    'GIGA',
    '63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9',
    0,
    '4xxm4cdb6mescxm52xvyqknbzvdewwspdzrbctqvguar',
    NULL,
    'https://cdn.dexscreener.com/cms/images/102ba1dee6cf6239b293dbd86e0e11ddf78e74cdce00030c4511096bd2480e26?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- BOOK OF MEME (BOME)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'BOOK OF MEME',
    'BOME',
    'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82',
    0,
    'dsuvc5qf5ljhhv5e2td184ixotsncnwj7i4jja4xsrmt',
    NULL,
    'https://cdn.dexscreener.com/cms/images/1fdb1c93b76e5aed7324c2c541558fd75fe7ffb3d0d0fb9ee8370cbac5890e4e?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Chudjak (Chud)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Chudjak',
    'Chud',
    '6yjNqPzTSanBWSa6dxVEgTjePXBrZ2FoHLDQwYwEsyM6',
    0,
    '3cv7z8kn21m6ur6ntekikepcjtueag87ciu6cc3grnw6',
    NULL,
    'https://cdn.dexscreener.com/cms/images/75f4420b3b1a0392607c2be76f47fc600c896d13e1c5a86a5d1836b9dec21c73?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- PONKE (PONKE)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'PONKE',
    'PONKE',
    '5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC',
    0,
    '5utwg3y3f5cx4ykodgtjwehdrx5hdkz5bzz72x8eq6ze',
    NULL,
    'https://cdn.dexscreener.com/cms/images/cfbe2eabb540e7ba8651832435e968e12c9df2efb452e78358e64d8f73ae5760?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- GameStop (GME)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'GameStop',
    'GME',
    '8wXtPeU6557ETkp9WHFY1n1EcU6NxDvbAggHGsMYiHsB',
    0,
    '9tz6vykibdlyx2rngwc5tesu4pyve4jd6tm56352ugte',
    NULL,
    'https://cdn.dexscreener.com/cms/images/5864d48c59829eef07ab7f03f9238c581dc97462b4520158aa40875291c55e46?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Smoking Chicken Fish (SCF)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Smoking Chicken Fish',
    'SCF',
    'GiG7Hr61RVm4CSUxJmgiCoySFQtdiwxtqf64MsRppump',
    0,
    '6uspebbn94duylui4a2wo3azdcyozon1plgyu27jzpkx',
    NULL,
    'https://cdn.dexscreener.com/cms/images/46ce6194d1499b2b5753dee357fdbb48748d68e2debb41d5f0b9d8ffeaa18bf9?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- American Coin (USA)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'American Coin',
    'USA',
    '69kdRLyP5DTRkpHraaSZAQbWmAwzF9guKjZfzMXzcbAs',
    0,
    'hkprctgbnh1j8xeqggzwhhvd3kwdudphqpqdp8vmay8b',
    NULL,
    'https://cdn.dexscreener.com/cms/images/69e14ff4c3dd5337ae758f9a54334b23e1a6abcc1bf53bb0af35bc429c156ce0?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- BILLY (BILLY)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'BILLY',
    'BILLY',
    '3B5wuUrMEi5yATD7on46hKfej3pfmd7t1RKgrsN3pump',
    0,
    '9uww4c36hictgr6pzw9vfhr9vdxktz8na8jvnzqu35pj',
    NULL,
    'https://cdn.dexscreener.com/cms/images/efdd477d5b91c13fc0f6be6116cd5a034c608192130cd8d23a229a4d424f1d2c?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Brainlet (BRAINLET)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Brainlet',
    'BRAINLET',
    '8NNXWrWVctNw1UFeaBypffimTdcLCcD8XJzHvYsmgwpF',
    0,
    'cw9dfotweuiwxyxvgnqfyhbryefgkvaqxegxkzg7d7x1',
    NULL,
    'https://cdn.dexscreener.com/cms/images/0a2c499e8fe3db005ff62b125901113007d947af30529dcd1287672ae70896ff?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- jeo boden (boden)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'jeo boden',
    'boden',
    '3psH1Mj1f7yUfaD5gh6Zj7epE8hhrMkMETgv5TshQA4o',
    0,
    '6uybx1x8yucfj8ystpyizbyg7uqzaq2s46zwphumkjg5',
    NULL,
    'https://cdn.dexscreener.com/cms/images/2a07d783053add242275dd421b119d5badd7279e18ffad720f44ba2eb47ff79b?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Dolan Duck (DOLAN)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Dolan Duck',
    'DOLAN',
    '4YK1njyeCkBuXG6phNtidJWKCbBhB659iwGkUJx98P5Z',
    0,
    'a4xegghwrcyyrnzqhwdaneow9nrodsjdrhewcpcbuk4e',
    NULL,
    'https://cdn.dexscreener.com/cms/images/6aae17c030e9d1930a5d1f3fece29f4030c0b2682564cc7beb3db3a536e29d0b?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- nomnom (nomnom)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'nomnom',
    'nomnom',
    '6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump',
    0,
    'fhmjp6smtmd8gxkq8tw6azjbk3sdpktkksh6rtolax3m',
    NULL,
    'https://cdn.dexscreener.com/cms/images/999b48f01f87ed7bac0394a36ec741aa80fd1a88a981465c4b51af3d59523013?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- SelfieDogCoin (SELFIE)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'SelfieDogCoin',
    'SELFIE',
    '9WPTUkh8fKuCnepRWoPYLH3aK9gSjPHFDenBq2X1Czdp',
    0,
    'dfk133hhxjaa1yprynkopergj5dmputm79yey1p1wiyh',
    NULL,
    'https://cdn.dexscreener.com/cms/images/2d48e015aac39d817bff68026c9856fb98bb70e7cca6005e5f6c3c02fcbb88c9?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Crashout (Crashout)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Crashout',
    'Crashout',
    '6JGSHS9GrE9uG8ix63w3DPMYHrgrJ6J4QyHbBhAepump',
    0,
    '8guix1wqrn8usufml54drhcclxlytudstkewhowdd2ms',
    NULL,
    'https://cdn.dexscreener.com/cms/images/281408bef53897e49f8ee0260d224f9c7ed821e132aba0c9ebbc85c70b83628a?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- STAN (STAN)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'STAN',
    'STAN',
    'CQSzJzwW5H1oyWrp6QhfUKYYwyovbSiVDKnAxNfb1tJC',
    0,
    'fdawcghyqyua2awm1bb2mlzcrude3flwkywb2duz4vtg',
    NULL,
    'https://cdn.dexscreener.com/cms/images/6b1b333f7dc75b84a86da31bb49aa053b6005b1c637153bb54c432f91df3d51b?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- Peng (PENG)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'Peng',
    'PENG',
    'A3eME5CetyZPBoWbRUwY3tSe25S6tb18ba9ZPbWk9eFJ',
    0,
    'axbddimk9hrplmpm7k6ncpc1grargxqhnejfp2lvngr6',
    NULL,
    'https://cdn.dexscreener.com/cms/images/ece2ff8a284707ff2189f1691f801db57bd80fc7b4eba10876909cf5270c07bc?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- CHONKY (CHONKY)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'CHONKY',
    'CHONKY',
    'H7ed7UgcLp3ax4X1CQ5WuWDn6d1pprfMMYiv5ejwLWWU',
    0,
    'e61pedmewf8iuhfhmgn3wcj5p32dpjkdgo1unjjanrg1',
    NULL,
    'https://cdn.dexscreener.com/cms/images/f20831bf594db6ea11bd2232d3eee93c2bd6dee1d98429c3e6540d9ecabd8557?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- littlemanyu (Manyu)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'littlemanyu',
    'Manyu',
    'CS7LmjtuugEUWtFgfyto79nrksKigv7Fdcp9qPuigdLs',
    0,
    '6pcjndxqq4yikwgvd12bsptgmijhe5qze7umuans73er',
    NULL,
    'https://cdn.dexscreener.com/cms/images/9a4b6da6a4ff6a60abd27fd5584502003461ef574197f90f6625a613d43f1b2b?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;


-- gomu gator (gomu)
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id,
    logo_url
) VALUES (
    'gomu gator',
    'gomu',
    'Bx74hpFiaiBbSonrjyqxjGfAA7gRxM2CeKiy31uN6biR',
    0,
    '2h282gdoedejwwtxtmfpxvmdvpqkb7rvf24b2gws1cg4',
    NULL,
    'https://cdn.dexscreener.com/cms/images/e07325e24f5f788c767d120626fb8c2cd0c9e72836e3aa229f7bac1b2ba4726a?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
