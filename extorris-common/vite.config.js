import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin({ useStrictCSP: true, relativeCSSInjection: false }),
    dts({ rollupTypes: true }),
  ],
  build: {
    lib: {
      name: "vue3-extorris",
      entry: resolve(__dirname, "src/index.ts"),
      fileName: (format) => `vue3-extorris-common.${format}.js`,
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
