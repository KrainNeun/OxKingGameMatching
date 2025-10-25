/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',                 // ← 静的HTMLを出力
  images: { unoptimized: true },    // ← next/imageを使う場合の対応
  basePath: isProd ? '/oxking-game-matching' : '',
  assetPrefix: isProd ? '/oxking-game-matching/' : undefined,
  trailingSlash: true,              // ← /about → /about/index.html形式で出力
};

module.exports = nextConfig;