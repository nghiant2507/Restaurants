const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './app/supabase-loader.ts',
    unoptimized: false,
    minimumCacheTTL: 60,
  },
  experimental: {
    isrMemoryCacheSize: 50,
  },
  onDemandEntries: {
    maxInactiveAge: 30 * 1000,
    pagesBufferLength: 2,
  },
  api: {
    bodyParser: true,
  },
};

export default nextConfig;
