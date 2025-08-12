<script setup lang="ts">
    import { computed, ref, watch } from 'vue';
    import TuTreeItem from './TuTreeItem.vue';
    import _ from 'lodash';
    import { useTreeStore } from '@/stores/tree';
    import { FileTree, TreeItem } from '@/utils/types';
    import { useTreeState } from '@/composables/tree-state';

    const store = useTreeStore()
    const treeState = useTreeState()

    export type TreeProps = {
        tree: FileTree;
        newFileLabel?: string; newFolderLabel?: string;
        fileIcon?: string; folderIcon?: string;
        title?: string,
        newFileName?: string; newFolderName?: string; ui?: { prefix?: string }, newFilePrefix?: string;
        onItemOpen?: (item: TreeItem) => void
    };
    const treeRef = ref<HTMLUListElement>()
    const props = withDefaults(defineProps<TreeProps>(), {});
    const items = computed(() => [...props.tree.items]);

    const ddOpts = [
        {
            label: "New HTTP request",
            async onSelect() {
                treeState.newOpt.value = 'req';
            }
        },
        {
            label: "New collection",
            async onSelect() {
                treeState.newOpt.value = 'col';
            }
        }
    ]

    watch(props, _props => {
        const storeKeys = store.keys;
        for (let [k, v] of Object.entries(_props)) {
            if (v && storeKeys.includes(k)) {
                store[k] = v
            }
        }
    }, { deep: false, immediate: true });

    watch(items, (items) => {
        /* if (isInit.value) { isInit.value = false }
        else  */if (items) {
            // console.log({ items })
            window.electronAPI.invoke('updateTree', JSON.stringify({ ...props.tree, items })).then().catch(console.log)
        }

    }, { deep: true })

</script>

<template>
    <div class="mt-1 flex flex-col max-h-full min-h-0">
        <UAccordion :items="[{
            label: tree.label
        }]" :ui="{ content: 'ml-2 pl-2 border-l border-l-accented', label: 'truncate', trigger: 'py-2 bg-blue-500/5 pl-2 rounded-md' }">
            <template #content>
                <div class="" v-if="!items?.length">
                    <UButtonGroup class="w-full">
                        <UButton color="neutral" variant="subtle" size="xs"
                            @click="() => treeState.openCreateModal(treeState.newOpt.value == 'col')"
                            :label="treeState.newOpts.value[treeState.newOpt.value]" icon="i-tabler-plus"
                            class="flex-1 justify-center" />
                        <UDropdownMenu class="border-l border-l-accented/40" :items="[
                            ...ddOpts
                        ]">
                            <UButton size="xs" icon="i-tabler-chevron-down" color="neutral" />
                        </UDropdownMenu>
                    </UButtonGroup>
                </div>
                <ul ref="treeRef" class="tu-tree max-w-fit **:font-normal">
                    <TuTreeItem v-for="(item, i) of items" :items="items" :item="item" :index="i"/>
                </ul>
            </template>
        </UAccordion>
        <div class="flex-1 min-h-0  bg-elevated/30 relative overflow-y-scroll">
        </div>
        <RenameModal :state="treeState" :items="items" />
    </div>

</template>