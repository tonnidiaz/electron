import { app, ipcMain } from "electron";
import { join, dirname } from "node:path";
import { HandlerKey, HandlerReturn, handlers } from "./types";
import * as addon from "../../../rs/lib"

export const initHandlers = () => {
    ipcMain.handle("greeting", async (_, name) => {
        try {
            const res = addon.hello(name);
            return res;
        } catch (e) {
            throw e;
        }
    });
    /* ipcMain.handle("init-db", async (_) => {
        try {
            const db_path = join(dirname(app.getPath("exe")), ".db", "sled");
            addon.initDb(db_path);
            return db_path;
        } catch (e) {
            throw e;
        }
    }); */

    for (let ev of Object.keys(handlers)) {
        let _k: HandlerKey = ev as any;

        ipcMain.handle(ev, async function<K extends HandlerKey>(_, ...args: any[]) : Promise<HandlerReturn<K>>{
            if (_k == "initDb") {
                const db_path = join(
                    dirname(app.getPath("exe")),
                    ".db",
                    "sled"
                );
                args = [db_path];
            }
            if (args?.length)
                console.log("\n", { k: ev, args });
            // try{
                const data = await addon[ev](...args)
                return data
            // return { ok: true, data};
            // }catch(err){
                // return {ok: false, data: err}
            // }
        });
    }
};
