// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // 🧩 This ensures your Render environment variables
  // are injected at both build time and runtime.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_FLW_PUBLIC: process.env.NEXT_PUBLIC_FLW_PUBLIC,
    NEXT_PUBLIC_NOWPAY_PUBLIC: process.env.NEXT_PUBLIC_NOWPAY_PUBLIC,
    NEXT_PUBLIC_PAYSTACK_PUBLIC: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SENDGRID_FROM: process.env.SENDGRID_FROM,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Prevents Next.js build from failing on missing Node modules like "fs"
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = nextConfig;
