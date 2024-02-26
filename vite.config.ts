/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        istanbul({
            cypress: true,
            requireEnv: false,
        }),
    ],
    test: {
        environment: 'jsdom',
    },
    resolve: {
        alias: [{ find: '@', replacement: '/src' }],
    },
});
