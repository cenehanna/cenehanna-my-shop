/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
