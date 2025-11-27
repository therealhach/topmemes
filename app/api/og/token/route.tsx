import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export const runtime = 'edge';

// Format numbers for display
function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

function formatPrice(price: number): string {
  if (price < 0.00001) return `$${price.toExponential(2)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return new Response('Missing address parameter', { status: 400 });
    }

    // Fetch token data from Supabase
    const supabase = getSupabaseServer();
    let tokenData: any = null;

    if (supabase) {
      const { data } = await supabase
        .from('tokens')
        .select('*')
        .eq('token_address', address)
        .single();
      tokenData = data;
    }

    // Fetch market data from DexScreener
    let marketData: any = null;
    if (tokenData?.pair_address) {
      const chain = tokenData.chain || 'solana';
      const dexResponse = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/${chain}/${tokenData.pair_address}`
      );
      const dexData = await dexResponse.json();
      if (dexData?.pair) {
        marketData = {
          price: parseFloat(dexData.pair.priceUsd || '0'),
          priceChange24h: parseFloat(dexData.pair.priceChange?.h24 || '0'),
          marketCap: parseFloat(dexData.pair.fdv || '0'),
          volume24h: parseFloat(dexData.pair.volume?.h24 || '0'),
        };
      }
    }

    const tokenName = tokenData?.token_name || 'Unknown Token';
    const tokenSymbol = tokenData?.token_symbol || 'UNKNOWN';
    const logoUrl = tokenData?.logo_url;
    const price = marketData?.price || 0;
    const priceChange = marketData?.priceChange24h || 0;
    const marketCap = marketData?.marketCap || 0;
    const volume = marketData?.volume24h || 0;
    const isPositive = priceChange >= 0;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Cosmic Background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000000',
              display: 'flex',
            }}
          >
            {/* Base gradient */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, #000000, #030712, #000000)',
                display: 'flex',
              }}
            />
            {/* Teal gradient from bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '66%',
                background: 'linear-gradient(to top, rgba(19, 78, 74, 0.3), rgba(8, 51, 68, 0.2), transparent)',
                display: 'flex',
              }}
            />
            {/* Purple glow orb - top left */}
            <div
              style={{
                position: 'absolute',
                top: 40,
                left: 40,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
                display: 'flex',
              }}
            />
            {/* Cyan glow orb - bottom right */}
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                right: 40,
                width: 280,
                height: 280,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, transparent 70%)',
                display: 'flex',
              }}
            />
            {/* Stars layer */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
              }}
            >
              {/* Individual stars */}
              <div style={{ position: 'absolute', top: '15%', left: '10%', width: 3, height: 3, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.8)' }} />
              <div style={{ position: 'absolute', top: '25%', left: '25%', width: 2, height: 2, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.6)' }} />
              <div style={{ position: 'absolute', top: '10%', left: '45%', width: 2, height: 2, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)' }} />
              <div style={{ position: 'absolute', top: '35%', left: '60%', width: 3, height: 3, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.5)' }} />
              <div style={{ position: 'absolute', top: '20%', left: '80%', width: 2, height: 2, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)' }} />
              <div style={{ position: 'absolute', top: '45%', left: '15%', width: 2, height: 2, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.5)' }} />
              <div style={{ position: 'absolute', top: '55%', left: '35%', width: 3, height: 3, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.6)' }} />
              <div style={{ position: 'absolute', top: '65%', left: '70%', width: 2, height: 2, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)' }} />
              <div style={{ position: 'absolute', top: '75%', left: '90%', width: 2, height: 2, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.6)' }} />
              <div style={{ position: 'absolute', top: '85%', left: '50%', width: 3, height: 3, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.5)' }} />
            </div>
          </div>

          {/* Content Container */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              padding: '40px 50px',
              height: '100%',
            }}
          >
            {/* Header with branding */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                borderBottom: '1px solid rgba(34, 211, 238, 0.2)',
                paddingBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                {logoUrl && (
                  <img
                    src={logoUrl}
                    width={80}
                    height={80}
                    style={{
                      borderRadius: '50%',
                      border: '3px solid #22d3ee',
                    }}
                  />
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    {tokenName}
                  </span>
                  <span
                    style={{
                      fontSize: 28,
                      color: '#94a3b8',
                    }}
                  >
                    ${tokenSymbol}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {/* Bull Icon */}
                <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
                  <path d="M12 26C8 18 5 10 4 6C9 9 16 14 18 22" fill="none" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M52 26C56 18 59 10 60 6C55 9 48 14 46 22" fill="none" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round"/>
                  <ellipse cx="32" cy="38" rx="18" ry="16" fill="#ffffff"/>
                </svg>
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  TopMemes.io
                </span>
              </div>
            </div>

            {/* Main content */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                gap: '40px',
              }}
            >
              {/* Left side - Price info */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 24, color: '#94a3b8' }}>Price</span>
                    <span
                      style={{
                        fontSize: 56,
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      {formatPrice(price)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: 24, color: '#94a3b8' }}>24h:</span>
                    <span
                      style={{
                        fontSize: 36,
                        fontWeight: 'bold',
                        color: isPositive ? '#22c55e' : '#ef4444',
                      }}
                    >
                      {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side - Stats */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '30px 40px',
                  minWidth: '380px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 24, color: '#94a3b8' }}>Market Cap</span>
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    {formatNumber(marketCap)}
                  </span>
                </div>

                <div
                  style={{
                    height: '1px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    width: '100%',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 24, color: '#94a3b8' }}>24h Volume</span>
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    {formatNumber(volume)}
                  </span>
                </div>

                <div
                  style={{
                    height: '1px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    width: '100%',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 24, color: '#94a3b8' }}>Chain</span>
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 'bold',
                      color: '#22d3ee',
                      textTransform: 'capitalize',
                    }}
                  >
                    {tokenData?.chain || 'Solana'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(34, 211, 238, 0.2)',
              }}
            >
              <span style={{ fontSize: 18, color: '#64748b' }}>
                x.com/topmemes_io
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
