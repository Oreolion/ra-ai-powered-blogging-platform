/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    reactStrictMode: true,
    swcMinify: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "lovely-flamingo-139.convex.cloud",
        },
        {
          protocol: "https",
          hostname: "judicious-gazelle-541.convex.cloud",
        },
        {
          protocol: "https",
          hostname: "img.clerk.com",
        },
      ],
    },
  };
  
  export default nextConfig;
  