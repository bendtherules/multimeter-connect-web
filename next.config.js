const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  skipWaiting: true,
  register: true,
  sw: "/sw.js",
  runtimeCaching,
  dynamicStartUrl: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA({
  ...nextConfig,
});
