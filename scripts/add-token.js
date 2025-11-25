#!/usr/bin/env node

/**
 * Script to add a token to the database from a DexScreener link
 * Usage: node scripts/add-token.js <dexscreener-url> [category]
 * Example: node scripts/add-token.js https://dexscreener.com/solana/83g6vzjzlrcnhbslatj94vcprimyyqwun6zfl11mcadl cats
 * Example: node scripts/add-token.js https://dexscreener.com/ethereum/0x1234567890abcdef ai
 *
 * Supported chains: solana, ethereum
 * Categories: dogs, cats, ai, others (default: others)
 */

const fs = require('fs');
const path = require('path');

// Supported chains
const supportedChains = ['solana', 'ethereum'];

// Get the DexScreener URL from command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Error: Please provide a DexScreener URL');
  console.log('Usage: node scripts/add-token.js <dexscreener-url> [category]');
  console.log('Example (Solana): node scripts/add-token.js https://dexscreener.com/solana/83g6vzjzlrcnhbslatj94vcprimyyqwun6zfl11mcadl cats');
  console.log('Example (Ethereum): node scripts/add-token.js https://dexscreener.com/ethereum/0x1234567890abcdef ai');
  console.log('\nSupported chains: solana, ethereum');
  console.log('Categories: dogs, cats, ai, others (default: others)');
  process.exit(1);
}

const dexscreenerUrl = args[0];
const validCategories = ['dogs', 'cats', 'ai', 'others'];
const category = args[1] && validCategories.includes(args[1].toLowerCase()) ? args[1].toLowerCase() : 'others';

// Extract chain and pair address from URL
const urlMatch = dexscreenerUrl.match(/dexscreener\.com\/(solana|ethereum)\/([a-zA-Z0-9]+)/i);

if (!urlMatch) {
  console.error('❌ Error: Invalid DexScreener URL format');
  console.log('Expected format: https://dexscreener.com/<chain>/<pair-address>');
  console.log('Supported chains: solana, ethereum');
  process.exit(1);
}

const chain = urlMatch[1].toLowerCase();
const pairAddress = urlMatch[2];

console.log('🔍 Fetching token data from DexScreener...');
console.log(`⛓️  Chain: ${chain}`);
console.log(`📍 Pair Address: ${pairAddress}`);
console.log(`📂 Category: ${category}`);

// Fetch data from DexScreener API
fetch(`https://api.dexscreener.com/latest/dex/pairs/${chain}/${pairAddress}`)
  .then(response => response.json())
  .then(data => {
    if (!data.pair) {
      console.error('❌ Error: Could not find pair data');
      process.exit(1);
    }

    const pair = data.pair;
    const token = pair.baseToken;

    // Extract token information
    const tokenName = token.name || 'Unknown';
    const tokenSymbol = token.symbol || 'UNKNOWN';
    const tokenAddress = token.address;
    const logoUrl = pair.info?.imageUrl || `https://dd.dexscreener.com/ds-data/tokens/${chain}/${tokenAddress}.png`;

    console.log('\n✅ Token found!');
    console.log(`📛 Name: ${tokenName}`);
    console.log(`🏷️  Symbol: ${tokenSymbol}`);
    console.log(`🔑 Address: ${tokenAddress}`);
    console.log(`🖼️  Logo: ${logoUrl}`);
    console.log(`💰 Current Price: $${pair.priceUsd || 'N/A'}`);
    console.log(`📊 Market Cap: $${pair.fdv ? Number(pair.fdv).toLocaleString() : 'N/A'}`);

    // Generate SQL
    const sql = `-- Add ${tokenName} (${tokenSymbol}) token to the database
-- Generated on ${new Date().toISOString()}
-- Chain: ${chain}
-- Category: ${category}

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
    '${tokenName.replace(/'/g, "''")}',
    '${tokenSymbol.replace(/'/g, "''")}',
    '${tokenAddress}',
    0,
    '${pairAddress}',
    NULL,
    '${logoUrl}',
    '${category}',
    '${chain}'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category,
    chain = EXCLUDED.chain;
`;

    // Save SQL to file
    const filename = `add-${tokenSymbol.toLowerCase()}-${Date.now()}.sql`;
    const filepath = path.join(__dirname, '..', 'supabase', filename);

    fs.writeFileSync(filepath, sql);

    console.log(`\n📝 SQL file created: supabase/${filename}`);
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log(`3. Copy and paste the contents from supabase/${filename}`);
    console.log('4. Click Run');
    console.log('\n✨ The token will appear in your table with live data!');
  })
  .catch(error => {
    console.error('❌ Error fetching data:', error.message);
    process.exit(1);
  });
