import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";

type T = any[][];
 
const initialState = {
    headers: [] as T,
    params: [] as T,
    body: [] as T,
    method: "GET",
    url: "",
    response: '' as any
}

type State = typeof initialState;
type StateKey = keyof State

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setField<K extends StateKey>(state: WritableDraft<State>,  {payload} : PayloadAction<[key: K, value: State[K]]>){
            state[payload[0]] = payload[1];
        },
        updateState(state, {payload}:PayloadAction<Object>){
            const stateKeys = Object.keys(initialState);
            for  (let [k, v] of Object.entries(payload)){
                if (stateKeys.includes(k)){
                    state[k] = v;
                }
            }


        }
    }
})

export const homeStore = {
    ...homeSlice.actions, initialState
}