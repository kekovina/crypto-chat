import SEOConfig from '@/shared/config/seo';
import '@/shared/styles/scss/main.scss';
import { Metadata, Viewport } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  ...SEOConfig,
};

export const viewport: Viewport = {
  themeColor: '#141414',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#141414' />
        <link rel='apple-touch-icon' href='/icons/icon-192x192.png' />
      </Head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
