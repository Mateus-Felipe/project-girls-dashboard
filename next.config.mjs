/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEV: "true",
    PRODUCTION_PAGE: "https://project-girls.vercel.app",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "project-girl-bucket.s3.sa-east-1.amazonaws.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
