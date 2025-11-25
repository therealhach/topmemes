'use client';

import MainLayout from '@/components/MainLayout';

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <main className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-gray-300">
          <p className="text-sm text-gray-500">Last updated: January 2025</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
            <p>
              Welcome to Top Memes (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your privacy
              and ensuring the security of your personal information. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-gray-200">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Wallet addresses when you connect your Solana wallet</li>
              <li>Transaction data when you perform swaps through our platform</li>
              <li>Watchlist preferences and saved tokens</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-200">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide and maintain our services</li>
              <li>Process transactions and swaps</li>
              <li>Display your portfolio and transaction history</li>
              <li>Improve and optimize our platform</li>
              <li>Communicate with you about updates and features</li>
              <li>Detect and prevent fraudulent activities</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Data Storage and Security</h2>
            <p>
              We implement industry-standard security measures to protect your information. Transaction
              data is stored securely and encrypted. However, no method of transmission over the Internet
              or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Third-Party Services</h2>
            <p>Our platform integrates with third-party services including:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Jupiter Aggregator for token swaps</li>
              <li>CoinGecko for price data</li>
              <li>Solana blockchain network</li>
            </ul>
            <p className="mt-2">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">6. Blockchain Data</h2>
            <p>
              Please note that blockchain transactions are public by nature. When you perform transactions
              through our platform, your wallet address and transaction details are recorded on the Solana
              blockchain and are publicly accessible.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (where applicable)</li>
              <li>Opt-out of marketing communications</li>
              <li>Disconnect your wallet at any time</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">8. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze site traffic,
              and understand usage patterns. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">9. Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly
              collect personal information from children.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our
              official social media channels.
            </p>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}
