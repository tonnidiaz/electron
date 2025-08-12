import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions:{
         output:{
             entryFileNames: 'main.cjs'
         },
         
        }
     },
    plugins: [
        viteStaticCopy({
            targets: [
                { src: "rs/lib/*.node", dest: "." }
            ]
        })
    ],
    resolve:{
        preserveSymlinks: true
    }
});