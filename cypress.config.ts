import { defineConfig } from 'cypress';
import task from '@cypress/code-coverage/task';
import { devServer } from '@cypress/vite-dev-server';
import vitePreprocessor from 'cypress-vite';
import viteConfig from './vite.config';

export default defineConfig({
    env: {
        codeCoverage: {
            exclude: 'cypress/**/*.*',
        },
    },
    component: {
        devServer(devServerConfig) {
            return devServer({
                ...devServerConfig,
                framework: 'react',
                viteConfig,
            });
        },
        setupNodeEvents(on, config) {
            task(on, config);
            on('file:preprocessor', vitePreprocessor());

            return config;
        },
    },
});
