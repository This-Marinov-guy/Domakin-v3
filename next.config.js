/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate-plugin");

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
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "domakin0.wordpress.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
});

module.exports = nextConfig;
