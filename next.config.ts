import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [process.env.IP || 'localhost'],
  basePath: process.env.BASEPATH || '',
  turbopack: {},
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@core": path.resolve(__dirname, "src/@core"),
      "@layouts": path.resolve(__dirname, "src/@layouts"),
      "@menu": path.resolve(__dirname, "src/@menu"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@configs": path.resolve(__dirname, "src/configs"),
      "@views": path.resolve(__dirname, "src/views"),
      "@data": path.resolve(__dirname, "src/data"),
      "@services": path.resolve(__dirname, "src/services"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@store": path.resolve(__dirname, "src/store"),
    };
    return config;
  },
};

export default nextConfig;
