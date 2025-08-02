import { METHODS } from "./consts";
import type CodeMirror from "vue-codemirror6";
import type { VNodeProps, AllowedComponentProps } from "vue";
export type Method = typeof METHODS[number]
export type HttpOpts = [string, any][];


type RawProps = InstanceType<typeof CodeMirror>["$props"];
export type PublicCodeMirrorProps = Omit<
  RawProps,
  keyof VNodeProps | keyof AllowedComponentProps
>;

export type TableSelection = {[k: number]: boolean};