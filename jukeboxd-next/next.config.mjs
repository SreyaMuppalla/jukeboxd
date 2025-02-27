/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['i.scdn.co'], // Add 'i.scdn.co' here to allow loading images from spotify
  }
};

export default nextConfig;
