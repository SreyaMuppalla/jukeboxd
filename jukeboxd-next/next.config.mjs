/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['i.scdn.co', 'lh3.googleusercontent.com', 'firebasestorage.googleapis.com'], // Add your S3 domain here
  },
};

export default nextConfig;
