import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        crx({ manifest }),
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    base: './',
    build: {
        rollupOptions: {
            input: {
                'newtab/index': resolve(__dirname, 'src/newtab/index.html'),
                'popup/index': resolve(__dirname, 'src/popup/index.html'),
                'options/index': resolve(__dirname, 'src/options/index.html'),
                'background.js': resolve(__dirname, 'src/background/index.ts'),
                'content.js': resolve(__dirname, 'src/content/index.ts'),
            },
            output: {
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: (chunkInfo) => {
                    const name = chunkInfo.name;
                    if (name === 'background' || name === 'background.js') return 'background.js';
                    if (name === 'content' || name === 'content.js') return 'content.js';
                    if (name === 'newtab/index') return 'newtab/main.js';
                    if (name === 'popup/index') return 'popup/main.js';
                    if (name === 'options/index') return 'options/main.js';
                    return 'assets/[name]-[hash].js';
                },
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
        target: 'esnext',
        minify: 'esbuild',
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'framer-motion', 'lucide-react']
    }
})