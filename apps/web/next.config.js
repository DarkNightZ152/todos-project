import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    outputFileTracingRoot: path.join(process.cwd(), "../../"),
  },
  webpack: (config) => {
    return {
      ...config,
      externals: [...config.externals, "pino-pretty", "encoding"],
    };
  },
  rewrites: () => {
    return [
      {
        source: "/trpc/:path*",
        destination: `${process.env.TRPC_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
