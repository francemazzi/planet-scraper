/** @type {import('next').NextConfig} */
// import withTM from "next-transpile-modules";

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/:path*", // Cambiare l'URL in base alla propria API
      },
      {
        source: "/:path*", // Aggiungi questo rewrite per le pagine di Next.js
        destination: "/:path*.html",
      },
    ];
  },
};

module.exports = nextConfig;
