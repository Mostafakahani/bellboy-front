/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // webpack: (config) => {
  //   config.cache = false;
  //   return config;
  // },
  images: {
    domains: [
      "a.tile.openstreetmap.org",
      "b.tile.openstreetmap.org",
      "c.tile.openstreetmap.org",
      process.env.NEXT_PUBLIC_API_BASE_URL.replace(/^https?:\/\//, ""), // Extracts just the hostname
    ],
  },
};

export default nextConfig;
