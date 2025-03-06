/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['i.scdn.co', 'lh3.googleusercontent.com'], // Add 'i.scdn.co' here to allow loading images from spotify
  },
};

export default nextConfig;
