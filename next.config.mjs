/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: 'storage.moonpair.org' }
    ]
  }
};

export default nextConfig;
