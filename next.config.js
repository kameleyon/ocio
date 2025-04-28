/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cfovctpyutyvyqzvypwx.supabase.co'],
  },
  // Disable prerendering
  output: "standalone"
}

module.exports = nextConfig
