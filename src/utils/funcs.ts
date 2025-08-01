import prettier from "prettier/standalone";
import estreePlugin from "prettier/plugins/estree";
import babelPlugin from "prettier/plugins/babel";

export const pxToPerc = (px: number, parentPx: number) => px / parentPx * 100;
export const isValidURL = (s: string) => {
    try {
        let url = new URL(s);
        return url;
    } catch (_) {
        return null;
    }
};

export const searchParamsToEntries = (params: URLSearchParams) => {
    return Object.entries(Object.fromEntries(params))
}

export const formatCode = async (code: string) =>
    await prettier.format(code, {
        parser: "json",
        plugins: [babelPlugin, estreePlugin],
        semi: true,
    });
