import { NextRequest, NextResponse } from 'next/server';
import { Connection, SendTransactionError } from '@solana/web3.js';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY || process.env.NEXT_PUBLIC_HELIUS_API_KEY;
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signedTransaction } = body;

    if (!signedTransaction) {
      return NextResponse.json(
        { error: 'Missing signedTransaction' },
        { status: 400 }
      );
    }

    const connection = new Connection(HELIUS_RPC_URL, 'confirmed');

    // Convert base64 to Buffer
    const transactionBuffer = Buffer.from(signedTransaction, 'base64');

    // Send the transaction with skipPreflight for speed
    const txid = await connection.sendRawTransaction(transactionBuffer, {
      skipPreflight: true,
      maxRetries: 2,
    });

    console.log('Transaction sent:', txid);

    // Return immediately without waiting for confirmation
    return NextResponse.json({ txid, success: true });
  } catch (error: any) {
    console.error('Error sending transaction:', error);

    let errorMessage = 'Unknown error';
    if (error instanceof SendTransactionError) {
      errorMessage = error.message;
      console.error('Transaction logs:', error.logs);
    } else if (error?.message) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }

    return NextResponse.json(
      { error: 'Failed to send transaction', details: errorMessage },
      { status: 500 }
    );
  }
}
