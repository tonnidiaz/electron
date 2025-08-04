<script setup lang="ts">
    import { ref, watch } from 'vue';
    import TuTreeItem from './TuTreeItem.vue';
    import _ from 'lodash';
    import { TreeItem } from '@/utils/types';
    import { useTreeStore } from '@/stores/tree';

    const store = useTreeStore()

    export type TreeProps = {
        items: TreeItem[]; parent?: TreeItem;
        newFileLabel?: string; newFolderLabel?: string;
        fileIcon?: string; folderIcon?: string;
        newFileName?: string; newFolderName?: string; ui?: { prefix?: string }, newFilePrefix?: string
    };
    const treeRef = ref<HTMLUListElement>()

    const props = withDefaults(defineProps<TreeProps>(), {

    });

    const items = ref(props.items);

    watch(props, _props => {
        const storeKeys = store.keys;
        for (let [k, v] of Object.entries(_props)) {
            if (v && storeKeys.includes(k)) {
                store[k] = v
            }
        }
    }, { deep: false, immediate: true });

</script>

<template>
    <ul ref="treeRef" class="tu-tree max-w-fit">
        <TuTreeItem v-for="item of items" :items="items" :item="item" />
    </ul>
</template>