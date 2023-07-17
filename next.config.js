const withPWA = require("next-pwa")({
  dest: "public",
  skipWaiting: true,
  register: true,
  sw: "/sw.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA({
  ...nextConfig,
});
