'use client';

import MainLayout from '@/components/MainLayout';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <MainLayout>
      <main className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-8">About TopMemes</h1>

        <div className="space-y-8 text-gray-300">
          {/* Mission */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Our Mission</h2>
            <p>
              TopMemes.io is your go-to platform for discovering, tracking, and trading memecoins
              on Solana. We believe in making memecoin trading accessible, transparent, and fun
              for everyone—from curious newcomers to seasoned degen traders.
            </p>
          </section>

          {/* What We Offer */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">What We Offer</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium text-cyan-400 mb-2">Real-Time Tracking</h3>
                <p className="text-sm">
                  Monitor 70+ memecoins with live price updates, market caps, and 24h changes.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium text-cyan-400 mb-2">Secure Swaps</h3>
                <p className="text-sm">
                  Trade directly through Jupiter DEX aggregator—Solana&apos;s most trusted exchange.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium text-cyan-400 mb-2">Portfolio Tracking</h3>
                <p className="text-sm">
                  View your holdings, track swap history, and monitor your portfolio performance.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium text-cyan-400 mb-2">Market Analytics</h3>
                <p className="text-sm">
                  Heatmaps, leaderboards, and ATH comparisons to spot opportunities.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium text-cyan-400 mb-2">Paper Portfolio</h3>
                <p className="text-sm">
                  Simulate investments and see potential returns if tokens reach ATH.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium text-cyan-400 mb-2">Watchlist</h3>
                <p className="text-sm">
                  Save your favorite tokens and never miss a pump.
                </p>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Security First</h2>
            <p>
              Your security is our top priority. Here&apos;s how we keep you safe:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>All swaps are executed through Jupiter&apos;s official API</li>
              <li>We use Phantom&apos;s recommended signAndSendTransaction method</li>
              <li>You always sign transactions—we never have access to your private keys</li>
              <li>Our codebase is open source and auditable on GitHub</li>
              <li>Non-custodial: your funds stay in your wallet</li>
            </ul>
          </section>

          {/* Tech Stack */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Built With</h2>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Solana Web3.js', 'Jupiter API', 'DexScreener', 'CoinGecko'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Connect */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Connect With Us</h2>
            <p>
              Have questions, feedback, or just want to say gm? Reach out to us!
            </p>
            <div className="flex gap-4">
              <a
                href="https://x.com/topmemes_io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>@topmemes_io</span>
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact Us</span>
              </Link>
            </div>
          </section>

          {/* Footer note */}
          <section className="pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-500 text-center">
              TopMemes.io is an independent project. We are not affiliated with any token projects listed on our platform.
              Always do your own research before trading.
            </p>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}
