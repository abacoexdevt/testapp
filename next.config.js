/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	publicRuntimeConfig: {
		CUSTOM_ENV: process.env.CUSTOM_ENV
	},
	images: {
		domains: ['info.coexph.com', 'api.coexstar.ph']
	}
};

module.exports = nextConfig;
