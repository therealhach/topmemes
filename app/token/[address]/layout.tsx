import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Props = {
  params: Promise<{ address: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const baseUrl = 'https://www.topmemes.io';

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: token } = await supabase
      .from('tokens')
      .select('token_name, token_symbol, logo_url')
      .eq('token_address', address)
      .single();

    if (token) {
      const title = `${token.token_name} (${token.token_symbol}) Price, Chart & Info`;
      const description = `Live ${token.token_name} (${token.token_symbol}) price chart, market cap, trading volume, and analytics. Swap ${token.token_symbol} on Solana via Jupiter DEX.`;

      return {
        title,
        description,
        keywords: [
          token.token_name,
          token.token_symbol,
          `${token.token_symbol} price`,
          `${token.token_symbol} chart`,
          `${token.token_name} memecoin`,
          `buy ${token.token_symbol}`,
          'solana token',
          'memecoin',
        ],
        openGraph: {
          title,
          description,
          url: `${baseUrl}/token/${address}`,
          images: token.logo_url ? [{ url: token.logo_url, alt: token.token_name }] : undefined,
        },
        twitter: {
          card: 'summary',
          title: `${token.token_name} (${token.token_symbol}) - Live Price & Chart`,
          description,
          images: token.logo_url ? [token.logo_url] : undefined,
        },
        alternates: {
          canonical: `${baseUrl}/token/${address}`,
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  // Fallback metadata
  return {
    title: 'Token Details',
    description: 'View token price, chart, and trading information on TopMemes.io',
    alternates: {
      canonical: `${baseUrl}/token/${address}`,
    },
  };
}

export default function TokenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
