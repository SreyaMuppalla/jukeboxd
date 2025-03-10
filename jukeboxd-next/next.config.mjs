/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  output: 'export',
  images: {
    domains: ['i.scdn.co', 'lh3.googleusercontent.com'], // Allow loading images from spotify
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;