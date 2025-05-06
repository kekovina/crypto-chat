import SEOConfig from '@/shared/config/seo';
import '@/shared/styles/scss/main.scss';
import { Metadata, Viewport } from 'next';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  ...SEOConfig,
  manifest: '/manifest.json',
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
      <body>
        <main>{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}
