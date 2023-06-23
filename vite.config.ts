import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        react(),
        tsConfigPaths(),
        dts({
            include: ['src'],
            insertTypesEntry: true,
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'phenomenon-ui',
            formats: ['es', 'umd', 'cjs'],
            fileName: (format) => {
                return `phenomenon-ui.${format === 'cjs' ? 'cjs' : 'es.js'}`;
            },
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
