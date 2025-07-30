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
  
  // إعدادات التصميم المتجاوب
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
        ],
      },
    ];
  },
};

export default nextConfig;
