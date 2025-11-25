-- Add omni (omni) token to the database
-- Generated on 2025-11-23T13:50:55.175Z

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
    'omni',
    'omni',
    'A8vJzs6ygbZQyYLf9FKund8j3pDfUzxBeje8rJiypump',
    0,
    'en9hoynl2rnryfcvdyees3s3j4xar38r1xw3kbwa9xlx',
    NULL,
    'https://cdn.dexscreener.com/cms/images/849047d20e1d258094b9fc740193e6bb6ad26e1b7e252817f6a767406617a987?width=800&height=800&quality=90'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
