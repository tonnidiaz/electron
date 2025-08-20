<script setup lang="ts">
    import { useWorkspaceStore } from '@/stores/workspace';
    import TuFileTree from '@tufiletree/components/TuFileTree.vue';
    import { onMounted, ref } from 'vue';
    import * as addon from "rs/lib"
    import { FileTree, TreeItem } from '@tufiletree/utils/types';
    import { DropdownMenuItem } from '@nuxt/ui';

    const _newWorkspace = 'New workspace';
    const newWorkspace = ref(_newWorkspace);
    const newWorkspaceModalOpen = ref(false);
    const store = useWorkspaceStore();

    const win = window;

    const ddOpts: DropdownMenuItem[] = [
        {
            label: "New workspace",
            async onSelect() {
                newWorkspaceModalOpen.value = true;
            }
        },
    ]
    const fetchFileTree = async () => {
        try {
            const trees = await window.electronAPI.invoke("fetchTrees");
            console.log({ trees })
            store.fileTrees = trees;
        } catch (err) {
            console.log(err)

        }
    }

    const createNewWorkspace = async (e: any) => {
        e.preventDefault();
        try {
            const r = await window.electronAPI.invoke('createTree', newWorkspace.value);
            store.fileTrees.push(r);
            newWorkspaceModalOpen.value = false
        } catch (err) {
            console.log(err)
        }
    }

    const onItemActive = async (open: boolean, _it: TreeItem, i: number) => {
        if (!open) return;
        const it = store.fileTrees[i].items.find(el => el.id == _it.id);
        if (it.type == 'folder') return
        try {
            const res = it.contentId ?
                await win.electronAPI.invoke('getTreeItemContent', it.contentId) :
                await win.electronAPI.invoke('createTreeItemContent');
            if (!it.contentId) {
                it.contentId = res.id;
                res.name = it.label;
                await win.electronAPI.invoke('setItemContentId', it.id, res.id)
                await win.electronAPI.invoke('updateTreeItemContent', JSON.stringify(res))
            }
            store.item = it
            store.content = res
        }
        catch (err) {
            console.log(err)
        }

    }

    const createNewItem = async (_it: TreeItem, tree: FileTree, i: number) => {
        let item: addon.TreeItem = { ..._it }
        item.treeId = tree.id
        item = await win.electronAPI.invoke('createTreeItem', item);
        store.fileTrees[i].items.push(item);
        return { ..._it, id: item.id }
    }
    onMounted(() => {
        console.log('Mounted')
        if (!store.fileTrees.length)
            fetchFileTree()
    });



</script>

<template>
    <div class="mt-1 flex flex-col max-h-full">
        <div class="flex justify-between items-center gap-2 mb-1">
            <h3 class="text-xs">Workspaces</h3>
            <UDropdownMenu :items="ddOpts">
                <UButton variant="soft" color="neutral" size="xs" icon="i-tabler-dots" />
            </UDropdownMenu>
        </div>
        <div class="flex-grow flex flex-col gap-1.5">

            <TuFileTree v-for="(tree, i) of store.workspaces" class="w-full" :tree="tree"
            :open="true"
                @item-active="(active, it) => onItemActive(active, it, i)"
                @create-new-item="it => createNewItem(it, tree, i)" @rename-item="async (id, val) => {
                    let res = win.electronAPI.invoke('renameTreeItem', id, val);
                    let item = store.fileTrees[i].items.find(el => el.id == id)
                    if (store.content && store.content.id == item.contentId) {
                        store.content.name = val
                    }
                    return res
                }" @clear-tree="async id => {
                    const tree = store.fileTrees.find(el => el.id == id)
                    await win.electronAPI.invoke('deleteTreeItems', tree.items.map(el => el.id))
                    tree.items = []

                    return
                }" @delete-item="async (id) => {
                    await win.electronAPI.invoke('deleteTreeItems', [id])
                    return true
                }" />
        </div>

        <!-- New workspace modal -->
        <UModal :title="`New workspace`" v-model:open="newWorkspaceModalOpen" @update:open="o => {
            if (!o) { newWorkspace = _newWorkspace }
        }">
            <template #body>
                <UForm :state="{ newWorkspace }" @submit="createNewWorkspace">
                    <UInput autofocus aria-selected placeholder="Workspace name..." class="w-full" required
                        v-model="newWorkspace" />
                    <div class="flex gap-2 mt-2 justify-end">
                        <UButton label="Cancel" size="sm" color="neutral" @click="newWorkspaceModalOpen = false"
                            type="button" />
                        <UButton label="Ok" size="sm" type="submit" />
                    </div>
                </UForm>
            </template>
        </UModal>
    </div>
</template>