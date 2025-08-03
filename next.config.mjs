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
