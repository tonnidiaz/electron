import prettier from "prettier/standalone";
import estreePlugin from "prettier/plugins/estree";
import babelPlugin from "prettier/plugins/babel";
export const sleep = (ms: number) =>
    new Promise((res) => {
        setTimeout(() => {
            res(ms);
        }, ms);
    });

export const isValidURL = (s: string) => {
    try {
        let url = new URL(s);
        return url;
    } catch (_) {
        return null;
    }
};

export const formatCode = async (code: string) =>
    await prettier.format(code, {
        parser: "json",
        plugins: [babelPlugin, estreePlugin],
        semi: true,
    });
