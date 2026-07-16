import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "melli-zarr-ir.vercel.app",
        "mellizarr.ir",
        "www.mellizarr.ir",
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;
