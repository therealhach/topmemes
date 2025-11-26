import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pairAddress = searchParams.get('pair');
  const tokenAddress = searchParams.get('token');
  const chain = searchParams.get('chain') || 'solana';

  try {
    let url: string;

    if (pairAddress) {
      url = `https://api.dexscreener.com/latest/dex/pairs/${chain}/${pairAddress}`;
    } else if (tokenAddress) {
      url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
    } else {
      return NextResponse.json({ error: 'Missing pair or token address' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `DexScreener API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('DexScreener proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from DexScreener' },
      { status: 500 }
    );
  }
}
