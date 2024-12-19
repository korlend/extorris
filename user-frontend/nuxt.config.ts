// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  devServer: {
    host: "0.0.0.0",
    port: 8080,
  },

  css: ['~/assets/styles/main.scss'],

  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module'
  ],
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
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          // additionalData: '@use "@/assets/main.scss" as *;',
        },
      },
    },
  },
})
