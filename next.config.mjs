
// -----
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { dev, isServer }) {
        if (dev && !isServer) {
            // Enables source maps in development for client-side code
            config.devtool = 'source-map';
        }
        return config;
    }
};




export default nextConfig;
