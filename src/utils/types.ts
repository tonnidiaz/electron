import { METHODS } from "./consts";
import type CodeMirror from "vue-codemirror6";
import type { VNodeProps, AllowedComponentProps } from "vue";
export type Method = (typeof METHODS)[number];
export type HttpOpts = [string, any][];
import * as addon from "rs/lib"

type RawProps = InstanceType<typeof CodeMirror>["$props"];
export type PublicCodeMirrorProps = Omit<
    RawProps,
    keyof VNodeProps | keyof AllowedComponentProps
>;

export type TableSelection = { [k: number]: boolean };
export type ColRequest = {
    name: string;
    treeItemId: string;
    url?: string;
    method?: string;
    params?: HttpOpts;
    headers?: HttpOpts;
    body?: string;
    selected?: TableSelection;
};
export type TreeItem = addon.TreeItem & { open?: boolean; active?: boolean; content?: addon.TreeItemContent }
export type FileTree = addon.FileTree & { items: TreeItem[]  }