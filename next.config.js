const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  skipWaiting: true,
  register: true,
  sw: "/sw.js",
  dynamicStartUrl: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA({
  ...nextConfig,
});
