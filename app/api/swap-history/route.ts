import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('wallet');
    const tokenAddress = searchParams.get('token');
    const limitParam = searchParams.get('limit');

    const supabase = getSupabaseServer();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    let query = supabase
      .from('swaps')
      .select('*');

    // Filter by wallet if not 'all'
    if (walletAddress && walletAddress !== 'all') {
      query = query.eq('wallet_address', walletAddress);
    }

    // Filter by token if provided
    if (tokenAddress) {
      query = query.eq('token_address', tokenAddress);
    }

    // Apply ordering and limit
    const limit = limitParam ? parseInt(limitParam) : 50;
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching swap history:', error);
      return NextResponse.json(
        { error: 'Failed to fetch swap history', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ swaps: data || [] });
  } catch (error) {
    console.error('Error in swap-history:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
