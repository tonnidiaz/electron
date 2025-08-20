import { HttpOpts, TreeItem } from "@/utils/types";
import { buildFiletree } from "@tufiletree/utils/funcs";
import { FileTree, FlatTreeItem } from "@tufiletree/utils/types";
import { defineStore } from "pinia";
import * as addon from "rs/lib";

export const useWorkspaceStore = defineStore("wp", {
    state: () => ({
        fileTrees: [] as addon.FileTree[],
        content: null as addon.TreeItemContent | null,
        item: null as TreeItem,
        isSending: false,
        response: null as {
            data: string;
            config?: {
                status: number;
                duration: number;
                size: number;
                headers: HttpOpts;
            };
        } | null,
        parsedResp: "",
        file: null
    }),

    getters: {
        // parsed
        workspaces(): FileTree[]{
            return this.fileTrees.map(tree=> ({...tree, items: buildFiletree(tree.items as FlatTreeItem[]),}))

        },
    },

});
