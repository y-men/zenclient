// // Import the next-transpile-modules function using ES module syntax
// import withTM from 'next-transpile-modules';

// // Define the packages that need transpilation
// const includedPackages = ['react-dropdown']; // add any other packages here

// const nextConfig = {
//   webpack(config, { dev, isServer }) {
//     if (dev && !isServer) {
//       // Enables source maps in development for client-side code
//       config.devtool = 'source-map';
//     }
//     return config;
//   }
// };

// // Wrap your nextConfig with withTM to apply the transpile modules plugin
// export default withTM(includedPackages)(nextConfig);


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
