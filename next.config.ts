import type { NextConfig } from "next";

const config: NextConfig = {
  // The home page is per-request (LAUNCH_MODE, user agent). Keep <title>, description and og tags
  // in <head> for every visitor instead of streaming them in later, so every crawler sees them.
  htmlLimitedBots: /.*/,
};
export default config;
