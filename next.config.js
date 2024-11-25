/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  staticPageGenerationTimeout: 300,
  images: {
    unoptimized: true,
    domains: ['img.clerk.com'],
  },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });

    if (!dev) {
      config.devtool = false;
    }

    config.module.parser = {
      ...config.module.parser,
      javascript: {
        ...config.module.parser?.javascript,
        dynamicImportMode: 'eager'
      }
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
      };
    }

    return config;
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
