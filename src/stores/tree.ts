import { TreeItem } from "@nuxt/ui";
import { defineStore } from "pinia";

export const useTreeStore = defineStore("tree", {
    state: () => ({
        newFileLabel: "New file",
        newFileName: "New file",
        title: "",
        newFolderLabel: "New folder",
        newFolderName: "New folder",
        newFilePrefix: "",
        folderIcon: "i-tabler-folder",
        fileIcon: "i-tabler-file",
        onItemOpen: null as (item: TreeItem) => void,
        ui: { prefix: '' },
    }),

    getters:{
        keys(){
            return Object.keys(this)
        }
    }
});
