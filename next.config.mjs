/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{hostname: 'localhost'}, {hostname: 'be.le.ai.hect.dev'}],
  },
};

export default nextConfig;
