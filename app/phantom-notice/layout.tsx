import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phantom Wallet Notice | TopMemes.io',
  description: 'Important information about Phantom wallet security warnings when trading on TopMemes.io. Learn why you may see warnings and how to proceed safely.',
};

export default function PhantomNoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
