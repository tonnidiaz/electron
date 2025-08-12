<script lang="ts" setup>
    import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, toRaw } from 'vue';
    import { useTreeStore } from '@/stores/tree';
    import { useTreeState } from '@/composables/tree-state';
import { TreeItem } from '@/utils/types';

    const store = useTreeStore();
    const treeState = useTreeState()

    const {openCreateModal, openRenameModal} = treeState

    const props = defineProps<{ item: TreeItem; items: TreeItem[]; index: number; }>();

    const $item = ref({ ...toRaw(props.item), children: props.item.children ? [] : undefined })

    const icon = computed(() => props.item.children ? (props.item.open ? `${store.folderIcon}-open` : store.folderIcon) : store.fileIcon)
    const _items = computed(() => props.item.children || props.items);

    const ctxMenuItems = ($item: TreeItem) => [
        [
            {
                label: 'Rename', icon: 'i-tabler-pencil', onSelect() {
                    openRenameModal($item)
                },
            },
            {
                label: store.newFileLabel, icon: 'i-tabler-file-plus', onSelect() { openCreateModal(false); $item.open = true },
            },
            { label: store.newFolderLabel, icon: 'i-tabler-folder-plus', onSelect() { openCreateModal(true); $item.open = true } },],
        [{
            label: 'Delete', icon: 'i-tabler-trash', color: 'error', onSelect() {
                if (window.confirm(`Are you sure you want to delete ${$item.label}?`)) {
                    console.log({...props.items}, props.index)
                    const rm = props.items.splice(props.index, 1)
                    console.log({rm: [...rm]})
                }
            }
        }]
    ]


    function deactivateAll() {
        $item.value.active = false;
    }

    function onDocClick() {
        deactivateAll();
    }


    onMounted(() => {
        document.removeEventListener('mousedown', onDocClick)
        document.addEventListener('mousedown', onDocClick)
    })

    onBeforeUnmount(() => {
        document?.removeEventListener('mousedown', onDocClick)
    });
    onUnmounted(() => {
        document?.removeEventListener('mousedown', onDocClick)
    });



</script>
<template>
    <li class="w-full p-0 m-0">
        <UContextMenu :items="ctxMenuItems($item)">

            <UButton :onmouseup="() => {
                $item.active = true
            }" @click="() => {
                $item.open = !$item.open;
                if ($item.open){
                    store.onItemOpen?.(item)
                }
            }" :variant="$item.active ? 'soft' : 'link'" :icon="icon" :color="$item.active ? 'secondary' : 'neutral'"
                :ui="{ base: 'w-full px-1 py-1 my-0.5', leadingIcon: $item.children && !$item.open ? '*:fill-current' : '' }">
                <div class="flex-1 text-start">
                    <span :class="`${store.ui.prefix || ''}`" v-if="$item.prefix">{{ $item.prefix }}</span>
                    <span class="truncate">{{ $item.label }}</span>
                </div>
                
                <UButton v-if="$item.children" size="xs" color="neutral" variant="ghost" :icon="$item.open ? 'i-tabler-chevron-up' : 'i-tabler-chevron-down'"/>

            </UButton>
        </UContextMenu>
        <RenameModal :state="treeState" :items="_items" :item="$item"/>
        <ul v-if="$item.children && $item.open" class="ml-4.5 pl-2 border-l border-l-accented" v-for="(ch, i) of item.children">
            <TuTreeItem :item="ch" :index="i" :items="ch.children || props.items" />
        </ul>

    </li>

</template>