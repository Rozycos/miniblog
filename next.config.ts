import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Możesz zostawić dla testów
      },
      {
        protocol: 'https',
        hostname: 'pub-bcf024e9e1864d359f9a6ac7b4c8e318.r2.dev',
        pathname: '/**', // Pozwala na wszystkie ścieżki z tego hosta
      },
    ],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
