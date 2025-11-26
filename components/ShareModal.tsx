'use client';

import { useEffect } from 'react';
import ShareCard from './ShareCard';

interface TokenHolding {
  symbol: string;
  name: string;
  logo?: string;
  currentValue: number;
  athValue: number;
  multiplier: number;
}

interface PortfolioShareData {
  type: 'portfolio';
  totalCurrentValue: number;
  totalAthValue: number;
  totalMultiplier: number;
  holdings: TokenHolding[];
  walletAddress?: string;
}

interface TokenShareData {
  type: 'token';
  symbol: string;
  name: string;
  logo?: string;
  currentPrice: number;
  athPrice: number;
  multiplier: number;
  marketCap?: number;
}

type ShareData = PortfolioShareData | TokenShareData;

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData;
}

export default function ShareModal({ isOpen, onClose, data }: ShareModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 rounded-2xl p-6 max-w-[480px] w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {data.type === 'portfolio' ? 'Share Your Portfolio' : `Share $${data.symbol}`}
        </h2>

        {/* Share Card */}
        <ShareCard {...data} />

        {/* Instructions */}
        <p className="text-slate-400 text-sm text-center mt-4">
          Download the image or share directly to X. Image will be copied to clipboard for easy pasting.
        </p>
      </div>
    </div>
  );
}
