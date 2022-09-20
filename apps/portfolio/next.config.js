//@ts-check

const { withNx } = require('@nrwl/next/plugins/with-nx');

const nextConfig = {
	nx: {
		svgr: false,
	},
	webpack: (config, options) => {

		config.module.rules.push({
			test: /\.(glsl)$/,
			use: ['raw-loader', 'glslify-loader'],
		});

		return config;
	}
};

module.exports = withNx(nextConfig);
