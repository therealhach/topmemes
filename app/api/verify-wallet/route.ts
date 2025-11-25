import { NextRequest, NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const ADMIN_WALLET = '7enA39APuzDhDD1da7nVmg1DjzJrVULBHN579VGEzFNU';

export async function POST(request: NextRequest) {
  try {
    const { publicKey, signature, message } = await request.json();

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

    // Generate a session token (simple implementation - consider using JWT in production)
    const sessionToken = Buffer.from(
      `${publicKey}-${Date.now()}-${Math.random()}`
    ).toString('base64');

    return NextResponse.json({
      success: true,
      isAdmin: true,
      sessionToken,
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
