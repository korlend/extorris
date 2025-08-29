// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  devServer: {
    host: "0.0.0.0",
    port: 8080,
  },

  css: ["~/assets/styles/main.scss"],

  modules: ["@pinia/nuxt", "vuetify-nuxt-module", "nuxt-typed-router"],

  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
      theme: {
        themes: {
          light: {
            dark: true,
            colors: {
              // primary: colors.red.darken1, // #E53935
              // secondary: colors.red.lighten4, // #FFCDD2
            },
          },
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || "http://localhost:8093",
      commsUrl: process.env.NUXT_PUBLIC_COMMS_URL || "ws://localhost:8091",
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          // additionalData: '@use "@/assets/main.scss" as *;',
        },
      },
    },
  },
});
