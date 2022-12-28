// @ts-check

const { withNx } = require('@nrwl/next/plugins/with-nx');

const nextConfig = {
  experimental: {
    appDir: true,
  },
  headers: [
    {
      source: '/:all*(svg|jpg|png)',
      locale: false,
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, must-revalidate',
        }
      ],
    },
  ],
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
        source: '/redirects/youtube',
        destination: 'https://youtube.com/c/hugocabel',
        permanent: false
      },
      {
        source: '/redirects/github',
        destination: 'https://github.com/hcabel',
        permanent: false
      },
      {
        source: '/redirects/hugomeet',
        destination: 'https://meet.hugocabel.com',
        permanent: false
      },
      {
        source: '/redirects/unreal-vscode-helper',
        destination: 'https://marketplace.visualstudio.com/items?itemName=HugoCabel.uvch',
        permanent: false
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
