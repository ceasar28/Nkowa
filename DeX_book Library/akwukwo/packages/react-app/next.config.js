/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REACT_APP_PINATA_KEY: "e48c3aa498e3b46992ab",
    REACT_APP_PINATA_SECRET:
      "ae3cadd3d62177c98935c0bc99944a97b4dcaf8b94c525deb3b76515617311e0",
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;
