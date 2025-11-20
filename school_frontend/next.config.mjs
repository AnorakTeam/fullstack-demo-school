import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, 

  experimental: {
    
    turbo: {
      resolveAlias: {
        "@": path.resolve("./src"),
      },
    },
  },
};

export default nextConfig;