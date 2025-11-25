# Token Management Scripts

## 1. Add Single Token Script

Automatically fetch token data from DexScreener and generate SQL to add it to your database.

### Usage

```bash
node scripts/add-token.js <dexscreener-url>
```

### Example

```bash
node scripts/add-token.js https://dexscreener.com/solana/83g6vzjzlrcnhbslatj94vcprimyyqwun6zfl11mcadl
```

### What it does

1. ✅ Fetches token data from DexScreener API
2. ✅ Extracts token name, symbol, address, pair address, and logo
3. ✅ Generates SQL file in `supabase/` directory
4. ✅ Shows current price and market cap info

### Output

The script will create a SQL file like `supabase/add-nub-1234567890.sql` with:

```sql
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
    '83G6VzJzLRCnHBsLATj94VCpRimyyqwuN6ZfL11McADL',
    NULL,
    'https://dd.dexscreener.com/ds-data/tokens/solana/...'
)
ON CONFLICT (token_address) DO UPDATE SET
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url;
```

### Next Steps

After running the script:

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the contents from the generated SQL file
4. Click **Run**
5. The token will appear in your table with live data!

### Troubleshooting

**Error: Invalid DexScreener URL format**
- Make sure the URL follows this format: `https://dexscreener.com/solana/<pair-address>`

**Error: Could not find pair data**
- The pair address might be incorrect or the token might not exist on DexScreener

**Error: Please provide a DexScreener URL**
- You forgot to include the URL as an argument

---

## 2. Add Multiple Tokens Script

Add multiple tokens at once from DexScreener links.

### Usage

**Option 1: Pass URLs directly**
```bash
node scripts/add-multiple-tokens.js \
  https://dexscreener.com/solana/abc123 \
  https://dexscreener.com/solana/def456 \
  https://dexscreener.com/solana/ghi789
```

**Option 2: Use a text file**
```bash
node scripts/add-multiple-tokens.js --file tokens.txt
```

### File Format (tokens.txt)

```txt
# Example tokens file
# Add one DexScreener URL per line
# Lines starting with # are ignored

https://dexscreener.com/solana/83g6vzjzlrcnhbslatj94vcprimyyqwun6zfl11mcadl
https://dexscreener.com/solana/another-pair-address
https://dexscreener.com/solana/yet-another-pair-address
```

### What it does

1. ✅ Fetches data for all tokens
2. ✅ Shows progress for each token
3. ✅ Generates a single SQL file with all tokens
4. ✅ Includes sequence fix to prevent ID conflicts
5. ✅ Handles errors gracefully (skips invalid tokens)
6. ✅ Adds 500ms delay between requests to avoid rate limiting

### Example Output

```
📋 Found 3 token(s) to add

[1/3] Processing: https://dexscreener.com/solana/abc123
────────────────────────────────────────────────────────────
🔍 Fetching data...
✅ nubcat (nub)
   Address: GtDZKAqvMZMnti46ZewMiXCa4oXF4bZxwQPoKzXPFxZn
   Price: $0.009
   Market Cap: $9,000,000

[2/3] Processing: https://dexscreener.com/solana/def456
────────────────────────────────────────────────────────────
🔍 Fetching data...
✅ dogwifhat (WIF)
   Address: EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm
   Price: $0.34
   Market Cap: $340,000,000

════════════════════════════════════════════════════════════
✅ Successfully processed 2 token(s)
════════════════════════════════════════════════════════════

📝 SQL file created: supabase/add-multiple-tokens-1701234567.sql

📋 Tokens added:
   1. nubcat (nub)
   2. dogwifhat (WIF)

📋 Next steps:
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents from supabase/add-multiple-tokens-1701234567.sql
4. Click Run

✨ All 2 token(s) will be added to your table!
```

### Advantages

- 🚀 **Batch processing**: Add multiple tokens in one go
- 📝 **Single SQL file**: All tokens in one file for easy execution
- 🛡️ **Error handling**: Continues even if one token fails
- ⏱️ **Rate limiting**: Built-in delays to respect API limits
- 💾 **Flexible input**: Use command line or text file
