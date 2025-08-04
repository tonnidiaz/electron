import { METHODS } from "./consts";
import type CodeMirror from "vue-codemirror6";
import type { VNodeProps, AllowedComponentProps } from "vue";
export type Method = (typeof METHODS)[number];
export type HttpOpts = [string, any][];

type RawProps = InstanceType<typeof CodeMirror>["$props"];
export type PublicCodeMirrorProps = Omit<
    RawProps,
    keyof VNodeProps | keyof AllowedComponentProps
>;

export type TableSelection = { [k: number]: boolean };
export type Collection = {
    name: string;
    url?: StorageManager;
    method?: string;
    params?: HttpOpts;
    headers?: HttpOpts;
    body?: string;
    selected?: TableSelection;
    children?: number[]
};
export type TreeItem = {
    label?: string;
    prefix?: string;
    open?: boolean; editable?: boolean, active?: boolean; children?: TreeItem[]
};