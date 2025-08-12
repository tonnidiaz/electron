<script setup lang="ts">
    import { testTreeItems } from '@/utils/consts';
import { TreeItem } from 'rs/lib';
    import { ref } from 'vue';

    const newOpts = { req: 'New HTTP request', col: 'New collection' }
    const newOpt = ref<keyof typeof newOpts>('req');

    const treeItems = ref<TreeItem[]>(testTreeItems);

    const win = window;

    const createNewCollection = () => {
        const what = newOpt.value;
        const treeItem: TreeItem = { label: what == 'req' ? 'New request' : 'New collection'}
        if (what == 'col') treeItem.children = [];
        else { treeItem.prefix = '[GET]' }
        treeItems.value.push(treeItem);

    }

    const findTree = async () => {
        // win.electronAPI.invoke('findTree', 3434).then((r)=> console.log({r})).catch(console.log)
        // return;
        try {
            console.log('Finding tree...')
            const r = await window.electronAPI.invoke('findTree', 2305063924);
            console.log({ r })
        } catch (err) {
            console.log('Failed to find tree:', err)
        }

    }

    const createTree = async () => {
       /*  try {
            console.log('Creating tree...')
            const r = await win.electronAPI.invoke('createTree', { label: `New tree ${Date.now()}`, children: [] });
            console.log(r)
        } catch (err) {
            console.log('Failed to create tree.')
            console.log(err)
        } */

    }

</script>

<template>
    <div class="p-4 flex flex-col gap-2">
        <h1 class="text-lg font-bold">RF page</h1>
        <div class="flex gap-2 items-start">
            <div class="p-2 rounded-sm bg-elevated max-w-fit">
                <div class="mb-2 flex justify-between">
                    <h3>Workspace</h3>
                </div>
                <div class="" v-if="!treeItems?.length">
                    <UButtonGroup class="w-full" color="primary">
                        <UButton size="xs" @click="createNewCollection" :label="newOpts[newOpt]" icon="i-tabler-plus"
                            class="flex-1 justify-center" />
                        <UDropdownMenu class="border-l border-l-accented/40" color="primary" :items="[
                            ...Object.entries(newOpts).map(([k, v]) => ({ label: v, onSelect() { newOpt = k as any } }))
                        ]">
                            <UButton icon="i-tabler-chevron-down" color="primary" />
                        </UDropdownMenu>
                    </UButtonGroup>
                </div>
               <!--  <TuTree v-else :ui="{ prefix: 'font-extrabold text-warning' }" new-file-label="New HTTP request"
                    new-folder-label="New collection" new-file-name="HTTP request" new-folder-name="New collection"
                    :items="treeItems" /> -->
            </div>
            <UButton @click="async () => {
                const msg = await win.electronAPI.sayHiRust('Diaz');
                console.log(msg)
            }" label="Say hello rust" />

            <UButton @click="createTree" label="Create tree" />

            <UButton @click="findTree" label="Find tree" />
        </div>


    </div>
</template>