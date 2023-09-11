import { defineConfig } from "tsup";

export default defineConfig((opts) => ({
  entryPoints: ["src/index.ts"],
  splitting: true,
  bundle: true,
  format: ["esm", "cjs"],
  dts: true,
  clean: !opts.watch,
  sourcemap: true,
  minify: true,
  outDir: "dist",
  target: "esnext",
}));
