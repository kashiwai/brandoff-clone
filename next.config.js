/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Turso/libSQL関連のモジュールをサーバーサイドのみで処理
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // MDファイルとLICENSEファイルを無視
    config.module.rules.push({
      test: /\.(md|MD|LICENSE)$/,
      use: 'null-loader'
    });

    return config;
  },
  // Tursoアダプターを外部依存として扱う
  experimental: {
    serverComponentsExternalPackages: [
      '@libsql/client',
      '@prisma/adapter-libsql'
    ]
  }
}

module.exports = nextConfig