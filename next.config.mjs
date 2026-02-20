/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
    styledComponents: true,
  },
   images: {
     remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', 
        port: '3000', 
        pathname: '/images/**',
      },
    ],
  },
  /* config options here */
  reactStrictMode: false,
};



export default nextConfig;
