import { defineConfig } from 'cypress';

export default defineConfig({
    env: {
        codeCoverage: {
            exclude: 'cypress/**/*.*',
        },
    },
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
        setupNodeEvents(on, config) {
            import('@cypress/code-coverage/task').then((module) => {
                module.default(on, config);
            });

            return config;
        },
    },
});
