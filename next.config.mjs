/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "bkhtdev.com",
      "https://ltord0pu249uzgxe.public.blob.vercel-storage.com",
    ],
    loader: "default",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ltord0pu249uzgxe.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
