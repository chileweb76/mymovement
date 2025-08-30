/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// Use remotePatterns instead of domains (domains is deprecated)
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				pathname: '/**',
			},
			// add other remotePatterns entries here as needed
		],
	},
};

export default nextConfig;
