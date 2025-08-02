import { METHODS } from "./consts";

export type Method = typeof METHODS[number]
export type HttpOpts = [string, any][];