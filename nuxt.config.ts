// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  tailwindcss: {
    viewer: false
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/supabase',
    'nuxt-swiper'
  ],
  runtimeConfig: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
  },
  supabase: {
    redirectOptions: {
      login: '/sign-in',
      callback: '/confirm',
      include: ['/chat(/*)?', '/profile(/*)?']
    }
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }
})