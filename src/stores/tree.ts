import { TreeItem } from "@/utils/types";
import { defineStore } from "pinia";

export const useTreeStore = defineStore("tree", {
    state: () => ({
        items: [] as TreeItem[],
        newFileLabel: "New file",
        newFileName: "New file",
        newFolderLabel: "New folder",
        newFolderName: "New folder",
        newFilePrefix: "",
        folderIcon: "i-tabler-folder",
        fileIcon: "i-tabler-file",
        ui: { prefix: '' }
    }),

    getters:{
        keys(){
            return Object.keys(this)
        }
    }
});
