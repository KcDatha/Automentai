import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// VITE_BASE is set by the deploy workflow (for example "/Automentai/" on GitHub Pages).
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
