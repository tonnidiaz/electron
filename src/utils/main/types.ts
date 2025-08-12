import * as addon from "../../../rs/lib";

export const handlers = {
    ...addon
};
export type Handlers = typeof handlers;
export type HandlerKey = keyof Handlers;

export type HandlerParams<K extends HandlerKey> = Parameters<Handlers[K]>;
export type HandlerReturn<K extends HandlerKey> = ReturnType<Handlers[K]>;
