const repoName = process.env.GITHUB_PAGES_REPO || 'motivational-quotes';
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? `/${repoName}` : '';
const assetPrefix = isGithubPages ? `${basePath}/` : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  basePath,
  ...(assetPrefix ? { assetPrefix } : {}),
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;


