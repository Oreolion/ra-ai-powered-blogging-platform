/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      // TODO: Fix all TypeScript errors incrementally during feature development
      ignoreBuildErrors: true,
    },
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
        {
            protocol: 'https',
            hostname: 'clever-dove-968.convex.cloud',
            pathname: '/api/storage/**',
          },
      ],
    },
  };
  
  export default nextConfig;
  