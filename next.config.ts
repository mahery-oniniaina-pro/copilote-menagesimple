import type { NextConfig } from "next";

const config: NextConfig = {
  outputFileTracingIncludes: {
    "/**": ["./data/**", "./eval/**", "./recordings/**"],
  },
};

export default config;
