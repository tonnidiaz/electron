<script lang="ts" setup>
    import { computed, ref, watch } from 'vue';
    import { TreeProps } from './TuTree.vue';
    import { TreeItem } from '@/utils/types';
import { useTreeStore } from '@/stores/tree';

    const store = useTreeStore();

    const props = defineProps<{ items: TreeItem[], item: TreeItem; tree: HTMLUListElement; ui?: TreeProps['ui']; parent?: TreeItem }>();
    const _this = ref<{ inputRef: HTMLInputElement }>(null);

    const icon = computed(() => props.item.children ? (props.item.open ? `${store.folderIcon}-open` : store.folderIcon) : store.fileIcon)

    function newTreeItem(item: TreeItem, isFolder = false) {

        const _parent = item.children ? item : props.parent;
        const newItem = { label: isFolder ? store.newFolderName : store.newFileName, active: true, children: isFolder ? [] : null, editable: true, prefix: store.newFilePrefix };
        if (_parent) {
            _parent.open = true;
            _parent.children.push(newItem)
        } else {
            props.items.push(newItem)
        }
    }

    const ctxMenuItems = (item: TreeItem) => [
        [
            {
                label: 'Rename', icon: 'i-tabler-pencil', onSelect() { item.editable = true },
            },
            {
                label: store.newFileLabel, icon: 'i-tabler-file-plus', onSelect() { newTreeItem(item) },
            },
            { label: store.newFolderLabel, icon: 'i-tabler-folder-plus', onSelect() { newTreeItem(item, true) } },],
        [{ label: 'Delete', icon: 'i-tabler-trash', color: 'error' }]
    ]

    const out = (item: TreeItem) => {
        item.editable = false;
        setTimeout(() => { item.active = true; }, 200)

    }
    watch([() => props.item, _this], ([item, $this]) => {

        if (item.editable && $this?.inputRef) {
            const inp = $this.inputRef;
            setTimeout(() => {
                inp.focus();
                inp.onblur = () => { out(item) };
                inp.onkeyup = (e) => {
                    // console.log(e.key)
                    if (e.key.toLowerCase() == "enter")
                        out(item)
                };

            }, 200)

        }
    }, { deep: true, immediate: true })

</script>
<template>
    <UContextMenu :items="ctxMenuItems(item)">

        <UButton :disabled="item.editable" :onmouseup="() => {
            console.log('[mouse_up]', item.label)
            item.active = true
        }" @click="() => {
            item.open = !item.open;

        }" :variant="item.active ? 'soft' : 'link'" :icon="icon" :color="item.active ? 'secondary' : 'neutral'"
            :ui="{ leadingIcon: item.children && !item.open ? '*:fill-current' : '' }">
            <span :class="`${ui.prefix || ''}`" v-if="item.prefix">{{ item.prefix }}</span>
            <span v-if="!item.editable">{{ item.label }}</span>
            <UInput ref="_this" autofocus v-else size="xs" variant="subtle" v-model="item.label" />
        </UButton>
    </UContextMenu>
</template>