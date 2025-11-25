# Setup Guide - Token ATH Admin System

## Overview

This application allows you to display token data with admin-only ATH (All-Time High) editing capabilities. Only the wallet address `7enA39APuzDhDD1da7nVmg1DjzJrVULBHN579VGEzFNU` can edit ATH values, with server-side verification for security.

## Features

- 🔒 **Secure Admin Access**: Only authorized wallet can edit ATH values
- 🔐 **Server-Side Verification**: Wallet signature verification on backend
- 💾 **Supabase Database**: Persistent storage for token data
- 📊 **Live Market Data**: Real-time price, volume, and market cap from DexScreener
- 🎨 **Beautiful UI**: Modern design with wallet integration

## Setup Instructions

### 1. Configure Supabase Database

1. **Create a Supabase Account**
   - Visit [https://supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your Credentials**
   - After project creation, go to **Settings → API**
   - Copy your **Project URL** (looks like `https://xxxxx.supabase.co`)
   - Copy your **anon/public key**

3. **Update Environment Variables**
   - Open or create `.env.local` in the project root
   - Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   NEXT_PUBLIC_HELIUS_API_KEY=your-helius-api-key-optional
   ```

4. **Create Database Table**
   - In Supabase dashboard, go to **SQL Editor**
   - Open the file `supabase/schema.sql` from this project
   - Copy all the SQL code
   - Paste it into the SQL Editor and click **Run**
   - This will:
     - Create the `tokens` table with proper schema
     - Set up Row Level Security (RLS) policies
     - Insert initial tokens (BONK, WIF, MYRO)
     - Create automatic timestamp triggers

5. **Verify Database Setup**
   - Go to **Table Editor → tokens**
   - You should see 3 tokens already inserted
   - The `ath_price` column should be set to 0 (ready for manual input)

6. **Restart Development Server**
   ```bash
   # Stop the current server (Ctrl+C if running)
   npm run dev
   ```

7. **Verify Application**
   - Open http://localhost:3000
   - You should see the token table with live market data
   - Market data (price, volume, mcap) comes from DexScreener API
   - ATH values come from your Supabase database

### 2. Using Admin Features

**Only wallet `7enA39APuzDhDD1da7nVmg1DjzJrVULBHN579VGEzFNU` can edit ATH values.**

1. **Connect Admin Wallet**
   - Click "Select Wallet" button in the top right
   - Connect with Phantom or other Solana wallet
   - If you're using the admin wallet, you'll see "Admin Mode Active"

2. **Edit ATH Values**
   - Click the "Edit ATH" button next to any token
   - Enter the new ATH price value
   - Click "Save" to submit
   - The wallet will prompt you to sign the transaction
   - After signing, the value updates in the database

3. **Security Notes**
   - Signature verification happens **server-side** in `/api/update-ath`
   - Non-admin wallets cannot bypass this check
   - Each update requires a fresh wallet signature
   - The message includes timestamp to prevent replay attacks

## Adding New Tokens

### Via Supabase Dashboard
1. Go to **Table Editor → tokens**
2. Click **Insert row**
3. Fill in required fields:
   - `token_name`: Full name (e.g., "Bonk")
   - `token_symbol`: Symbol (e.g., "BONK")
   - `token_address`: Solana address (required)
   - `ath_price`: Set to 0 initially
   - `pair_address`: Optional DexScreener pair address
   - `coingecko_id`: Optional CoinGecko ID
4. Save

### Via SQL
Run this in the SQL Editor:

```sql
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    token_address,
    ath_price,
    pair_address,
    coingecko_id
) VALUES (
    'Solana',
    'SOL',
    'So11111111111111111111111111111111111111112',
    0,
    NULL,
    'solana'
);
```

## How It Works

### Architecture

1. **Frontend** (`components/TokenTable.tsx`)
   - Displays token data with live market info
   - Shows "Edit ATH" button only for admin wallet
   - Handles wallet connection via Solana Wallet Adapter

2. **Backend API** (`app/api/update-ath/route.ts`)
   - Receives ATH update requests
   - Verifies wallet signature using `tweetnacl`
   - Checks if wallet matches admin address
   - Updates Supabase database only if verified

3. **Database** (Supabase)
   - Stores token metadata and ATH values
   - Live market data is fetched from DexScreener API
   - ATH values are stored persistently

### Data Flow

```
User clicks "Edit ATH"
  → Input new value
  → Click "Save"
  → Wallet signs message
  → POST to /api/update-ath
  → Server verifies signature
  → Server checks wallet address
  → Update Supabase if authorized
  → Return success/error
  → Update UI
```

## Changing Admin Wallet

To change the admin wallet address:

1. Update in `components/TokenTable.tsx`:
   ```typescript
   const ADMIN_WALLET = 'YOUR_NEW_WALLET_ADDRESS';
   ```

2. Update in `app/api/update-ath/route.ts`:
   ```typescript
   const ADMIN_WALLET = 'YOUR_NEW_WALLET_ADDRESS';
   ```

3. Update in `app/api/verify-wallet/route.ts`:
   ```typescript
   const ADMIN_WALLET = 'YOUR_NEW_WALLET_ADDRESS';
   ```

## Troubleshooting

### "Unauthorized: Not admin wallet" error
- Verify you're connected with wallet: `7enA39APuzDhDD1da7nVmg1DjzJrVULBHN579VGEzFNU`
- Check that the wallet address matches exactly in all 3 files
- Try disconnecting and reconnecting your wallet

### "Invalid signature" error
- Make sure you approved the signature request in your wallet
- Try disconnecting wallet and reconnecting
- Clear browser cache and reload

### Edit button not showing
- Ensure you're connected with the admin wallet
- Check browser console for errors
- Verify wallet connection is working

### Database not updating
- Check Supabase credentials in `.env.local`
- Verify RLS policies are set up correctly
- Check Supabase logs for errors

### No market data showing
- DexScreener API might be rate limiting
- Check token addresses are correct
- Verify `pair_address` is set for better results

## File Structure

```
├── app/
│   ├── api/
│   │   ├── update-ath/route.ts    # Server-side ATH update with verification
│   │   └── verify-wallet/route.ts # Wallet verification endpoint
│   ├── page.tsx                   # Main page
│   └── layout.tsx                 # Layout with wallet provider
├── components/
│   ├── TokenTable.tsx             # Main table component with edit UI
│   └── WalletProvider.tsx         # Solana wallet adapter setup
├── lib/
│   ├── helius.ts                  # Token data fetching from APIs
│   ├── supabase.ts                # Supabase client
│   └── database.types.ts          # TypeScript types
├── supabase/
│   └── schema.sql                 # Database schema
└── .env.local                     # Environment variables
```

## Security Features

✅ **Server-Side Verification**: All ATH updates verified on backend
✅ **Cryptographic Signatures**: Uses Ed25519 signatures via tweetnacl
✅ **Wallet Address Check**: Only specific wallet can update
✅ **Timestamp in Message**: Prevents replay attacks
✅ **Row Level Security**: Supabase RLS policies protect data
✅ **No Client-Side Bypass**: Cannot manipulate values from browser

## Support

For issues or questions:
- Review Supabase docs: https://supabase.com/docs
- Review Solana wallet adapter docs: https://github.com/anza-xyz/wallet-adapter
- Check Next.js API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
