/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ENVIROMENT: process.env.ENVIROMENT,
    API_URL: process.env.API_URL
  }
}

module.exports = nextConfig
