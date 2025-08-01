import { formatCode } from "@/utils/funcs";
import { Method } from "@/utils/types";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

type T = [string, any][];
// const testUrl = "http://localhost:8000/bots/wuecwiuhfwehiufw?full=true";

export type TKey = "params" | "body" | "headers";

export const useHomeStore = defineStore("home", () => {
    const headers = ref<T>([]),
        params = ref<T>([]),
        body = ref<T>([]),
        method = ref<Method>("GET"),
        url = ref(""),
        response = ref<any>(""),
        parsedResp = ref<any>("");

    const updateState = (newState: any) =>{
        for (let [k, _state] of Object.entries(state)){
            const v = newState[k]; 
            if (v){
                _state.value = v;
            }
        }
    }

    watch(
        response,
        async (res) => {
            if (res && typeof res == "object") {
                formatCode(JSON.stringify(res)).then(
                    (v) => (parsedResp.value = v)
                );
            } else {
                parsedResp.value = (res || "").toString();
            }
        },
        {immediate: true}
    );
    const state = { headers, params, body, url, method, response, parsedResp };

    return { ...state, updateState };
});
