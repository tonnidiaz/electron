<script setup lang="ts">
    import { useWorkspaceStore } from '@/stores/workspace';
    import { TreeItem } from '@/utils/types';
    import TuFileTree from '@tufiletree/components/TuFileTree.vue';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref } from 'vue';

    const _newWorkspace = 'New workspace';
    const newWorkspace = ref(_newWorkspace);
    const newWorkspaceModalOpen = ref(false);
    const store = useWorkspaceStore();

    const win = window;

    const ddOpts = [
        {
            label: "New workspace",
            async onSelect() {
                newWorkspaceModalOpen.value = true;
            }
        }
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

    onMounted(() => {
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

            <TuFileTree v-for="tree of store.workspaces" class="w-full" :tree="tree" @item-active="async (it) => {
                if (it.children) return
                console.log({ label: it.label, cid: it.contentId })
                try {
                    const res = it.contentId ?
                        await win.electronAPI.invoke('getTreeItemContent', it.contentId) :
                        await win.electronAPI.invoke('createTreeItemContent');
                    if (!it.contentId) {
                        it.contentId = res.id;
                        res.name = it.label;
                        await win.electronAPI.invoke('updateTreeItemContent', JSON.stringify(res))
                    }
                    store.item = it
                    store.content = res
                }
                catch (err) {
                    console.log(err)
                }

            }" @create-new-item="async (item: TreeItem) => {
                item.treeId = tree.id
                console.log('New',item)
                item = await win.electronAPI.invoke('createTreeItem', item);
                return item
            }" />
            <!--   -->
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