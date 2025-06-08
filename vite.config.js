import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    base: '/',
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@core': path.resolve(__dirname, './src/core'),
            '@scss': path.resolve(__dirname, './src/core/scss'),
            '@views': path.resolve(__dirname, './src/views'),
            '@components': path.resolve(__dirname, './src/components'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@services': path.resolve(__dirname, './src/services'),
            '@constants': path.resolve(__dirname, './src/constants'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
        exclude: [],
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
                '.jsx': 'jsx'
            },
        },
    },
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.jsx?$/,
        exclude: [],
    },
    server: {
        port: 3000,
        open: true,
        hmr: {
            overlay: false
        },
        historyApiFallback: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@scss/variables" as *;`,
                includePaths: [path.resolve(__dirname, 'src/core/scss')],
            },
        },
    }
}); 