import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const ADMIN_WALLET = '7enA39APuzDhDD1da7nVmg1DjzJrVULBHN579VGEzFNU';

export async function POST(request: NextRequest) {
  try {
    const { tokenAddress, athPrice, publicKey, signature, message } = await request.json();

    // Verify the wallet address matches admin wallet
    if (publicKey !== ADMIN_WALLET) {
      return NextResponse.json(
        { error: 'Unauthorized: Not admin wallet' },
        { status: 403 }
      );
    }

    // Verify the signature
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(publicKey);

    const verified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Update the ATH price in Supabase
    const supabase = getSupabaseServer();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('tokens')
      // @ts-expect-error - Supabase type inference issue with ath_price field
      .update({ ath_price: athPrice })
      .eq('token_address', tokenAddress)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update ATH price' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    );
  }
}
