import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  // Deploying to https://kingcos.me/moretools/
  // In production, emit asset URLs under /moretools/ to avoid root-path 404s.
  base: mode === 'production' ? '/moretools/' : '/',
  plugins: [vue()],
}))
