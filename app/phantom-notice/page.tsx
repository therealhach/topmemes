'use client';

import MainLayout from '@/components/MainLayout';
import Link from 'next/link';

export default function PhantomNoticePage() {
  return (
    <MainLayout>
      <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Phantom Wallet Security Notice</h1>
          <p className="text-gray-400">Important information about trading on TopMemes.io</p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 sm:p-8 space-y-6">
          {/* What's Happening */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-sm">?</span>
              What&apos;s Happening?
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              When you try to buy or sell tokens on TopMemes.io, your Phantom wallet may display a
              <span className="text-red-400 font-medium"> &quot;malicious site&quot; warning</span>. This is because our
              website is <span className="text-amber-400 font-medium">currently pending verification</span> on
              Phantom&apos;s whitelist.
            </p>
          </div>

          {/* Why This Happens */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm">!</span>
              Why Does This Happen?
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Phantom wallet has security measures to protect users from potentially harmful websites.
              New decentralized applications (dApps) that haven&apos;t been reviewed yet are flagged as a precaution.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-cyan-400 font-medium">This does NOT mean our site is malicious.</span> It simply
              means we&apos;re a new platform that hasn&apos;t completed Phantom&apos;s verification process yet.
            </p>
          </div>

          {/* Is It Safe */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm">✓</span>
              Is TopMemes.io Safe?
            </h2>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>We use <span className="text-white font-medium">Jupiter DEX</span> - Solana&apos;s leading decentralized exchange for all swaps</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>All transactions are <span className="text-white font-medium">signed by you</span> - we never have access to your funds</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Our code is <span className="text-white font-medium">open and transparent</span> - you can verify all swap transactions on-chain</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>We&apos;ve applied for <span className="text-white font-medium">Phantom whitelist verification</span> and are awaiting approval</span>
              </li>
            </ul>
          </div>

          {/* What To Do */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm">→</span>
              How To Proceed
            </h2>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-xs text-white font-medium flex-shrink-0">1</span>
                <p className="text-gray-300 text-sm">When you see the warning, <span className="text-white font-medium">review the transaction details</span> carefully in Phantom</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-xs text-white font-medium flex-shrink-0">2</span>
                <p className="text-gray-300 text-sm">Verify the swap is going through <span className="text-white font-medium">Jupiter Aggregator</span> (the official Solana DEX)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-xs text-white font-medium flex-shrink-0">3</span>
                <p className="text-gray-300 text-sm">If you&apos;re comfortable, click <span className="text-white font-medium">&quot;Proceed anyway&quot;</span> or similar option to continue</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-xs text-white font-medium flex-shrink-0">4</span>
                <p className="text-gray-300 text-sm">Alternatively, you can swap directly on <a href="https://jup.ag" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">jup.ag</a> using the token addresses from our site</p>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <h3 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Whitelist Status: Pending
            </h3>
            <p className="text-gray-300 text-sm">
              We have submitted our application to Phantom&apos;s security team for review.
              This warning will be removed once we&apos;re verified. We appreciate your patience and understanding.
            </p>
          </div>

          {/* Contact */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-3">
              Have questions or concerns? Reach out to us on X (Twitter)
            </p>
            <a
              href="https://x.com/topmemes_io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              @topmemes_io
            </a>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
