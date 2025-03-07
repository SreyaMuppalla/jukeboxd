/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['i.scdn.co', 'lh3.googleusercontent.com'], // Allow loading images from spotify
  },
  distDir: 'build',
};

export default nextConfig;