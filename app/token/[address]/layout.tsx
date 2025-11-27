import { Metadata } from 'next';
import { getSupabaseServer } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type TokenRow = Database['public']['Tables']['tokens']['Row'];

type Props = {
  params: Promise<{ address: string }>;
  children: React.ReactNode;
};

// Fetch token data server-side
async function getTokenData(address: string): Promise<TokenRow | null> {
  const supabase = getSupabaseServer();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from('tokens')
    .select('*')
    .eq('token_address', address)
    .single();

  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const tokenData = await getTokenData(address);

  const tokenName = tokenData?.token_name || 'Unknown Token';
  const tokenSymbol = tokenData?.token_symbol || 'UNKNOWN';
  const siteUrl = 'https://www.topmemes.io';
  const ogImageUrl = `${siteUrl}/api/og/token?address=${address}`;

  const title = `${tokenName} (${tokenSymbol}) Price & Chart`;
  const description = `Track ${tokenName} ($${tokenSymbol}) live price, market cap, volume, and chart on TopMemes.io. Real-time memecoin analytics and trading.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/token/${address}`,
      siteName: 'TopMemes.io',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${tokenName} (${tokenSymbol}) - TopMemes.io`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@topmemes_io',
    },
    alternates: {
      canonical: `${siteUrl}/token/${address}`,
    },
  };
}

export default function TokenLayout({ children }: Props) {
  return children;
}
