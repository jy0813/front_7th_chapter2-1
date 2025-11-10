import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/front_7th_chapter2-1/' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));
