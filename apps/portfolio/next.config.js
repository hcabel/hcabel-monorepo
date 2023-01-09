// @ts-check

const { withNx } = require('@nrwl/next/plugins/with-nx');

const nextConfig = {
  experimental: {
    appDir: true,
  },
  compress: true,
  reactStrictMode: true,
  distDir: "../../dist/apps/portfolio/.next",
  nx: {
    svgr: false,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.glsl$/,
      use: ['raw-loader', 'glslify-loader'],
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  redirects: async() => {
    return [
      {
        source: '/',
        destination: '/landing',
        permanent: true
      },
      {
        source: '/en',
        destination: '/en/landing',
        permanent: true
      },
      {
        source: '/fr',
        destination: '/fr/landing',
        permanent: true
      },
      // EXTERNAL REDIRECTS
      {
        source: '/redirects/youtube',
        destination: 'https://youtube.com/c/hugocabel',
        permanent: true
      },
      {
        source: '/redirects/github',
        destination: 'https://github.com/hcabel',
        permanent: true
      },
      {
        source: '/redirects/hugomeet',
        destination: 'https://meet.hugocabel.com',
        permanent: true
      },
      {
        source: '/redirects/unreal-vscode-helper',
        destination: 'https://marketplace.visualstudio.com/items?itemName=HugoCabel.uvch',
        permanent: true
      }
    ];
  },
  rewrites: async() => {
    return [
      {
        source: '/',
        destination: '/landing'
      },
      {
        source: '/en',
        destination: '/en/landing'
      },
      {
        source: '/fr',
        destination: '/fr/landing'
      }
    ];
  },
  // Does not yet work with app directory
  // i18n: {
  // 	locales: ['en', 'fr'],
  // 	defaultLocale: 'en',
  // },
};

module.exports = withNx(nextConfig);
