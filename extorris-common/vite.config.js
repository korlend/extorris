import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin({ useStrictCSP: true, relativeCSSInjection: false }),
    // dts({ rollupTypes: true }),
    dts({ insertTypesEntry: true }),
  ],
  build: {
    lib: {
      name: "extorris-common",
      entry: resolve(__dirname, "src/index.ts"),
      fileName: (format) => `extorris-common.${format}.js`,
    },
    emptyOutDir: true,
    rollupOptions: {
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
