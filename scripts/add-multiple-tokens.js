#!/usr/bin/env node

/**
 * Script to add multiple tokens to the database from DexScreener links
 * Usage: node scripts/add-multiple-tokens.js [--category <category>] <url1> <url2> <url3> ...
 * Or: node scripts/add-multiple-tokens.js --file <path-to-file>
 *
 * Supported chains: solana, ethereum
 * Categories: dogs, cats, ai, others (default: others)
 *
 * Example with URLs:
 *   node scripts/add-multiple-tokens.js --category cats \
 *     https://dexscreener.com/solana/abc123 \
 *     https://dexscreener.com/ethereum/0xdef456
 *
 * Example with file (using category headers):
 *   node scripts/add-multiple-tokens.js --file tokens.txt
 *
 * File format with category headers:
 *   #cats
 *   https://dexscreener.com/solana/abc123
 *   https://dexscreener.com/ethereum/0xdef456
 *   #dogs
 *   https://dexscreener.com/solana/ghi789
 *   #ai
 *   https://dexscreener.com/ethereum/0xjkl012
 *   #others
 *   https://dexscreener.com/solana/mno345
 */

const fs = require('fs');
const path = require('path');

// Get arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Error: Please provide DexScreener URLs or a file path');
  console.log('\nUsage:');
  console.log('  node scripts/add-multiple-tokens.js [--category <category>] <url1> <url2> ...');
  console.log('  node scripts/add-multiple-tokens.js [--category <category>] --file <path-to-file>');
  console.log('\nCategories: dogs, cats, ai, others (default: others)');
  console.log('\nExample:');
  console.log('  node scripts/add-multiple-tokens.js --category cats \\');
  console.log('    https://dexscreener.com/solana/abc123 \\');
  console.log('    https://dexscreener.com/solana/def456');
  console.log('\nOr create a file with one URL per line:');
  console.log('  node scripts/add-multiple-tokens.js --category ai --file tokens.txt');
  process.exit(1);
}

let tokenEntries = []; // Array of { url, category }
const validCategories = ['dogs', 'cats', 'ai', 'others'];
let defaultCategory = 'others';
let remainingArgs = [...args];

// Check if using --category option (for command line URLs)
if (remainingArgs[0] === '--category' || remainingArgs[0] === '-c') {
  if (!remainingArgs[1]) {
    console.error('❌ Error: Please provide a category after --category');
    console.log('Valid categories: dogs, cats, ai, others');
    process.exit(1);
  }
  if (!validCategories.includes(remainingArgs[1].toLowerCase())) {
    console.error(`❌ Error: Invalid category "${remainingArgs[1]}"`);
    console.log('Valid categories: dogs, cats, ai, others');
    process.exit(1);
  }
  defaultCategory = remainingArgs[1].toLowerCase();
  remainingArgs = remainingArgs.slice(2);
}

// Check if using --file option
if (remainingArgs[0] === '--file' || remainingArgs[0] === '-f') {
  if (!remainingArgs[1]) {
    console.error('❌ Error: Please provide a file path after --file');
    process.exit(1);
  }

  const filePath = remainingArgs[1];

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }

  // Read URLs from file with category headers
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  let currentCategory = defaultCategory;

  fileContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return; // Skip empty lines

    // Check if it's a category header (#dogs, #cats, #ai, #others)
    if (trimmedLine.startsWith('#')) {
      const categoryName = trimmedLine.slice(1).toLowerCase();
      if (validCategories.includes(categoryName)) {
        currentCategory = categoryName;
        console.log(`📂 Switching to category: ${currentCategory}`);
      }
      // Skip other comments that aren't valid categories
      return;
    }

    // It's a URL
    tokenEntries.push({ url: trimmedLine, category: currentCategory });
  });
} else {
  // Use URLs from arguments with default category
  remainingArgs.forEach(url => {
    tokenEntries.push({ url, category: defaultCategory });
  });
}

console.log(`\n📋 Found ${tokenEntries.length} token(s) to add\n`);

// Process each token entry
const processToken = async (entry, index, total) => {
  const { url, category } = entry;
  console.log(`\n[${index + 1}/${total}] Processing: ${url}`);
  console.log(`📂 Category: ${category}`);
  console.log('─'.repeat(60));

  // Extract chain and pair address from URL (supports solana and ethereum)
  const urlMatch = url.match(/dexscreener\.com\/(solana|ethereum)\/([a-zA-Z0-9]+)/i);

  if (!urlMatch) {
    console.error('❌ Invalid URL format - skipping (supported chains: solana, ethereum)');
    return null;
  }

  const chain = urlMatch[1].toLowerCase();
  const pairAddress = urlMatch[2];

  try {
    console.log(`🔍 Fetching data from ${chain}...`);

    const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/${chain}/${pairAddress}`);
    const data = await response.json();

    if (!data.pair) {
      console.error('❌ Could not find pair data - skipping');
      return null;
    }

    const pair = data.pair;
    const token = pair.baseToken;

    const tokenName = token.name || 'Unknown';
    const tokenSymbol = token.symbol || 'UNKNOWN';
    const tokenAddress = token.address;
    const logoUrl = pair.info?.imageUrl || `https://dd.dexscreener.com/ds-data/tokens/${chain}/${tokenAddress}.png`;

    console.log(`✅ ${tokenName} (${tokenSymbol}) [${chain}]`);
    console.log(`   Address: ${tokenAddress}`);
    console.log(`   Price: $${pair.priceUsd || 'N/A'}`);
    console.log(`   Market Cap: $${pair.fdv ? Number(pair.fdv).toLocaleString() : 'N/A'}`);

    return {
      tokenName,
      tokenSymbol,
      tokenAddress,
      pairAddress,
      logoUrl,
      category,
      chain
    };
  } catch (error) {
    console.error(`❌ Error: ${error.message} - skipping`);
    return null;
  }
};

// Process all tokens
const processAllTokens = async () => {
  const results = [];

  for (let i = 0; i < tokenEntries.length; i++) {
    const result = await processToken(tokenEntries[i], i, tokenEntries.length);
    if (result) {
      results.push(result);
    }

    // Small delay to avoid rate limiting
    if (i < tokenEntries.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  if (results.length === 0) {
    console.log('\n❌ No valid tokens found');
    process.exit(1);
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`✅ Successfully processed ${results.length} token(s)`);
  console.log('═'.repeat(60));

  // Group results by category for summary
  const categoryCounts = results.reduce((acc, token) => {
    acc[token.category] = (acc[token.category] || 0) + 1;
    return acc;
  }, {});

  // Generate combined SQL
  const timestamp = Date.now();
  const sql = `-- Add multiple tokens to the database
-- Generated on ${new Date().toISOString()}
-- Total tokens: ${results.length}
-- Categories: ${Object.entries(categoryCounts).map(([cat, count]) => `${cat}: ${count}`).join(', ')}

-- Fix the sequence for the ID column (prevents duplicate key errors)
SELECT setval('tokens_id_seq', (SELECT MAX(id) FROM tokens));

${results.map(token => `
-- ${token.tokenName} (${token.tokenSymbol}) [${token.category}] [${token.chain}]
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
    '${token.tokenName.replace(/'/g, "''")}',
    '${token.tokenSymbol.replace(/'/g, "''")}',
    '${token.tokenAddress}',
    0,
    '${token.pairAddress}',
    NULL,
    '${token.logoUrl}',
    '${token.category}',
    '${token.chain}'
)
ON CONFLICT (token_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    pair_address = EXCLUDED.pair_address,
    logo_url = EXCLUDED.logo_url,
    category = EXCLUDED.category,
    chain = EXCLUDED.chain;
`).join('\n')}`;

  // Save SQL to file
  const filename = `add-multiple-tokens-${timestamp}.sql`;
  const filepath = path.join(__dirname, '..', 'supabase', filename);

  fs.writeFileSync(filepath, sql);

  console.log(`\n📝 SQL file created: supabase/${filename}`);
  console.log('\n📋 Tokens added by category:');

  // Group and display by category
  const grouped = results.reduce((acc, token) => {
    if (!acc[token.category]) acc[token.category] = [];
    acc[token.category].push(token);
    return acc;
  }, {});

  Object.entries(grouped).forEach(([cat, tokens]) => {
    const emoji = cat === 'dogs' ? '🐕' : cat === 'cats' ? '🐱' : cat === 'ai' ? '🤖' : '✨';
    console.log(`\n   ${emoji} ${cat.toUpperCase()} (${tokens.length}):`);
    tokens.forEach(token => {
      console.log(`      - ${token.tokenName} (${token.tokenSymbol})`);
    });
  });

  console.log('\n📋 Next steps:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log(`3. Copy and paste the contents from supabase/${filename}`);
  console.log('4. Click Run');
  console.log(`\n✨ All ${results.length} token(s) will be added to your table!`);
};

processAllTokens().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
