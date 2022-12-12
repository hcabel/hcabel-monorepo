// @ts-check

const { withNx } = require('@nrwl/next/plugins/with-nx');

const nextConfig = {
	experimental: {
		appDir: true,
	},
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
				source: '/projects/hugomeet',
				destination: 'https://hugomeet.com',
				permanent: true,
			},
			{
				source: '/projects/unreal-vscode-helper',
				destination: 'https://marketplace.visualstudio.com/items?itemName=HugoCabel.uvch',
				permanent: true,
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
