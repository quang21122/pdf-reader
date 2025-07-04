import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle PDF.js worker
    config.resolve.alias = {
      ...config.resolve.alias,
      "pdfjs-dist/build/pdf.worker.js": "pdfjs-dist/build/pdf.worker.min.js",
    };

    // Exclude browser-specific modules from server bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "pdfjs-dist": "commonjs pdfjs-dist",
        "tesseract.js": "commonjs tesseract.js",
      });
    }

    return config;
  },
  serverExternalPackages: ["pdfjs-dist", "tesseract.js"],
};

export default nextConfig;
