// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://jewelry-management-system-backend.onrender.com",
  },
};

module.exports = nextConfig;
