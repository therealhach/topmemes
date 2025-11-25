-- Create category enum type
DO $$ BEGIN
    CREATE TYPE token_category AS ENUM ('dogs', 'cats', 'ai', 'others');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tokens table
CREATE TABLE IF NOT EXISTS public.tokens (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    token_address TEXT UNIQUE NOT NULL,
    ath_price NUMERIC DEFAULT 0,
    pair_address TEXT,
    coingecko_id TEXT,
    logo_url TEXT,
    category TEXT DEFAULT 'others',
    chain TEXT DEFAULT 'solana'
);

-- Add category column if it doesn't exist (for existing tables)
DO $$ BEGIN
    ALTER TABLE public.tokens ADD COLUMN category TEXT DEFAULT 'others';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add chain column if it doesn't exist (for existing tables)
DO $$ BEGIN
    ALTER TABLE public.tokens ADD COLUMN chain TEXT DEFAULT 'solana';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create index on token_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_tokens_address ON public.tokens(token_address);

-- Create index on updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_tokens_updated_at ON public.tokens(updated_at DESC);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_tokens_category ON public.tokens(category);

-- Enable Row Level Security
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Allow public read access" ON public.tokens;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.tokens;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.tokens;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.tokens
    FOR SELECT
    TO public
    USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON public.tokens
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON public.tokens
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at column
DROP TRIGGER IF EXISTS set_updated_at ON public.tokens;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.tokens
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Clear existing data and insert with categories
TRUNCATE public.tokens RESTART IDENTITY;

INSERT INTO public.tokens (id, created_at, updated_at, token_name, token_symbol, token_address, ath_price, pair_address, coingecko_id, logo_url, category) VALUES
-- DOGS (Dog-themed memecoins)
('1', '2025-11-23 11:55:21.614388+00', '2025-11-23 12:26:12.079457+00', 'Bonk', 'BONK', 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', '0.00005825', '5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9', 'bonk', 'https://wsrv.nl/?w=32&h=32&url=https%3A%2F%2Farweave.net%2FhQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I&dpr=2&quality=80', 'dogs'),
('2', '2025-11-23 11:55:21.614388+00', '2025-11-23 12:09:29.941145+00', 'dogwifhat', 'WIF', 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', '4.83', 'EP2ib6dYdEeqD8MfE2ezHCxX3kP3K2eLKkirfPm5eyMx', 'dogwifhat', 'https://wsrv.nl/?w=48&h=48&url=https://bafkreibk3covs5ltyqxa272uodhculbr6kea6betidfwy3ajsav2vjzyum.ipfs.nftstorage.link', 'dogs'),
('3', '2025-11-23 11:55:21.614388+00', '2025-11-23 22:22:19.553334+00', 'Myro', 'MYRO', 'HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4', '0.442', '5WGYajM1xtLy3QrLHGSX4YPwsso3jrjEsbU1VivUErzk', 'myro', 'https://wsrv.nl/?w=32&h=32&url=https%3A%2F%2Fi.ibb.co%2F9nr3xFp%2FMYRO-200x200.png&dpr=2&quality=80', 'dogs'),
('66', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:46:48.237942+00', 'SelfieDogCoin', 'SELFIE', '9WPTUkh8fKuCnepRWoPYLH3aK9gSjPHFDenBq2X1Czdp', '0.06391', 'dfk133hhxjaa1yprynkopergj5dmputm79yey1p1wiyh', null, 'https://cdn.dexscreener.com/cms/images/2d48e015aac39d817bff68026c9856fb98bb70e7cca6005e5f6c3c02fcbb88c9?width=800&height=800&quality=90', 'dogs'),

-- CATS (Cat-themed memecoins)
('5', '2025-11-23 12:20:22+00', '2025-11-23 12:25:44.588357+00', 'POPCAT', 'POPCAT', '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', '2.10', 'FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo', 'popcat', 'https://wsrv.nl/?w=48&h=48&url=https://arweave.net/A1etRNMKxhlNGTf-gNBtJ75QJJ4NJtbKh_UXQTlLXzI', 'cats'),
('6', '2025-11-23 12:24:20+00', '2025-11-23 22:22:15.210009+00', 'MICHI', '$michi', '5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp', '0.587', 'GH8Ers4yzKR3UKDvgVu8cqJfGzU4cU62mTeg9bcJ7ug6', 'michicoin', 'https://wsrv.nl/?w=48&h=48&url=https://ipfs.io/ipfs/QmTQrP6R7ieRSbKzwzLAy1i8c2U66b7LM6bSUmK1dfYc5b', 'cats'),
('15', '2025-11-23 13:47:59.074731+00', '2025-11-23 22:22:53.745835+00', 'nubcat', 'nub', 'GtDZKAqvMZMnti46ZewMiXCa4oXF4bZxwQPoKzXPFxZn', '0.195', '83g6vzjzlrcnhbslatj94vcprimyyqwun6zfl11mcadl', null, 'https://cdn.dexscreener.com/cms/images/7490db4cfcde6a4f27c602fb698ff8c09bef149e2aca1bb2dcf6651984ee52c5?width=800&height=800&quality=90', 'cats'),
('16', '2025-11-23 13:52:22.789327+00', '2025-11-23 22:23:15.784724+00', 'WOMAN YELLING AT CAT', 'WYAC', 'BEgBsVSKJSxreiCE1XmWWq8arnwit7xDqQXSWYgay9xP', '0.062', '9uutkg2u657epumxsqpx3zvw2ltraejnbvc5u61tknmb', null, 'https://cdn.dexscreener.com/cms/images/3d314195c7699da40e0fd144f4725368abd675273f2591e70b7c65ed885446f3?width=800&height=800&quality=90', 'cats'),
('17', '2025-11-23 13:52:26.851803+00', '2025-11-23 22:23:35.609481+00', 'Shark Cat', 'SC', '6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui', '0.38', 'bszedbevwrqvksaf558eppwcm16avepyhm2hgsq9wzyy', null, 'https://cdn.dexscreener.com/cms/images/9dff2b73980785dd7de7d5a8b65afdab5cfdf022da24b72ff1a1beebcdbd8ac8?width=800&height=800&quality=90', 'cats'),
('19', '2025-11-23 13:52:35.828016+00', '2025-11-23 22:24:53.729757+00', 'cat in a dogs world', 'MEW', 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5', '0.0126', '879f697iudjgmevrkrcnw21fcxiaeljk1ffsw2atebce', null, 'https://cdn.dexscreener.com/cms/images/33effe52dd5b1f6574ca5baaca9c02fecdecb557607a2a72889ceb0537eae9be?width=800&height=800&quality=90', 'cats'),
('20', '2025-11-23 13:52:39.983103+00', '2025-11-23 22:25:19.222579+00', 'MANEKI', 'MANEKI', '25hAyBQfoDhfWx9ay6rarbgvWGwDdNqcHsXS3jQ3mTDJ', '0.0278', '2apssvxfw6dgrqwwukfwujn6wvoyxuhjjapzyajvgddr', null, 'https://cdn.dexscreener.com/cms/images/2d1e97e69f64c1e77db437f9a93a756f645d100ac2c8d2ae7efa244ab5b75351?width=800&height=800&quality=90', 'cats'),
('21', '2025-11-23 13:52:44.188135+00', '2025-11-23 22:27:10.198011+00', 'hehe', 'hehe', 'BreuhVohXX5fv6q41uyb3sojtAuGoGaiAhKBMtcrpump', '0.046', '23kjarate7xthaq7c5xbjjyk5cyg1sna2ikcpsiacbvp', null, 'https://cdn.dexscreener.com/cms/images/480c061a9f99598e9dacaa96d1585bdcaeacc0eb9684b7cde4b55e966ce1cfbd?width=800&height=800&quality=90', 'cats'),
('22', '2025-11-23 13:52:48.342003+00', '2025-11-23 22:27:34.856664+00', 'Happy Cat', 'HAPPY', 'HAPPYwgFcjEJDzRtfWE6tiHE9zGdzpNky2FvjPHsvvGZ', '0.058', '3xguwbzq2pbpecygynrhespiokanfnnpvyhgpbfopxsz', null, 'https://cdn.dexscreener.com/cms/images/5c5cd2ef298608a6fff9015aeeb7aa0078f8dfd096ef3d4a948cb12aa5a9b2bd?width=800&height=800&quality=90', 'cats'),
('23', '2025-11-23 13:52:52.43131+00', '2025-11-23 22:28:00.837612+00', 'Giko Cat', 'GIKO', '3WPep4ufaToK1aS5s8BL9inzeUrt4DYaQCiic6ZkkC1U', '8.11', 'a1wy7bbm3vanbtfg9sqsxmyjpf17t3y1ugwlmd35nkxz', null, 'https://cdn.dexscreener.com/cms/images/24c55931003f9ba0809052d9d2da26b6018200ec5efc576a6d16eef68646e43c?width=800&height=800&quality=90', 'cats'),
('25', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:28:23.071327+00', 'Nailong', 'Nailong', 'mkvXiNBpa8uiSApe5BrhWVJaT87pJFTZxRy7zFapump', '0.0145', '29oxiuz7rxtxssegpupntexvsjgqyz2mr6w6zf8nhsqe', null, 'https://cdn.dexscreener.com/cms/images/6c49540f9bd2368a13d5f9f02217949b1106545d063512d5c1a5880244f3477b?width=800&height=800&quality=90', 'cats'),

-- AI (AI-themed tokens)
('46', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:51:27.022173+00', 'ai16z', 'ai16z', 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC', '2.47', '7qAVrzrbULwg1B13YseqA95Uapf8EVp9jQE5uipqFMoP', null, 'https://cdn.dexscreener.com/cms/images/f88abc595c9b7385c582d97f9a113c8339f51ffc46d4bf25b96e49723b30e2da?width=800&height=800&quality=90', 'ai'),
('47', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:37:52.076216+00', 'AI Rig Complex', 'arc', '61V8vBaqAGMpgDQi4JcAwo1dmBGHsyhzodcPqnEVpump', '0.6232', 'j3b6dvhes2y1cbmtvz5tcwxnegsjjdbukxduvdpoqms7', null, 'https://cdn.dexscreener.com/cms/images/952429eb5f770cb20d90492e438aa92bf61d33fa6aaaeca0186d2862d68fc21c?width=800&height=800&quality=90', 'ai'),
('48', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:38:10.931534+00', 'Ava AI', 'AVA', 'DKu9kykSfbN5LBfFXtNNDPaX35o4Fv6vJ9FKk7pZpump', '0.3318', 'gjvw8jqspkg5ogjyd3zozfaejsshtajs5zfrext8l12k', null, 'https://cdn.dexscreener.com/cms/images/786c9d35f50b4fd28668584463ee9f85a2d6e9696e6a2070674f48cfa2434864?width=800&height=800&quality=90', 'ai'),
('49', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:38:25.705297+00', 'Alchemist AI', 'ALCH', 'HNg5PYJmtqcmzXrv6S9zP1CDKk5BgDuyFBxbvNApump', '0.2358', 'fydf3vkqfbcvntsbi7l7lremrfpmxkbqqgagnpg1hxxd', null, 'https://cdn.dexscreener.com/cms/images/2eb3cb7607a5331385421301279d0fbc35f6e1dac31a773c3261cba73306c390?width=800&height=800&quality=90', 'ai'),
('50', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:38:40.094334+00', 'Shoggoth', 'Shoggoth', 'H2c31USxu35MDkBrGph8pUDUnmzo2e4Rf4hnvL2Upump', '0.1727', 'y8yywu9gycysome99jkdvsfr4ehneeqpwtr8qugpbwx', null, 'https://cdn.dexscreener.com/cms/images/03d592b00198f25816f985e82c253b90e3f4e647e8b623d94a964e0c7dd4d8a1?width=800&height=800&quality=90', 'ai'),
('51', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:38:53.421338+00', 'ORBIT', 'GRIFT', 'GekTNfm84QfyP2GdAHZ5AgACBRd69aNmgA5FDhZupump', '0.1881', '7dxuxn2dxtydhi2ywqvvqjwewob9mlfth4hzddowkvjy', null, 'https://cdn.dexscreener.com/cms/images/ab0048a76a06936db430b8c40615fb04ebead0f1e9ff27aad9f3b8542d258114?width=800&height=800&quality=90', 'ai'),
('37', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:32:32.632588+00', 'zerebro', 'ZEREBRO', '8x5VqbHA8D7NkD52uNuS5nnt3PwA8pLD34ymskeSo2Wn', '0.77', '3sjnocnkkhwpvxygdtem8rccihsgc9jsfzuuazkbvrvp', null, 'https://cdn.dexscreener.com/cms/images/2eb3b0a304e9ed93ee44ff263a7cd1c5b376589644b70618aef104a037f391c2?width=800&height=800&quality=90', 'ai'),
('38', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:32:52.977994+00', 'test griffain.com', 'GRIFFAIN', 'KENJSUYLASHUMfHyy5o4Hp2FdNqZg1AsUPhfH2kYvEP', '0.618', 'cpsmssqi3p9vmvnqxrdwvbsbcwyuhbggncrw7morbq3g', null, 'https://cdn.dexscreener.com/cms/images/5e450081609e72dfaaf692052cddcd67be9cd6cf2f51f269439bba874c5a4f7f?width=800&height=800&quality=90', 'ai'),

-- OTHERS (All other memecoins)
('4', '2025-11-23 12:16:25+00', '2025-11-23 22:22:16.745702+00', 'FWOG', 'FWOG', 'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump', '0.736', 'AB1eu2L1Jr3nfEft85AuD2zGksUbam1Kr8MR3uM2sjwt', 'fwog', 'https://wsrv.nl/?w=48&h=48&url=https://ipfs.io/ipfs/QmQ4H6Y23dSEjn9LKB85M7KpVFiDu6KfDNZAcrqiCwFQQH', 'others'),
('7', '2025-11-23 13:07:48+00', '2025-11-23 13:07:50+00', 'FARTCOIN', 'Fartcoin', '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump', '2.60', 'Bzc9NZfMqkXR6fz1DBph7BDf9BroyEf6pnzESP7v5iiw', 'fartcoin', 'https://wsrv.nl/?w=32&h=32&url=https%3A%2F%2Fipfs.io%2Fipfs%2FQmQr3Fz4h1etNsF7oLGMRHiCzhB5y9a7GjyodnF7zLHK1g&dpr=2&quality=80', 'others'),
('8', '2025-11-23 13:09:02+00', '2025-11-23 13:09:05+00', 'Moo Deng', 'MOODENG', 'ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY', '0.71', '22WrmyTj8x2TRVQen3fxxi2r4Rn6JDHWoMTpsSmn8RUd', '', 'https://wsrv.nl/?w=32&h=32&url=https%3A%2F%2Fipfs.io%2Fipfs%2FQmf1g7dJZNDJHRQru7E7ENwDjcvu7swMUB6x9ZqPXr4RV2&dpr=2&quality=80', 'others'),
('9', '2025-11-23 13:10:19+00', '2025-11-23 13:10:21+00', 'AURA', 'aura', 'DtR4D9FtVoTX2569gaL837ZgrB6wNjj6tkmnX9Rdk9B2', '0.237', '9ViX1VductEoC2wERTSp2TuDxXPwAf69aeET8ENPJpsN', null, 'https://cdn.dexscreener.com/cms/images/8f6c41e8155c0e0bac57d58f8415ab98bcc96380d4616758eb6ed468b623668d?width=64&height=64&fit=crop&quality=95&format=auto', 'others'),
('10', '2025-11-23 13:11:36+00', '2025-11-23 22:22:08.071636+00', 'SIGMA', 'SIGMA', '5SVG3T9CNQsm2kEwzbRq6hASqh1oGfjqTtLXYUibpump', '0.163', '424kbbJyt6VkSn7GeKT9Vh5yetuTR1sbeyoya2nmBJpw', null, 'https://wsrv.nl/?w=32&h=32&url=https%3A%2F%2Fipfs.io%2Fipfs%2FQmSZuPFTgLfpP16zgCZxQfhroFnfsyH6rKczzwxEeDL72M&dpr=2&quality=80', 'others'),
('11', '2025-11-23 13:13:15+00', '2025-11-23 22:22:06.194052+00', 'MINI', 'MINI', '2JcXacFwt9mVAwBQ5nZkYwCyXQkRcdsYrDXn6hj22SbP', '0.095', 'HYpXCaAT9YBu7vYa5BURGprsa23hmvdkqXtSUD5gQWdc', null, 'https://cdn.dexscreener.com/cms/images/8c9e7a1b0f66e3ebe9672392bcb74c380849660e2b1be15b2302875e4855c533?width=64&height=64&fit=crop&quality=95&format=auto', 'cats'),
('12', '2025-11-23 13:15:37+00', '2025-11-23 22:22:10.640265+00', 'RETARDIO', 'RETARDIO', '6ogzHhzdrQr9Pgv6hZ2MNze7UrzBMAFyBBWUYp1Fhitx', '0.243', '5eLRsN6qDQTQSBF8KdW4B8mVpeeAzHCCwaDptzMyszxH', '', 'https://wsrv.nl/?w=32&h=32&url=https%3A%2F%2Fipfs.filebase.io%2Fipfs%2FQmTWd41E9u7f6aUjUnucP4S88TCZLJ9sJRM1Kj5EAKfivt&dpr=2&quality=80', 'others'),
('13', '2025-11-23 13:16:27+00', '2025-11-23 22:22:12.687787+00', 'LOCKIN', 'LOCKIN', '8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5', '0.118', 'AtWMAA6T9t8cq8XCccCFPGDNNQYXhScuNuY6WVRi7FKe', '', 'https://wsrv.nl/?w=32&h=32&url=https%3A%2F%2Fipfs.io%2Fipfs%2FQmc2SJQW4K7UYYVLdoKSf4cGVZbuFGTF4dZiAdRtivNkpX&dpr=2&quality=80', 'others'),
('14', '2025-11-23 13:19:10+00', '2025-11-23 13:23:50.740629+00', 'The Official 67 Coin', '67', '9AvytnUKsLxPxFHFqS6VLxaxt5p6BhYNr53SD2Chpump', '0.043', 'DMAFL613XTipuA3jFNYczavWT7XsiYf9cR3qmRMZQhB6', null, 'https://cdn.dexscreener.com/cms/images/b8a2c3e27dd106cbd6b60c69102dcdfc878a8439d5b783da734a36e65895415b?width=64&height=64&fit=crop&quality=95&format=auto', 'others'),
('26', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:28:50.295871+00', 'USELESS COIN', 'USELESS', 'Dz9mQ9NzkBcCsuGPFJ3r1bS4wgqKMHBPiVuniW8Mbonk', '0.425', 'q2sphpduwfmg7m7wwrqklrn619caucfrsmhvjffodsp', null, 'https://cdn.dexscreener.com/cms/images/4f8af59f26d45252fb4379d4b1a1e61d0b419fd34dab2ec9f3ba77585d1783cb?width=800&height=800&quality=90', 'others'),
('27', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:29:09.586285+00', 'just buy $1 worth of this coin', '$1', 'GHichsGq8aPnqJyz6Jp1ASTK4PNLpB5KrD6XrfDjpump', '0.087', 'hzlxx6sovixoqb2kydgt1gweckz9oornv8n3xn6uvfez', null, 'https://cdn.dexscreener.com/cms/images/4dedbabcd9b45c3cfae170b42298c2ba834c564e80fae737d0803dd11b3a2329?width=800&height=800&quality=90', 'others'),
('28', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:29:38.166233+00', 'alon', 'ALON', '8XtRWb4uAAJFMP4QQhoYYCWR6XXb7ybcCdiqPwz9s5WS', '0.235', 'eb9qkfiszkd185kdwlkzrmrejkeba2ah2bk7spnmopej', null, 'https://cdn.dexscreener.com/cms/images/1a083c0e91b278817828e518ef7ab5513e75b79019cc9c569f033b8aa8fe1d41?width=800&height=800&quality=90', 'others'),
('29', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:29:58.760598+00', 'Believe In Something', 'bis', '2GPJhV9jNrj7TaLYMRgWkcy6sTKLcwntv7nZ7qDyMRGM', '0.018', 'cf1uefqbt2wv4qujnkhgsr6c8y6invukoqbpczawazeb', null, 'https://cdn.dexscreener.com/cms/images/d1c45ab645cc7e3b3a3d170feec07cfc3e47101026aa12ac27f834bc4fd5d78b?width=800&height=800&quality=90', 'others'),
('30', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:30:31.076651+00', 'real.', 'real', 'Cy4DSbZW4CE6cG6HDqQFhXxpHTdm41SY9hBB1JG6pump', '0.006', 'eqpmjhlxejgrtg8ichvqqk78uv228tspjpm5oztqwdnf', null, 'https://cdn.dexscreener.com/cms/images/20cfd0ab5255ef5ff2c73d93c93b04f8499564b18f94c5bdea97e4768512096f?width=800&height=800&quality=90', 'others'),
('31', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:30:50.640767+00', 'Meme Coin Millionaire', 'RICH', 'GRFK7sv4KhkMzJ7BXDUBy4PLyZVBeXuW1FeaT6Mnpump', '0.0098', 'ek84xpantx8e5v8yjantb3pjwktwija6cszaq619e9nw', null, 'https://cdn.dexscreener.com/cms/images/6dd608f8a999b1808f1d20a91a6838c38eb28ac9858ede0d365d15c84e5cb146?width=800&height=800&quality=90', 'others'),
('32', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:31:09.86652+00', 'Generational Wealth', 'wealth', 'GFRxeCdpomjJaYQEuwPDAPghyBD3H9zqnWY2HJPjpump', '0.0042', 'cf5vpldsrwxp1bekmwlohdzp7mzkevube2bh4m2w7ksr', null, 'https://cdn.dexscreener.com/cms/images/ddc8fe4ae6b2f29780bab8eabad2c8461f8a21b04f9c0f0713af1568be378caf?width=800&height=800&quality=90', 'others'),
('33', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:31:28.619357+00', 'Bet more', 'BET', '5CLSw4viyMLfnRHHxZpDF8CuZt5e1ceq1AJqd4GjAJNX', '0.0091', '52jvv57ca7epw5guvcs49fa9tics2vksm8x2xekfpe4x', null, 'https://cdn.dexscreener.com/cms/images/1ca0fc1ee6975c7167eaf44665b488273b50e6325dbf1acd506028c678221e32?width=800&height=800&quality=90', 'others'),
('34', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:31:45.919652+00', 'Liquid Solana Derivative 42069', 'LSD', 'DDti34vnkrCehR8fih6dTGpPuc3w8tL4XQ4QLQhc3xPa', '0.0739', '4mn64cnw83xatyz1sun57kkvtdhn2wkzifhvl3spbj9c', null, 'https://cdn.dexscreener.com/cms/images/b9093d88a9479fcb254e740540d382411f6831cc366bb0413497258bd71020f7?width=800&height=800&quality=90', 'others'),
('35', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:32:09.228409+00', 'BASED', 'BASED', 'Em4rcuhX6STfB7mxb66dUXDmZPYCjDiQFthvzSzpump', '0.024', '2kdetobhycwvu8m6c2nrpdgyaijloj3r3ahnk4sb4bzz', null, 'https://cdn.dexscreener.com/cms/images/7f2c0e3d33fb1b34134330422e6730fcb73af8e1ad14f9204687dba450873f5c?width=800&height=800&quality=90', 'others'),
('39', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:33:39.687692+00', 'Just a chill guy', 'CHILLGUY', 'Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump', '0.772', '93tjgwff5ac5thymi8c4wejvvqq4tumemuyw1leyz7bu', null, 'https://cdn.dexscreener.com/cms/images/20ae19e21d577f3aead6ae8722a7a3a66c5376cbf11f10d278807bef32551b46?width=800&height=800&quality=90', 'others'),
('40', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:34:04.961024+00', 'Goatseus Maximus', 'GOAT', 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump', '1.285', '9tb2ohu5p16bpbarqd3n27wnkf51ukfs8z1gzzldxvzw', null, 'https://cdn.dexscreener.com/cms/images/e857505d98436d21d13451a83c93ff4db36d0b53829af8070ddae75845d9b459?width=800&height=800&quality=90', 'ai'),
('41', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:35:49.567182+00', 'Peanut the Squirrel ', 'Pnut ', '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump', '2.37', '4azrpnefcj7iw28rju5auyeqhycvdcnm8cswyl51ay9i', null, 'https://cdn.dexscreener.com/cms/images/778498984ea5b6eb7c9d74e1e81a2547c88a41ae80f6c840c94a7c3b7829bcd5?width=800&height=800&quality=90', 'others'),
('42', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:36:18.141512+00', 'Purple Pepe', 'PURPE', 'HBoNJ5v8g71s2boRivrHnfSB5MVPLDHHyVjruPfhGkvL', '0.000311', 'cpoyfgana6mjrujsgexu9mpdghmtwd5rvyesgej4zofj', null, 'https://cdn.dexscreener.com/cms/images/015aa1aa85be3ba818d89cc5cc200db976beda650822ed7314512d6d7edce874?width=800&height=800&quality=90', 'others'),
('43', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:37:02.595843+00', 'Mumu the Bull', 'MUMU', '5LafQUrVco6o7KMz42eqVEJ9LW31StPyGjeeu5sKoMtA', '0.00012', 'fvmzrd1qc66zw8vprw15xn1n5owupqpqgnq5oh18mr4e', null, 'https://cdn.dexscreener.com/cms/images/0e4962f24453be79eafae2029ce44978ac6d273f5d228cd19c491d13dda2d9a1?width=800&height=800&quality=90', 'others'),
('44', '2025-11-23 14:05:33.834347+00', '2025-11-23 22:37:21.004718+00', 'First Convicted RACCON', 'FRED', 'CNvitvFnSM5ed6K28RUNSaAjqqz5tX1rA5HgaBN9pump', '0.3032', '8sqndszijlrlnxmfqbpzxbbhsujrjur7cefqcqzqz1hq', null, 'https://cdn.dexscreener.com/cms/images/dbc567efa09ecec1699657893b3804511027be983ecab60f8bcc246682df64d1?width=800&height=800&quality=90', 'others'),
('52', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:39:05.818754+00', 'SAD HAMSTER', 'HAMMY', '26KMQVgDUoB6rEfnJ51yAABWWJND8uMtpnQgsHQ64Udr', '0.07725', 'x131b3frgn4b8ue51eyvrnzwutubgom93uryrnteefy', null, 'https://cdn.dexscreener.com/cms/images/3a2cefbcb3d46edd0121bea5ed66414a9808f2cbafc02c71dc75fa7da72f24b3?width=800&height=800&quality=90', 'others'),
('53', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:39:18.925649+00', 'PeiPei', 'PEIPEI', 'H4PDo8ngWwC4quPTRWfTr2HorUQ2Ep4G3JVeJHMfkZAT', '0.00001679', '7unnmsqsaqnvjrlp85uetseb879e4eqsgyrvezrwps4x', null, 'https://cdn.dexscreener.com/cms/images/7672ca3cb76890bcbf581d2bfda69b119dde390f67147ca6c76506af62a6bc0d?width=800&height=800&quality=90', 'others'),
('54', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:39:32.299157+00', 'GIGACHAD', 'GIGA', '63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9', '0.09513', '4xxm4cdb6mescxm52xvyqknbzvdewwspdzrbctqvguar', null, 'https://cdn.dexscreener.com/cms/images/102ba1dee6cf6239b293dbd86e0e11ddf78e74cdce00030c4511096bd2480e26?width=800&height=800&quality=90', 'others'),
('55', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:39:45.783511+00', 'BOOK OF MEME', 'BOME', 'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82', '0.02689', 'dsuvc5qf5ljhhv5e2td184ixotsncnwj7i4jja4xsrmt', null, 'https://cdn.dexscreener.com/cms/images/1fdb1c93b76e5aed7324c2c541558fd75fe7ffb3d0d0fb9ee8370cbac5890e4e?width=800&height=800&quality=90', 'others'),
('56', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:39:58.394496+00', 'Chudjak', 'Chud', '6yjNqPzTSanBWSa6dxVEgTjePXBrZ2FoHLDQwYwEsyM6', '0.03484', '3cv7z8kn21m6ur6ntekikepcjtueag87ciu6cc3grnw6', null, 'https://cdn.dexscreener.com/cms/images/75f4420b3b1a0392607c2be76f47fc600c896d13e1c5a86a5d1836b9dec21c73?width=800&height=800&quality=90', 'others'),
('57', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:40:13.383563+00', 'PONKE', 'PONKE', '5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC', '0.8365', '5utwg3y3f5cx4ykodgtjwehdrx5hdkz5bzz72x8eq6ze', null, 'https://cdn.dexscreener.com/cms/images/cfbe2eabb540e7ba8651832435e968e12c9df2efb452e78358e64d8f73ae5760?width=800&height=800&quality=90', 'others'),
('58', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:40:25.016109+00', 'GameStop', 'GME', '8wXtPeU6557ETkp9WHFY1n1EcU6NxDvbAggHGsMYiHsB', '0.03189', '9tz6vykibdlyx2rngwc5tesu4pyve4jd6tm56352ugte', null, 'https://cdn.dexscreener.com/cms/images/5864d48c59829eef07ab7f03f9238c581dc97462b4520158aa40875291c55e46?width=800&height=800&quality=90', 'others'),
('59', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:40:36.8855+00', 'Smoking Chicken Fish', 'SCF', 'GiG7Hr61RVm4CSUxJmgiCoySFQtdiwxtqf64MsRppump', '0.1454', '6uspebbn94duylui4a2wo3azdcyozon1plgyu27jzpkx', null, 'https://cdn.dexscreener.com/cms/images/46ce6194d1499b2b5753dee357fdbb48748d68e2debb41d5f0b9d8ffeaa18bf9?width=800&height=800&quality=90', 'others'),
('60', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:40:49.72058+00', 'American Coin', 'USA', '69kdRLyP5DTRkpHraaSZAQbWmAwzF9guKjZfzMXzcbAs', '0.00002545', 'hkprctgbnh1j8xeqggzwhhvd3kwdudphqpqdp8vmay8b', null, 'https://cdn.dexscreener.com/cms/images/69e14ff4c3dd5337ae758f9a54334b23e1a6abcc1bf53bb0af35bc429c156ce0?width=800&height=800&quality=90', 'others'),
('61', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:41:03.293765+00', 'BILLY', 'BILLY', '3B5wuUrMEi5yATD7on46hKfej3pfmd7t1RKgrsN3pump', '0.2315', '9uww4c36hictgr6pzw9vfhr9vdxktz8na8jvnzqu35pj', null, 'https://cdn.dexscreener.com/cms/images/efdd477d5b91c13fc0f6be6116cd5a034c608192130cd8d23a229a4d424f1d2c?width=800&height=800&quality=90', 'dogs'),
('62', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:41:16.33548+00', 'Brainlet', 'BRAINLET', '8NNXWrWVctNw1UFeaBypffimTdcLCcD8XJzHvYsmgwpF', '0.05368', 'cw9dfotweuiwxyxvgnqfyhbryefgkvaqxegxkzg7d7x1', null, 'https://cdn.dexscreener.com/cms/images/0a2c499e8fe3db005ff62b125901113007d947af30529dcd1287672ae70896ff?width=800&height=800&quality=90', 'others'),
('63', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:41:33.232927+00', 'jeo boden', 'boden', '3psH1Mj1f7yUfaD5gh6Zj7epE8hhrMkMETgv5TshQA4o', '1.04', '6uybx1x8yucfj8ystpyizbyg7uqzaq2s46zwphumkjg5', null, 'https://cdn.dexscreener.com/cms/images/2a07d783053add242275dd421b119d5badd7279e18ffad720f44ba2eb47ff79b?width=800&height=800&quality=90', 'others'),
('64', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:44:32.248844+00', 'Dolan Duck', 'DOLAN', '4YK1njyeCkBuXG6phNtidJWKCbBhB659iwGkUJx98P5Z', '0.8965', 'a4xegghwrcyyrnzqhwdaneow9nrodsjdrhewcpcbuk4e', null, 'https://cdn.dexscreener.com/cms/images/6aae17c030e9d1930a5d1f3fece29f4030c0b2682564cc7beb3db3a536e29d0b?width=800&height=800&quality=90', 'others'),
('65', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:44:45.917032+00', 'nomnom', 'nomnom', '6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump', '0.09012', 'fhmjp6smtmd8gxkq8tw6azjbk3sdpktkksh6rtolax3m', null, 'https://cdn.dexscreener.com/cms/images/999b48f01f87ed7bac0394a36ec741aa80fd1a88a981465c4b51af3d59523013?width=800&height=800&quality=90', 'others'),
('67', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:47:03.598034+00', 'Crashout', 'Crashout', '6JGSHS9GrE9uG8ix63w3DPMYHrgrJ6J4QyHbBhAepump', '0.0139', '8guix1wqrn8usufml54drhcclxlytudstkewhowdd2ms', null, 'https://cdn.dexscreener.com/cms/images/281408bef53897e49f8ee0260d224f9c7ed821e132aba0c9ebbc85c70b83628a?width=800&height=800&quality=90', 'others'),
('68', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:47:16.652768+00', 'STAN', 'STAN', 'CQSzJzwW5H1oyWrp6QhfUKYYwyovbSiVDKnAxNfb1tJC', '0.03948', 'fdawcghyqyua2awm1bb2mlzcrude3flwkywb2duz4vtg', null, 'https://cdn.dexscreener.com/cms/images/6b1b333f7dc75b84a86da31bb49aa053b6005b1c637153bb54c432f91df3d51b?width=800&height=800&quality=90', 'others'),
('69', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:47:30.867789+00', 'Peng', 'PENG', 'A3eME5CetyZPBoWbRUwY3tSe25S6tb18ba9ZPbWk9eFJ', '2.14', 'axbddimk9hrplmpm7k6ncpc1grargxqhnejfp2lvngr6', null, 'https://cdn.dexscreener.com/cms/images/ece2ff8a284707ff2189f1691f801db57bd80fc7b4eba10876909cf5270c07bc?width=800&height=800&quality=90', 'others'),
('71', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:48:30.002983+00', 'littlemanyu', 'Manyu', 'CS7LmjtuugEUWtFgfyto79nrksKigv7Fdcp9qPuigdLs', '0.03651', '6pcjndxqq4yikwgvd12bsptgmijhe5qze7umuans73er', null, 'https://cdn.dexscreener.com/cms/images/9a4b6da6a4ff6a60abd27fd5584502003461ef574197f90f6625a613d43f1b2b?width=800&height=800&quality=90', 'others'),
('72', '2025-11-23 14:12:51.729544+00', '2025-11-23 22:48:41.7341+00', 'gomu gator', 'gomu', 'Bx74hpFiaiBbSonrjyqxjGfAA7gRxM2CeKiy31uN6biR', '0.006668', '2h282gdoedejwwtxtmfpxvmdvpqkb7rvf24b2gws1cg4', null, 'https://cdn.dexscreener.com/cms/images/e07325e24f5f788c767d120626fb8c2cd0c9e72836e3aa229f7bac1b2ba4726a?width=800&height=800&quality=90', 'others'),
('73', '2025-11-23 14:25:41.394471+00', '2025-11-23 22:48:55.636256+00', 'harold', 'harold', 'EjmDTt8G3T725eFSV7oWmGD8J848guo3LZ1EB3RfwGSw', '0.04838', '5wuxqapq7ezfoo2z6ql3svxa9djroxqk2fsafurnwvqy', null, 'https://cdn.dexscreener.com/cms/images/aa0631678bcb4f68e52ad9fad6fbe778a9731cd6925349fd18f41253aa428f1f?width=800&height=800&quality=90', 'others'),
('74', '2025-11-23 23:03:15.071665+00', '2025-11-23 23:04:00.805303+00', 'Nigga Butt Token', 'NiggaButt', '8fZL148nnC168RAVCZh4PkjvMZmxMEfMLDhoziWVPnqf', '0.0124', 'bcdfb7vnroy57exbxaybnyl9thsvimu1umow1acxccfv', null, 'https://cdn.dexscreener.com/cms/images/756ed77faee9140685be6749b00021e1c0049f51ecc843a64d6aae3e84ec492e?width=800&height=800&quality=90', 'others');

-- Reset sequence to max id + 1
SELECT setval('tokens_id_seq', (SELECT MAX(id) FROM public.tokens) + 1);
