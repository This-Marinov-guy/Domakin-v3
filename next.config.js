/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate-plugin");
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  skipWaiting: true,
  clientsClaim: true,
  reloadOnOnline: true,
  runtimeCaching: [], // no runtime caching — always fetch fresh from network
});

const nextConfig = nextTranslate({
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async headers() {
    return [
      {
        source: "/firebase-messaging-sw.js",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "domakin0.wordpress.com",
      "platform-lookaside.fbsbx.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
});

module.exports = withPWA(nextConfig);
