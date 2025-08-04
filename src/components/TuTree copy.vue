<script setup lang="ts">
    import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
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

    function deactivateAll(items: TreeItem[]) {
        for (let item of items) {
            item.active = false;
            if (item.children) {
                deactivateAll(item.children)
            }
        }
    }

    function onDocClick() {
        // if (e.button == 0)
        deactivateAll(items.value);
    }

    const addItem = (item: TreeItem) =>{
        items.value.push()
    }

    onMounted(() => {

        // if (!treeRef.value) return;
        // deactivateAll(props.items)
        document.removeEventListener('mousedown', onDocClick)
        document.addEventListener('mousedown', onDocClick)
    })

    onBeforeUnmount(() => {
        document?.removeEventListener('mousedown', onDocClick)
    });
    onUnmounted(() => {
        document?.removeEventListener('mousedown', onDocClick)
    });

    watch(props, _props =>{
        const storeKeys = store.keys;
        for ( let [k, v] of Object.entries(_props) ){
            if (v && storeKeys.includes(k)){
                store[k] = v
            }
        }
    }, { deep: false, immediate: true })
</script>

<template>
    <ul ref="treeRef" class="tu-tree max-w-fit">
        <li v-on:focusout="() => {
            console.log('[on_blur]', item.label)
            item.active = false
        }" v-for="item of _.orderBy(items, [item => item.children, 'label'], ['asc', 'asc'])" class="tu-tree-item">
            <TuTreeItem :items="items" :ui="ui" :item="item" :tree="treeRef" :parent="props.parent" />
            <TuTree v-bind="$props" class="ml-3" v-if="item.children && item.open" :items="item.children"
                :parent="item" />
        </li>
    </ul>
</template>