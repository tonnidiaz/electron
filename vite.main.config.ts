import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `main.cjs`,
            },
            external: ["tu-rest-rs"], // don't inline rs
        },
    },
    optimizeDeps: {
        exclude: ["tu-rest-rs"],
    },
});
