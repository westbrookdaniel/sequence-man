import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  minify: !options.watch,
  entry: ["src/index.tsx"],
  sourcemap: true,
  format: ["esm", "cjs"],
  dts: true,
  external: ["react", "zustand", "@react-spring/web", "@react-spring/rafz"],
}));
