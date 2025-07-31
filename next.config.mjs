/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعدادات إضافية لحل مشاكل التحميل
  experimental: {
    // تحسين الأداء
    optimizePackageImports: ['@fortawesome/react-fontawesome'],
  },

  // إعدادات الصور
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },

  // إعدادات التطوير
  devIndicators: {
    buildActivity: false,
  },

  // إعدادات PWA
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },

  // تحسين الأداء
  compress: true,
  poweredByHeader: false,

  // إعدادات التطبيق
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/_next/static/sw.js',
      },
    ];
  },
};

export default nextConfig;
