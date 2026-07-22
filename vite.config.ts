/// <reference types="vitest/config" />

import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import path from "node:path";
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  build: {
    minify: true,
    cssMinify: true,
  },
  plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] }),
  visualizer({
    open: true, // Automatically opens the file in your browser after build
    filename: 'bundle-report.html', // Name of the generated file
    gzipSize: true, // Shows expected gzip compressed sizes
    brotliSize: true, // Shows expected brotli compressed sizes
  }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
});
