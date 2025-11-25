'use client';

import MainLayout from '@/components/MainLayout';

export default function TermsOfServicePage() {
  return (
    <MainLayout>
      <main className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>

        <div className="space-y-6 text-gray-300">
          <p className="text-sm text-gray-500">Last updated: January 2025</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Top Memes (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Description of Service</h2>
            <p>
              Top Memes is a cryptocurrency tracking and trading platform that provides:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Real-time memecoin price tracking and analytics</li>
              <li>Token swap functionality via Jupiter Aggregator</li>
              <li>Portfolio tracking and watchlist features</li>
              <li>Market data and charts</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Eligibility</h2>
            <p>
              You must be at least 18 years old to use this Service. By using the Service, you represent
              and warrant that you are of legal age and have the legal capacity to enter into these Terms.
              You are responsible for ensuring that your use of the Service complies with the laws of your jurisdiction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Wallet Connection</h2>
            <p>
              To use certain features of the Service, you must connect a Solana-compatible wallet.
              You are solely responsible for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Maintaining the security of your wallet and private keys</li>
              <li>All activities that occur through your connected wallet</li>
              <li>Any losses resulting from unauthorized access to your wallet</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Trading and Swaps</h2>
            <p>
              When using our swap functionality:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>A platform fee of 1% is applied to all swaps</li>
              <li>Slippage may occur due to market conditions</li>
              <li>Transactions are processed on the Solana blockchain and are irreversible</li>
              <li>You are responsible for verifying all transaction details before confirmation</li>
              <li>Network congestion may affect transaction speed and success</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">6. Risk Disclosure</h2>
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
              <p className="font-semibold text-yellow-500 mb-2">Important Risk Warning</p>
              <p>
                Cryptocurrency trading involves substantial risk. Memecoins are highly volatile and speculative
                assets that can lose all their value. You should:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Never invest more than you can afford to lose</li>
                <li>Conduct your own research before trading</li>
                <li>Understand that past performance does not guarantee future results</li>
                <li>Be aware of the risks of smart contract vulnerabilities</li>
                <li>Recognize that we do not provide financial advice</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">7. No Financial Advice</h2>
            <p>
              The information provided on this platform is for informational purposes only and should not
              be construed as financial, investment, trading, or any other type of advice. We do not
              recommend or endorse any specific tokens, investments, or trading strategies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">8. Data Accuracy</h2>
            <p>
              While we strive to provide accurate data, we do not guarantee the accuracy, completeness,
              or timeliness of any information displayed on the platform. Price data, market caps, and
              other metrics are sourced from third-party providers and may contain errors or delays.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">9. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Use the Service for any illegal purposes</li>
              <li>Attempt to manipulate markets or engage in fraud</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Circumvent any security measures</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">10. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Service are owned by Top Memes and are
              protected by intellectual property laws. You may not reproduce, distribute, modify, or
              create derivative works without our express written permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">11. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TOP MEMES SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Loss of profits or revenue</li>
              <li>Loss of cryptocurrency or digital assets</li>
              <li>Failed or delayed transactions</li>
              <li>Errors in price data or market information</li>
              <li>Third-party service failures</li>
              <li>Smart contract vulnerabilities or exploits</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">12. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
              SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">13. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Top Memes, its affiliates, and their respective
              officers, directors, and employees from any claims, damages, or expenses arising from
              your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">14. Third-Party Services</h2>
            <p>
              The Service integrates with third-party services including Jupiter Aggregator, CoinGecko,
              and the Solana blockchain. Your use of these services is subject to their respective terms
              and conditions. We are not responsible for any issues arising from third-party services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">15. Modifications to Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Service at any
              time without notice. We will not be liable to you or any third party for any modification,
              suspension, or discontinuance of the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">16. Changes to Terms</h2>
            <p>
              We may revise these Terms at any time. By continuing to use the Service after changes
              become effective, you agree to be bound by the revised Terms. It is your responsibility
              to review the Terms periodically.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">17. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws,
              without regard to conflict of law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">18. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, the remaining
              provisions will continue in full force and effect.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">19. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us through our official
              social media channels.
            </p>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}
