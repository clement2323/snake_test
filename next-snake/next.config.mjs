/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self' https:; connect-src 'self' https: ${process.env.NEXT_PUBLIC_API_URL}; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';`
          }
        ]
      }
    ]
  }
};

export default nextConfig;
