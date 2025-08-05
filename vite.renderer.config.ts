import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tw from "@tailwindcss/vite";
import ui from "@nuxt/ui/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";
import tsConfigPaths from "vite-tsconfig-paths";
process.stdout.write("\x1Bc");
console.log("\nHello from Config\n");

const libToPath = (lib: string) => {
    let libDirname = path.dirname(import.meta.resolve(`${lib}/package.json`));
    libDirname = fileURLToPath(new URL(libDirname));
    libDirname = path.join(libDirname, "src", "*");
    let ret = libDirname;
    ret = path.relative(import.meta.dirname, ret);
    return ret;
}; 
const extLibToPath = (lib: string) => {
    let libDirname = path.dirname(import.meta.resolve(`${lib}`));
    libDirname = fileURLToPath(new URL(libDirname));
    libDirname = path.join(libDirname, "**", "*");
    let ret = path.relative(import.meta.dirname, libDirname);
    return ret;
};

const genAliases = () => {
    const refFile = "tsconfig.ref.json";
    const saveFile = "tsconfig.app.json";
    const res = readFileSync(refFile, { encoding: "utf-8" });
    const config = ts.parseConfigFileTextToJson(refFile, res).config;
    if (!config.compilerOptions.paths) {
        config.compilerOptions.paths = {};
    }
    if (!config.include) config.include = [];

    let alias: any = {};

    // add alias to config aliases
    Object.entries(alias).forEach(([k, v]) => {
        config.compilerOptions.paths[k] = [v];
        config.include.push(v);
    });
    alias = {};
    for (let [k, v] of Object.entries<string>(config.compilerOptions.paths)) {
        v = v[0].replace("/*", "");
        alias[k.replace("/*", "")] = fileURLToPath(new URL(v, import.meta.url));
    }

    console.log({ config: config.compilerOptions.paths });
    writeFileSync(saveFile, JSON.stringify(config, null, "    "));
    console.log({ alias });
    return alias;
};

// https://vitejs.dev/config
export default defineConfig({
    plugins: [
        vue(),
        tsConfigPaths(),
        tw(),
        ui({
            ui: {
                colors: {
                    primary: "teal",
                    neutral: "zinc",
                },
                icons: {
                    arrowLeft: 'i-tabler-arrow-left',
                    arrowRight: 'i-tabler-arrow-right',
                    check: 'i-tabler-check',
                    chevronDoubleLeft: 'i-tabler-chevrons-left',
                    chevronDoubleRight: 'i-tabler-chevrons-right',
                    chevronDown: 'i-tabler-chevron-down',
                    chevronLeft: 'i-tabler-chevron-left',
                    chevronRight: 'i-tabler-chevron-right',
                    chevronUp: 'i-tabler-chevron-up',
                    close: 'i-tabler-x',
                    ellipsis: 'i-tabler-dots',
                    external: 'i-tabler-arrow-up-right',
                    file: 'i-tabler-file',
                    folder: 'i-tabler-folder',
                    folderOpen: 'i-tabler-folder-open',
                    loading: 'i-tabler-loader-2',
                    minus: 'i-tabler-minus',
                    plus: 'i-tabler-plus',
                    search: 'i-tabler-search',
                    upload: 'i-tabler-upload'
                  } /* */
            },
        }) as any,
    ],

    resolve: { alias: genAliases() },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // ...
                    codemirror: ["vue-codemirror6"],
                    "codemirror-lang": [
                        // Add the following as needed.
                        "@codemirror/lang-json"
                    ],
                    "codemirror-theme": [ "@codemirror/theme-one-dark" ],
                    iconify: ["@iconify/vue"],
                    "iconify-json": [
                        // '@iconify-json/lucide',
                        '@iconify-json/tabler',
                    ]
                    // ...
                },
            },
        },
    },
    
});
