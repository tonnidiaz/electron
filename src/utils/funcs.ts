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
