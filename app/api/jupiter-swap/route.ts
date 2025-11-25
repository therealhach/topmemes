import { NextRequest, NextResponse } from 'next/server';

const JUPITER_LITE_API = 'https://lite-api.jup.ag/swap/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteResponse, userPublicKey, wrapAndUnwrapSol = true, feeAccount } = body;

    if (!quoteResponse || !userPublicKey) {
      return NextResponse.json(
        { error: 'Missing required parameters: quoteResponse, userPublicKey' },
        { status: 400 }
      );
    }

    const swapRequestBody: any = {
      quoteResponse,
      userPublicKey,
      wrapAndUnwrapSol,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: {
        priorityLevelWithMaxLamports: {
          maxLamports: 1000000,
          priorityLevel: 'high',
        },
      },
    };

    // Add fee account if provided
    if (feeAccount) {
      swapRequestBody.feeAccount = feeAccount;
    }

    console.log('Calling Jupiter Swap API:', JSON.stringify(swapRequestBody, null, 2));

    const response = await fetch(`${JUPITER_LITE_API}/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(swapRequestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Jupiter Swap API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Jupiter Swap API error', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error building swap transaction:', error);
    return NextResponse.json(
      { error: 'Failed to build swap transaction', details: String(error) },
      { status: 500 }
    );
  }
}
