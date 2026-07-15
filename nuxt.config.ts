export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/eslint', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  css: ['~/assets/css/main.scss'],
  runtimeConfig: {
    public: {
      apiBaseURL: process.env.API_BASE_URL_CLIENT
    }
  },
  vite: {
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  nitro: {
    experimental: {
      websocket: true
    }
  }
})
