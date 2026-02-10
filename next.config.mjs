/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    inlineCss: true,
    useCache: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
