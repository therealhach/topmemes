import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type SwapInsert = Database['public']['Tables']['swaps']['Insert'];

const PLATFORM_FEE_BPS = 100; // 1% fee

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      paymentCurrency,
      swapAmount,
      tokenAddress,
      tokenSymbol,
      tokenAmount,
      tokenPrice,
      txSignature,
      swapType, // 'buy' or 'sell'
      status, // 'submitted', 'confirmed', 'failed'
    } = body;

    if (!walletAddress || !paymentCurrency || !swapAmount || !tokenAddress || !txSignature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    if (!supabase) {
      console.error('Supabase not configured');
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Calculate fee amount (1% of swap amount)
    const feeAmount = (swapAmount * PLATFORM_FEE_BPS) / 10000;

    const insertData: SwapInsert = {
      wallet_address: walletAddress,
      payment_currency: paymentCurrency,
      swap_amount: swapAmount,
      token_address: tokenAddress,
      token_symbol: tokenSymbol || '',
      token_amount: tokenAmount || 0,
      token_price: tokenPrice || 0,
      fee_amount: feeAmount,
      tx_signature: txSignature,
      swap_type: swapType || 'buy',
      status: status || 'submitted',
    };

    const { data, error } = await (supabase
      .from('swaps') as any)
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error storing swap:', error);
      return NextResponse.json(
        { error: 'Failed to store swap', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in store-swap:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
