import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerDeb } from "@electron-forge/maker-deb";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import fs from "node:fs";
import path from "node:path";
const config: ForgeConfig = {
    packagerConfig: {
        asar: false,
        prune: true,
        executableName: "tu-rest",
        electronZipDir:
            "/home/tonni/.cache/electron/2e41b68bb1be932044d1e1107e42ec735f070034a10acc1266011aee23d40a4c/",
        ignore: [
            /[/\\]locales[/\\](?!en(-US)?[\\/]).*/, // keep only en or en-US
            /[/\\]locale-data[/\\].*/, // optionally exclude other locale‑related folders,
            /\.ts$/,
            /\.tsx$/,
            /\.map$/,
            /\.tsx$/,
            /\.git$/,
            /\.vscode/,
            /LICENSES.chromium.html$/,
            /\.gitignore$/,
            /README\.md$/,
            /LICENSE/,
            /tests?/,
            /d3dcompiler_47\.dll$/,
            /node_modules/,
            /.vscode/,
            /out/, /dist/, /docs/,
            /config.*.json$/,
            /src/
        ],
    },
    hooks: {
        packageAfterExtract: async (
            config,
            buildPath,
            electronVersion,
            platform,
            arch
        ) => {
            let dir = fs.readdirSync(buildPath, {
                encoding: "utf-8",
                recursive: true,
            });

            for (let f of dir) {
                const fullPath = path.join(buildPath, f);
                if (
                    f == "LICENSES.chromium.html" ||
                    (f.startsWith("locales/") &&
                        !["locales/en-US.pak"].includes(f))
                ) {
                    console.log({ f });
                    console.log("Deleting...\n");
                    fs.rmSync(fullPath, { recursive: true, force: true });
                    dir = dir.filter((el) => el != f);
                }
            }
            // console.log("\n", { dir });
        },
    },
    rebuildConfig: {},
    makers: [new MakerDeb({})],
    plugins: [
        new VitePlugin({
            // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
            // If you are familiar with Vite configuration, it will look really familiar.
            build: [
                {
                    // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
                    entry: "src/main.ts",
                    config: "vite.main.config.ts",
                    target: "main",
                },
                {
                    entry: "src/preload.ts",
                    config: "vite.preload.config.ts",
                    target: "preload",
                },
            ],
            renderer: [
                {
                    name: "main_window",
                    config: "vite.renderer.config.ts",
                },
            ],
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};

export default config;
