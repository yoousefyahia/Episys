import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: 'EPISYS - الصفحة الرئيسية | EPISYS - Home',
  description: 'نظام إدارة المطاعم المتطور - طلب طعام سريع وآمن | Advanced restaurant management system - fast and secure food ordering',
  keywords: 'مطعم، طعام، طلب، عربة تسوق، EPISYS، restaurant, food, order, cart',
  authors: [{ name: "EPISYS Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'EPISYS - نظام إدارة المطاعم',
    description: 'نظام إدارة المطاعم المتطور - طلب طعام سريع وآمن',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'EPISYS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EPISYS - نظام إدارة المطاعم',
    description: 'نظام إدارة المطاعم المتطور - طلب طعام سريع وآمن',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
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
            <ToastProvider>
              {children}
            </ToastProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
