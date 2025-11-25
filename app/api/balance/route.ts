import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY || process.env.NEXT_PUBLIC_HELIUS_API_KEY;
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const walletAddress = searchParams.get('wallet');
  const tokenMint = searchParams.get('mint');

  if (!walletAddress) {
    return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
  }

  try {
    const connection = new Connection(HELIUS_RPC_URL, 'confirmed');
    const publicKey = new PublicKey(walletAddress);

    // If no specific mint, return all balances
    if (!tokenMint) {
      const balances: Record<string, number> = {};

      // Get SOL balance
      const solBalance = await connection.getBalance(publicKey);
      balances[SOL_MINT] = solBalance / 1e9;

      // Get all token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
      );

      for (const account of tokenAccounts.value) {
        const mintAddress = account.account.data.parsed.info.mint;
        const balance = account.account.data.parsed.info.tokenAmount.uiAmount;
        if (balance && balance > 0) {
          balances[mintAddress] = balance;
        }
      }

      return NextResponse.json({ balances });
    }

    // Get specific token balance
    if (tokenMint === SOL_MINT) {
      const balance = await connection.getBalance(publicKey);
      return NextResponse.json({ balance: balance / 1e9 });
    }

    // Get SPL token balance
    const tokenPublicKey = new PublicKey(tokenMint);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { mint: tokenPublicKey }
    );

    if (tokenAccounts.value.length === 0) {
      return NextResponse.json({ balance: 0 });
    }

    const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    return NextResponse.json({ balance: balance || 0 });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
