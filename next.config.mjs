/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bkhtdev.com",
        port: "",
        path: "/**",
      },
    ],
  },
};

export default nextConfig;
