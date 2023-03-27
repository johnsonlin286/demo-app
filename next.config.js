/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === 'development'
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ENVIROMENT: process.env.ENVIROMENT,
    API_URL: process.env.API_URL
  }
})

module.exports = nextConfig
