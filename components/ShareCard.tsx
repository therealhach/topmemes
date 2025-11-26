'use client';

import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';

interface TokenHolding {
  symbol: string;
  name: string;
  logo?: string;
  currentValue: number;
  athValue: number;
  multiplier: number;
}

interface PortfolioShareCardProps {
  type: 'portfolio';
  totalCurrentValue: number;
  totalAthValue: number;
  totalMultiplier: number;
  holdings: TokenHolding[];
  walletAddress?: string;
}

interface TokenShareCardProps {
  type: 'token';
  symbol: string;
  name: string;
  logo?: string;
  currentPrice: number;
  athPrice: number;
  multiplier: number;
  marketCap?: number;
}

type ShareCardProps = PortfolioShareCardProps | TokenShareCardProps;

export default function ShareCard(props: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [holdingsLogos, setHoldingsLogos] = useState<Record<string, string>>({});
  const [tagline, setTagline] = useState('believe in something');

  // Convert image to base64 on mount
  useEffect(() => {
    const convertToBase64 = async (url: string): Promise<string | null> => {
      try {
        // Use a proxy to avoid CORS
        const proxyUrl = `/api/extract-color?url=${encodeURIComponent(url)}&returnImage=true`;
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      } catch {
        return null;
      }
    };

    // Load main token logo
    if (props.type === 'token' && props.logo) {
      convertToBase64(props.logo).then(setLogoBase64);
    }

    // Load holdings logos for portfolio
    if (props.type === 'portfolio' && props.holdings) {
      const loadLogos = async () => {
        const logos: Record<string, string> = {};
        for (const holding of props.holdings) {
          if (holding.logo) {
            const base64 = await convertToBase64(holding.logo);
            if (base64) logos[holding.symbol] = base64;
          }
        }
        setHoldingsLogos(logos);
      };
      loadLogos();
    }
  }, [props]);

  useEffect(() => {
    if (showCopiedToast) {
      const timer = setTimeout(() => setShowCopiedToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showCopiedToast]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatMultiplier = (mult: number) => {
    return mult >= 1000 ? `${(mult / 1000).toFixed(1)}K` : mult.toFixed(1);
  };

  const generateImage = async () => {
    if (!cardRef.current) return null;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0f172a',
        skipFonts: true,
        cacheBust: true,
        fetchRequestInit: {
          cache: 'no-cache',
        },
        includeQueryParams: true,
      });
      return dataUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const dataUrl = await generateImage();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = props.type === 'portfolio'
        ? 'topmemes-portfolio.png'
        : `topmemes-${props.symbol}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleTwitterShare = async () => {
    const dataUrl = await generateImage();

    let tweetText = '';
    if (props.type === 'portfolio') {
      tweetText = `My memecoin portfolio has ${formatMultiplier(props.totalMultiplier)}x potential if tokens hit ATH 🚀\n\nCurrent: ${formatNumber(props.totalCurrentValue)}\nAt ATH: ${formatNumber(props.totalAthValue)}\n\nCheck yours at topmemes.io\n\n@topmemes_io`;
    } else {
      tweetText = `$${props.symbol} has ${formatMultiplier(props.multiplier)}x potential to ATH 🚀\n\nCurrent: $${props.currentPrice.toFixed(6)}\nATH: $${props.athPrice.toFixed(6)}\n\nTrack memecoins at topmemes.io\n\n@topmemes_io`;
    }

    // If we have image data, copy to clipboard first
    if (dataUrl) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setShowCopiedToast(true);
      } catch (e) {
        console.log('Could not copy image to clipboard');
      }
    }

    // Small delay to let user see the toast
    setTimeout(() => {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(twitterUrl, '_blank');
    }, 500);
  };

  return (
    <div className="flex flex-col items-center gap-4 relative">
      {/* Copied Toast */}
      {showCopiedToast && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up z-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span className="text-sm font-medium">Image copied! Press Ctrl+V to paste in tweet</span>
        </div>
      )}

      {/* The Card */}
      <div
        ref={cardRef}
        className="w-[400px] rounded-2xl overflow-hidden border border-cyan-500/20 relative"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* Cosmic Background */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-teal-900/30 via-cyan-950/20 to-transparent"></div>
          {/* Stars */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.8), transparent),
              radial-gradient(2px 2px at 60% 70%, rgba(255,255,255,0.6), transparent),
              radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.5), transparent),
              radial-gradient(2px 2px at 80% 10%, rgba(255,255,255,0.7), transparent),
              radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.4), transparent),
              radial-gradient(1.5px 1.5px at 90% 40%, rgba(255,255,255,0.6), transparent),
              radial-gradient(1px 1px at 15% 60%, rgba(255,255,255,0.5), transparent),
              radial-gradient(2px 2px at 70% 25%, rgba(255,255,255,0.7), transparent),
              radial-gradient(1px 1px at 35% 15%, rgba(255,255,255,0.4), transparent),
              radial-gradient(1.5px 1.5px at 85% 85%, rgba(255,255,255,0.5), transparent)
            `,
            backgroundSize: '100% 100%',
            opacity: 0.6
          }}></div>
          {/* Glow orbs */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl"></div>
        </div>

        {/* Content wrapper */}
        <div className="relative z-10">
        {/* Header */}
        <div className="px-5 py-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Bull Icon */}
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
              <path d="M12 26C8 18 5 10 4 6C9 9 16 14 18 22" fill="none" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round"/>
              <path d="M52 26C56 18 59 10 60 6C55 9 48 14 46 22" fill="none" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round"/>
              <ellipse cx="32" cy="38" rx="18" ry="16" fill="#ffffff"/>
            </svg>
            <span className="text-white font-bold text-lg">TopMemes.io</span>
          </div>
          {props.type === 'token' && (
            <span className="text-slate-400 text-sm">${props.symbol}</span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {props.type === 'portfolio' ? (
            // Portfolio Card Content
            <>
              <div className="text-center mb-4">
                <p className="text-slate-400 text-sm mb-1">Current Value</p>
                <p className="text-white text-3xl font-bold">{formatNumber(props.totalCurrentValue)}</p>
              </div>

              <div className="text-center mb-4">
                <p className="text-slate-400 text-sm mb-1">If Tokens Hit ATH</p>
                <p className="text-emerald-400 text-3xl font-bold">{formatNumber(props.totalAthValue)}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-[2px] border border-white/10 rounded-xl p-4 text-center mb-4">
                <p className="text-slate-300 text-sm mb-1">Potential Upside</p>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  {formatMultiplier(props.totalMultiplier)}x
                </p>
              </div>

              {/* Top Holdings */}
              {props.holdings.length > 0 && (
                <div className="space-y-2">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Top Holdings</p>
                  {props.holdings.slice(0, 3).map((holding, i) => (
                    <div key={holding.symbol} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{['🥇', '🥈', '🥉'][i]}</span>
                        {(holdingsLogos[holding.symbol] || holding.logo) && (
                          <img src={holdingsLogos[holding.symbol] || holding.logo} alt={holding.symbol} className="w-5 h-5 rounded-full" />
                        )}
                        <span className="text-white font-medium">{holding.symbol}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400">{formatNumber(holding.currentValue)}</span>
                        <span className="text-emerald-400 ml-2">({formatMultiplier(holding.multiplier)}x)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Token Card Content
            <>
              <div className="flex items-center justify-center gap-3 mb-4">
                {(logoBase64 || props.logo) && (
                  <img src={logoBase64 || props.logo} alt={props.symbol} className="w-12 h-12 rounded-full" />
                )}
                <div>
                  <p className="text-white text-xl font-bold">{props.name}</p>
                  <p className="text-slate-400">${props.symbol}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-1">Current Price</p>
                  <p className="text-white text-xl font-bold">${props.currentPrice < 0.01 ? props.currentPrice.toFixed(6) : props.currentPrice.toFixed(4)}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-1">ATH Price</p>
                  <p className="text-emerald-400 text-xl font-bold">${props.athPrice < 0.01 ? props.athPrice.toFixed(6) : props.athPrice.toFixed(4)}</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-[2px] border border-white/10 rounded-xl p-4 text-center">
                <p className="text-slate-300 text-sm mb-1">Potential to ATH</p>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  {formatMultiplier(props.multiplier)}x
                </p>
              </div>

              {props.marketCap && (
                <div className="text-center mt-4">
                  <p className="text-slate-400 text-sm">Market Cap: {formatNumber(props.marketCap)}</p>
                </div>
              )}
              <p className="text-slate-500 text-xs text-center mt-4 italic">{tagline}</p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-cyan-500/20 flex items-center justify-between">
          <span className="text-slate-500 text-xs">topmemes.io</span>
          <span className="text-slate-500 text-xs">@topmemes_io</span>
        </div>
        </div>{/* End content wrapper */}
      </div>

      {/* Tagline Editor */}
      {props.type === 'token' && (
        <div className="w-full max-w-[400px]">
          <label className="text-slate-400 text-xs mb-1 block">Custom tagline (max 20 chars)</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value.slice(0, 20))}
            maxLength={20}
            placeholder="believe in something"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
          />
          <p className="text-slate-500 text-xs mt-1 text-right">{tagline.length}/20</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {isGenerating ? 'Generating...' : 'Download'}
        </button>

        <button
          onClick={handleTwitterShare}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share on X
        </button>
      </div>
    </div>
  );
}
