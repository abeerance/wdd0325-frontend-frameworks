// next.config.ts
import type { NextConfig } from "next";

// The one host the image optimizer may fetch from: the API, at the address the server
// already uses. This file runs once, when the server starts or the build begins, so the
// address is read here and frozen into what it produces.
if (!process.env.API_URL) {
  throw new Error("API_URL is not set. It belongs in .env.local.");
}

const api = new URL(process.env.API_URL);

if (api.protocol !== "http:" && api.protocol !== "https:") {
  throw new Error(
    `API_URL must start with http:// or https://, not ${api.protocol}//`,
  );
}

// Protocol, host and port of every photo address. `port` is '' when the address names none.
const apiHost = {
  protocol: api.protocol === "https:" ? "https" : "http",
  hostname: api.hostname,
  port: api.port,
} as const;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Exactly the two photo routes on the API's own protocol, host and port. `search` is
    // left out because it only matches one exact query string, and every photo address
    // ends in its own `?v=` version.
    remotePatterns: [
      { ...apiHost, pathname: "/api/varieties/*/photo" },
      { ...apiHost, pathname: "/api/harvest-notes/*/photo" },
    ],
    // The photo routes never redirect. A redirect is followed without checking the
    // patterns above again, so none is followed at all.
    maximumRedirects: 0,
    // The optimizer refuses addresses on a private network unless this is on. It is on only
    // while the API itself runs on this machine, which is the one private address the
    // patterns above can name.
    dangerouslyAllowLocalIP: api.hostname === "localhost",
    // Every resized copy is kept on disk, and a made-up `?v=` makes one more. The stored
    // copies stop at 500 MB, and the least recently used go first once they pass it.
    maximumDiskCacheSize: 500_000_000,
  },
};

export default nextConfig;
