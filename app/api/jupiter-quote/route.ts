import { NextRequest, NextResponse } from 'next/server';

const JUPITER_LITE_API = 'https://lite-api.jup.ag/swap/v1';
const PLATFORM_FEE_BPS = 100; // 1% fee

// Token accounts for fee collection (for the fee wallet)
const FEE_TOKEN_ACCOUNTS: Record<string, string> = {
  'So11111111111111111111111111111111111111112': 'HowcznAWAbUT5jzKxu4HMWY4sZyhavgwMk3kurHot4Li', // WSOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': '55fNGd1rHyGVmmn7xMtScBNULp9bEDYuRVuezFKEBZPW', // USDC
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const inputMint = searchParams.get('inputMint');
  const outputMint = searchParams.get('outputMint');
  const amount = searchParams.get('amount');
  const slippageBps = searchParams.get('slippageBps') || '300'; // 3% default slippage for volatile memecoins

  if (!inputMint || !outputMint || !amount) {
    return NextResponse.json(
      { error: 'Missing required parameters: inputMint, outputMint, amount' },
      { status: 400 }
    );
  }

  // Only add fee if we have a token account for the input mint (fee is taken from input)
  const hasFeeAccount = FEE_TOKEN_ACCOUNTS[inputMint];

  try {
    let url = `${JUPITER_LITE_API}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;

    if (hasFeeAccount) {
      url += `&platformFeeBps=${PLATFORM_FEE_BPS}`;
    }

    console.log('Calling Jupiter API:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Jupiter API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Jupiter API error', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Include fee account info in response if applicable
    if (hasFeeAccount) {
      data.feeAccount = hasFeeAccount;
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Jupiter quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote', details: String(error) },
      { status: 500 }
    );
  }
}
