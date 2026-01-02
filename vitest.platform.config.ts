import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: resolve('./src/lib')
    }
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['**/__tests__/*.[jt]s?(x)']
  }
});
