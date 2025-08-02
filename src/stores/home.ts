import { HttpOpts, Method } from "@/utils/types";
import { defineStore } from "pinia";

type T = [string, any][];
// const testUrl = "http://localhost:8000/bots/wuecwiuhfwehiufw?full=true";

export type TKey = "params" | "body" | "headers";

export const useHomeStore = defineStore("home", {
    state: () => {
        console.log('Homeview')
        return {
        headers: [] as T,
        params: [] as T,
        body: "",
        url: "",
        method: "GET" as Method,
        response: { data: "" as any, config: null as {
            status: number;
            duration: number;
            size: number;
            headers: HttpOpts;
        }},
        parsedResp: "" as any,
        file: null
    }},
    actions: {
      updateState(newState: any) {
            for (let [k, _state] of Object.entries(this.$state)) {
                const v = newState[k];
                if (v) {
                    this[k] = v;
                }
            }
        },
    },
});



