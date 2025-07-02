/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This helps with the Material-UI and Styled Components styling we added.
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
