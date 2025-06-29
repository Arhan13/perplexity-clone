import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        port: "",
        pathname: "/s2/favicons**",
      },
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/favicon**",
      },
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**/*.ico",
      },
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**/*.png",
      },
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**/*.jpg",
      },
    ],
  },
};

export default nextConfig;
