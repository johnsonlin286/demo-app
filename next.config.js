/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.ENVIROMENT === "develop",
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ENVIROMENT: process.env.ENVIROMENT,
    API_URL: process.env.API_URL,
    FB_API_KEY: process.env.FB_API_KEY,
    FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
    FB_DBURL: process.env.FB_DBURL,
    FB_PROJECT_ID: process.env.FB_STORAGE_BUCKET,
    FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
    FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
    FB_APP_ID: process.env.FB_APP_ID,
    FB_MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID,
  },
});

module.exports = nextConfig;
