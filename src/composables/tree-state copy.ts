import { TreeItem } from "rs/lib";
import { ref } from "vue";

export const useTreeState = () => {
    const newOpts = ref({ req: "New HTTP request", col: "New collection" });
    const newOpt = ref<keyof typeof newOpts.value>("req");

    const renameModalOpen = ref(false);
    const currItem = ref<{ id?: number; label: string; isFolder: boolean }>(
        null
    );

    const openCreateModal = (isFolder: boolean) => {
        currItem.value = {
            label: !isFolder ? newOpts.value.req : newOpts.value.col,
            isFolder,
        };
        renameModalOpen.value = true;
    };

    const openRenameModal = (item: TreeItem) => {
        currItem.value = {
            label: item.label,
            id: item.id,
            isFolder: Array.isArray(item.children),
        };
        renameModalOpen.value = true;
    };

    const createNewItem = async (e: any, items: TreeItem[]) => {
        e.preventDefault();
        const _currItem = currItem.value;
        let res = _currItem.label;

        if (_currItem.id) {
            res = await window.electronAPI.invoke(
                "renameTreeItem",
                _currItem.id,
                _currItem.label
            );
        } else {
            const res = await window.electronAPI.invoke(
                "createTree",
                _currItem.label,
                _currItem.isFolder
            );

            items.push({
                id: res,
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
        openRenameModal,
        openCreateModal,
        createNewItem,
    };
};
