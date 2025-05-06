import { Metadata } from 'next';

const SEOConfig: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_DOMAIN
      ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
      : 'http://localhost:3000'
  ),
  title: 'CryptoChat 2.0',
  keywords: ['cryptochat', 'kekovina', 'pet project', 'diffie hellman'],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  description: 'Simple Diffie-Hellman encrypted chat',

  openGraph: {
    title: 'CryptoChat 2.0',
    siteName: 'CryptoChat',
    images: ['/images/og-image.jpg'],
  },
};

export default SEOConfig;
