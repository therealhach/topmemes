# Top Memes - Token Tracker

A Next.js application with Phantom wallet integration and Supabase database for tracking meme token statistics.

## Features

- **Phantom Wallet Integration**: Connect your Phantom wallet with a single click
- **Supabase Database**: Real-time token data storage and retrieval
- **Token Tracking Table**: Display key metrics for meme tokens including:
  - Token Name
  - Current Market Cap
  - Peak Market Cap
  - Percentage to Gain Peak
  - 1-hour Price Change
  - 24-hour Price Change
  - 24-hour Trading Volume

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Solana Wallet Adapter
- Phantom Wallet Integration
- Supabase (PostgreSQL Database)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### Option A: Using Supabase Cloud

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to Settings > API
3. Copy your project URL and anon/public key
4. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
```

5. Go to the SQL Editor in your Supabase dashboard
6. Copy the contents of `supabase/schema.sql` and run it in the SQL Editor
7. This will create the `tokens` table with sample data

#### Option B: Using Mock Data

If you don't configure Supabase, the app will automatically fall back to mock data, which is perfect for development and testing.

### 3. Run Development Server

```bash
npm run dev
```

### 4. Open Browser

Navigate to [http://localhost:3000](http://localhost:3000)

### 5. Connect Wallet

Click the "Select Wallet" button in the top right to connect your Phantom wallet

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with wallet provider
│   ├── page.tsx            # Main page with table
│   └── globals.css         # Global styles
├── components/
│   ├── WalletProvider.tsx  # Wallet context provider
│   └── TokenTable.tsx      # Token data table component
├── lib/
│   ├── supabase.ts         # Supabase client configuration
│   └── database.types.ts   # TypeScript types for database
├── supabase/
│   └── schema.sql          # Database schema and seed data
└── next.config.ts          # Next.js configuration
```

## Database Schema

The `tokens` table has the following structure:

| Column                    | Type      | Description                |
|---------------------------|-----------|----------------------------|
| id                        | BIGSERIAL | Primary key                |
| created_at                | TIMESTAMP | Creation timestamp         |
| updated_at                | TIMESTAMP | Last update timestamp      |
| token_name                | TEXT      | Full token name            |
| token_symbol              | TEXT      | Token symbol (e.g., BONK)  |
| current_mcap              | BIGINT    | Current market cap         |
| peak_mcap                 | BIGINT    | Peak market cap            |
| percent_to_gain_peak      | NUMERIC   | % to reach peak            |
| one_hour_change           | NUMERIC   | 1-hour price change %      |
| twenty_four_hour_change   | NUMERIC   | 24-hour price change %     |
| twenty_four_hour_volume   | BIGINT    | 24-hour trading volume     |
| token_address             | TEXT      | Solana token address       |
| logo_url                  | TEXT      | Token logo URL (optional)  |

## Adding/Updating Token Data

### Via Supabase Dashboard

1. Go to your Supabase project
2. Navigate to Table Editor > tokens
3. Add or edit rows directly in the UI

### Via SQL

```sql
INSERT INTO public.tokens (
    token_name,
    token_symbol,
    current_mcap,
    peak_mcap,
    percent_to_gain_peak,
    one_hour_change,
    twenty_four_hour_change,
    twenty_four_hour_volume,
    token_address
) VALUES (
    'Your Token',
    'TOKEN',
    1000000000,
    2000000000,
    100.00,
    5.25,
    12.50,
    50000000,
    'YourSolanaTokenAddress'
);
```

### Via API

You can also create an API endpoint to update token data programmatically using CoinGecko, Jupiter, or other data sources.

## Customization

### Styling

The application uses Tailwind CSS. Customize:
- Gradient backgrounds in `page.tsx`
- Table colors in `TokenTable.tsx`
- Wallet button appearance

### Data Sources

Integrate real-time data by:
1. Creating a server-side API route
2. Fetching from CoinGecko, Jupiter, or DexScreener APIs
3. Updating Supabase tables with fresh data
4. Setting up cron jobs for automatic updates

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## Security Notes

- Row Level Security (RLS) is enabled on the tokens table
- Public read access is allowed
- Write access requires authentication
- Never expose your Supabase service role key in client-side code
- The anon key is safe to use in the browser

## Notes

- Make sure you have Phantom wallet installed in your browser
- The app connects to Solana mainnet-beta by default
- Token data falls back to mock data if Supabase is not configured
- The app gracefully handles missing Supabase credentials

## License

MIT
