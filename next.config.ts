import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Suppress punycode deprecation warnings
    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ },
      /Critical dependency: the request of a dependency is an expression/,
    ];
    // Handle PDF.js worker for client-side
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "pdfjs-dist/build/pdf.worker.js": "pdfjs-dist/build/pdf.worker.min.js",
      };
    }

    // Completely exclude browser-specific modules from server bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        "pdfjs-dist",
        "tesseract.js",
        "canvas",
        /^pdfjs-dist\/.*/,
        /^tesseract\.js\/.*/
      );

      // Ignore these modules during server-side bundling
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };
    }

    return config;
  },
  serverExternalPackages: ["pdfjs-dist", "tesseract.js", "canvas"],
};

export default nextConfig;
