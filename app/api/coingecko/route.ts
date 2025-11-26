import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
const COINGECKO_BASE_URL = COINGECKO_API_KEY
  ? 'https://pro-api.coingecko.com/api/v3'
  : 'https://api.coingecko.com/api/v3';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address'); // single contract address
  const platform = searchParams.get('platform') || 'solana'; // solana or ethereum

  try {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    if (COINGECKO_API_KEY) {
      headers['x-cg-pro-api-key'] = COINGECKO_API_KEY;
    }

    if (!address) {
      return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
    }

    // Use coins/{platform}/contract/{address} endpoint for full token data
    const url = `${COINGECKO_BASE_URL}/coins/${platform}/contract/${address}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limited', rateLimited: true }, { status: 429 });
      }
      if (response.status === 404) {
        return NextResponse.json({ error: 'Token not found', notFound: true }, { status: 404 });
      }
      return NextResponse.json(
        { error: `CoinGecko API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('CoinGecko proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from CoinGecko' },
      { status: 500 }
    );
  }
}
