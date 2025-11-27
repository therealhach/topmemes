import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export interface JupiterQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: null | any;
  priceImpactPct: string;
  routePlan: any[];
  contextSlot?: number;
  timeTaken?: number;
  feeAccount?: string; // Token account for fee collection
}

export interface SwapResult {
  txid: string;
  inputAmount: number;
  outputAmount: number;
}

/**
 * Get a quote from Jupiter for swapping tokens
 */
export async function getJupiterQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 50 // 0.5% default slippage
): Promise<JupiterQuote | null> {
  try {
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: amount.toString(),
      slippageBps: slippageBps.toString(),
    });

    // Use local API route to avoid CORS issues
    const url = `/api/jupiter-quote?${params}`;
    console.log('Fetching Jupiter quote:', url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Jupiter quote error:', response.status, errorData);
      return null;
    }

    const quote = await response.json();
    console.log('Jupiter quote response:', quote);
    return quote;
  } catch (error) {
    console.error('Error fetching Jupiter quote:', error);
    return null;
  }
}

/**
 * Get swap transaction from Jupiter using API route
 */
export async function getJupiterSwapTransaction(
  quote: JupiterQuote,
  userPublicKey: string,
  wrapUnwrapSOL: boolean = true
): Promise<string | null> {
  try {
    // Extract feeAccount from quote and remove it from quoteResponse
    const { feeAccount, ...quoteResponse } = quote;

    const response = await fetch('/api/jupiter-swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol: wrapUnwrapSOL,
        feeAccount, // Pass fee account if available
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Jupiter swap error:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    console.log('Jupiter swap response:', data);
    return data.swapTransaction;
  } catch (error) {
    console.error('Error getting swap transaction:', error);
    return null;
  }
}

/**
 * Execute a swap transaction using Phantom's signAndSendTransaction
 * This method is recommended by Phantom/Blowfish for better security integration
 */
export async function executeSwap(
  connection: Connection,
  swapTransaction: string,
  wallet: any
): Promise<string> {
  try {
    // Deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // Use signAndSendTransaction if available (Phantom's recommended method)
    // This allows Phantom/Blowfish to add their security guard instructions
    if (wallet.signAndSendTransaction) {
      const { signature } = await wallet.signAndSendTransaction(transaction, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });
      return signature;
    }

    // Fallback to signTransaction + send via API if signAndSendTransaction not available
    if (wallet.signTransaction) {
      const signedTransaction = await wallet.signTransaction(transaction);
      const serializedTransaction = Buffer.from(signedTransaction.serialize()).toString('base64');

      const response = await fetch('/api/send-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signedTransaction: serializedTransaction,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Send transaction error:', errorData);
        throw new Error(errorData.error + ': ' + (errorData.details || 'Failed to send transaction'));
      }

      const data = await response.json();
      return data.txid;
    }

    throw new Error('Wallet does not support transaction signing');
  } catch (error) {
    console.error('Error executing swap:', error);
    throw error;
  }
}

/**
 * Get token balance for a wallet using API route
 */
export async function getTokenBalance(
  connection: Connection,
  walletAddress: string,
  tokenMint: string
): Promise<number> {
  try {
    const params = new URLSearchParams({
      wallet: walletAddress,
      mint: tokenMint,
    });

    const response = await fetch(`/api/balance?${params}`);
    if (!response.ok) {
      console.error('Balance API error:', response.status);
      return 0;
    }

    const data = await response.json();
    return data.balance || 0;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
}

/**
 * Get all token balances for a wallet using API route
 * This is more efficient than making individual calls
 */
export async function getAllTokenBalances(
  walletAddress: string
): Promise<Map<string, number>> {
  const balanceMap = new Map<string, number>();

  try {
    const params = new URLSearchParams({
      wallet: walletAddress,
    });

    const response = await fetch(`/api/balance?${params}`);
    if (!response.ok) {
      console.error('Balance API error:', response.status);
      return balanceMap;
    }

    const data = await response.json();
    if (data.balances) {
      for (const [mint, balance] of Object.entries(data.balances)) {
        balanceMap.set(mint, balance as number);
      }
    }

    return balanceMap;
  } catch (error) {
    console.error('Error fetching all token balances:', error);
    return balanceMap;
  }
}

/**
 * Get token balance using API route
 * This avoids rate limits and CORS issues
 */
export async function getTokenBalanceWithHelius(
  walletAddress: string,
  tokenMint: string
): Promise<number> {
  try {
    const params = new URLSearchParams({
      wallet: walletAddress,
      mint: tokenMint,
    });

    const response = await fetch(`/api/balance?${params}`);
    if (!response.ok) {
      console.error('Balance API error:', response.status);
      return 0;
    }

    const data = await response.json();
    return data.balance || 0;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
}

/**
 * Convert USD to token amount using current price
 */
export function usdToTokenAmount(usdAmount: number, tokenPrice: number): number {
  if (tokenPrice === 0) return 0;
  return usdAmount / tokenPrice;
}

/**
 * Convert token amount to USD using current price
 */
export function tokenToUsdAmount(tokenAmount: number, tokenPrice: number): number {
  return tokenAmount * tokenPrice;
}

/**
 * Calculate upside if token reaches ATH
 */
export function calculateUpsideToATH(
  investmentUsd: number,
  currentPrice: number,
  athPrice: number
): {
  currentValue: number;
  athValue: number;
  profit: number;
  percentageGain: number;
} {
  if (currentPrice === 0) {
    return {
      currentValue: investmentUsd,
      athValue: investmentUsd,
      profit: 0,
      percentageGain: 0,
    };
  }

  const tokenAmount = investmentUsd / currentPrice;
  const athValue = tokenAmount * athPrice;
  const profit = athValue - investmentUsd;
  const percentageGain = ((athValue - investmentUsd) / investmentUsd) * 100;

  return {
    currentValue: investmentUsd,
    athValue,
    profit,
    percentageGain,
  };
}

export const TOKENS = {
  USDC: USDC_MINT,
  SOL: SOL_MINT,
};
