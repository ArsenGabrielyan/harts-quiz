/** @type {import('next').NextConfig} */
const nextConfig = {
     transpilePackages: ['react-beautiful-dnd'],
     images: {
          remotePatterns: [
               {hostname: '**'}
          ]
     }
}

module.exports = nextConfig
