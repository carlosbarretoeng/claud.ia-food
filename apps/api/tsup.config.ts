import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  target: "node24",
  clean: true,
  // Os pacotes do workspace exportam TypeScript: entram no bundle.
  noExternal: [/^@claudia-food\//],
});
