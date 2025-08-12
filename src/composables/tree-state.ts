import { TreeItem } from "@/utils/types";
import { ref } from "vue";

export const useTreeState = () => {
    const newOpts = ref({ req: "New HTTP request", col: "New collection" });
    const newOpt = ref<keyof typeof newOpts.value>("req");

    const renameModalOpen = ref(false);
    const isRename = ref(false);

    const currItem = ref<{ id?: number; label: string; isFolder: boolean }>(
        null
    );

    const openCreateModal = (isFolder: boolean) => {
        currItem.value = {
            label: !isFolder ? newOpts.value.req : newOpts.value.col,
            isFolder,
        };
        renameModalOpen.value = true;
        isRename.value = false
    };

    const openRenameModal = (item: TreeItem) => {
        currItem.value = {
            label: item.label,
            isFolder: Array.isArray(item.children),
        };
        renameModalOpen.value = true;
        isRename.value = true
    };

    const createNewItem = async (e: any, items: TreeItem[]) => {
        e.preventDefault();
        const _currItem = currItem.value;
        let res = null;
        if (isRename.value) {
            // rename item in list
            res = _currItem.label;
           
        } else {
            // console.log({to: [...items]});
            items.push({
                label: _currItem.label,
                children: _currItem.isFolder ? [] : undefined,
                active: true,
                open: true,
            });
        }

        renameModalOpen.value = false;
        return res
    };

    return {
        renameModalOpen,
        currItem,
        newOpts,
        newOpt,
        isRename,
        openRenameModal,
        openCreateModal,
        createNewItem,
    };
};
