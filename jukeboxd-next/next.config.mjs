/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['i.scdn.co', 'profile-pictures-jukeboxd.s3.us-east-1.amazonaws.com', 'profile-pictures-jukeboxd.s3.amazonaws.com', 'lh3.googleusercontent.com'], // Add your S3 domain here
  },
};

export default nextConfig;
