import { defineConfig } from "vite";
// https://vitejs.dev/config
export default defineConfig({
    build: {
       rollupOptions:{
        output:{
            entryFileNames: 'main.cjs'
        }
       }
    },
    optimizeDeps:{
        include: ["tulib"],
    },
    plugins: [
      
    ],
    resolve: {
        preserveSymlinks: true,
        extensions: [".js", "cjs", "mjs", ".ts", ".jsx", ".tsx", ".css", ".json", ".node"],
    },
});
