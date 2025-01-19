import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.1wei.dev',
        port: '',
        pathname: '/assets/**',
        search: '',
      },
    ],
  },
}

export default nextConfig
