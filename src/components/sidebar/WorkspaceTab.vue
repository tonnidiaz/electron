<script setup lang="ts">
import { testTreeItems } from '@/utils/consts';
    import { TreeItem } from '@/utils/types';
    import { onMounted, ref } from 'vue';

    const newOpts = { req: 'New HTTP request', col: 'New collection' }
    const newOpt = ref<keyof typeof newOpts>('req');

    const treeItems = ref<TreeItem[]>(testTreeItems)

    const ddOpts = Object.entries(newOpts).map(([k, v]) => ({ label: v, onSelect() { newOpt.value = k as any; createNewCollection() } }))

    const createNewCollection = () => {
        const what = newOpt.value;
        const treeItem: TreeItem = { label: what == 'req' ? 'New request' : 'New collection', editable: true, active: true }
        if (what == 'col') treeItem.children = [];
        treeItems.value.push(treeItem)
    }

    onMounted(() => {
    })
</script>

<template>

    <div class="mt-1">
        <div class="flex justify-between items-center gap-2 mb-1">
            <h3 class="text-xs">WORKSPACE</h3>
            <UDropdownMenu :items="ddOpts">
                <UButton variant="soft" color="neutral" size="xs" icon="i-tabler-dots" />
            </UDropdownMenu>
        </div>
        <div class="" v-if="!treeItems?.length">
            <UButtonGroup class="w-full" color="primary">
                <UButton size="xs" @click="createNewCollection" :label="newOpts[newOpt]" icon="i-tabler-plus"
                    class="flex-1 justify-center" />
                <UDropdownMenu class="border-l border-l-accented/40" color="primary" :items="[
                    ...ddOpts
                ]">
                    <UButton size="xs" icon="i-tabler-chevron-down" color="primary" />
                </UDropdownMenu>
            </UButtonGroup>
        </div>
        <TuTree file-icon="i-tabler-http-get" v-else :ui="{ prefix: 'font-extrabold' }" new-file-label="New HTTP request"
            new-folder-label="New collection" new-file-name="HTTP request" new-folder-name="New collection"
            :items="treeItems" />
    </div>

</template>