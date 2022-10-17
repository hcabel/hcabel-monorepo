//@ts-check

const { withNx } = require('@nrwl/next/plugins/with-nx');

const nextConfig = {
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
	i18n: {
		locales: ['en', 'fr'],
		defaultLocale: 'en',
	},
};

module.exports = withNx(nextConfig);
