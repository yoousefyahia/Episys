import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'EPISYS',
  description:
    'نظام إدارة المطاعم  - طلب طعام سريع وآمن | Advanced restaurant management system - fast and secure food ordering',
  keywords: 'مطعم، طعام، طلب، عربة تسوق، EPISYS، restaurant, food, order, cart',
  authors: [{ name: 'EPISYS Team' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'EPISYS',
    description: 'نظام إدارة المطاعم المتطور - طلب طعام سريع وآمن',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'EPISYS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EPISYS',
    description: 'نظام إدارة المطاعم المتطور - طلب طعام سريع وآمن',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#11998e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EPISYS" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <LanguageProvider>
          <CartProvider>
            <ToastProvider>{children}</ToastProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
