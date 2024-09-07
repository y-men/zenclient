
// -----
/** @type {import('next').NextConfig} */

import removeImports from 'next-remove-imports';

const nextConfig = removeImports()({
    images: {
        domains: ['images.unsplash.com'], // Allow images from unsplash
    },

    webpack(config, { dev, isServer }) {
        if (dev && !isServer) {
            // Enables source maps in development for client-side code
            config.devtool = 'source-map';
        }
        return config;
    }
});
export default nextConfig;


