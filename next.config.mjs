/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "objectstorage.eu-marseille-1.oraclecloud.com",
        pathname: "/n/axojpmluqbww/b/cenehanna-images/o/**",
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
