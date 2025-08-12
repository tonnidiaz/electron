<script setup lang="ts">
    import { useWorkspaceStore } from '@/stores/workspace';
    import { it } from 'node:test';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref } from 'vue';

    const _newWorkspace = 'New workspace';
    const newWorkspace = ref(_newWorkspace);
    const newWorkspaceModalOpen = ref(false);
    const store = useWorkspaceStore();

    const { workspaces: fileTrees } = storeToRefs(store)

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
            store.workspaces = trees;
        } catch (err) {
            console.log(err)

        }
    }

    const createNewWorkspace = async (e: any) => {
        e.preventDefault();
        try {
            const r = await window.electronAPI.invoke('createTree', newWorkspace.value);
            store.workspaces.push(r);
            newWorkspaceModalOpen.value = false
        } catch (err) {
            console.log(err)
        }
    }

    onMounted(() => {
        fetchFileTree()
    });

    /* watch(fileTrees, (items) => {
        if (items) {
            console.log({ items })
            window.electronAPI.invoke('updateTree', JSON.stringify({ ...props.tree, items })).then().catch(console.log)
        }

    }, { deep: true }) */

</script>

<template>
    <div class="mt-1 flex flex-col max-h-full">
        <div class="flex justify-between items-center gap-2 mb-1">
            <h3 class="text-xs">Workspaces</h3>
            <UDropdownMenu :items="ddOpts">
                <UButton variant="soft" color="neutral" size="xs" icon="i-tabler-dots" />
            </UDropdownMenu>
        </div>
        <div class="flex-grow">
            <TuTree v-for="tree of fileTrees" :tree="tree" @item-open="async (it) => {

                try {
                    const res = it.contentId ?
                        await win.electronAPI.invoke('getTreeItemContent', it.contentId) :
                        await win.electronAPI.invoke('createTreeItemContent');

                    it.contentId = res.id;
                    store.content = { ...it.content, parsedResp: '' }
                }
                catch (err) {
                    console.log(err)
                }

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