<script lang="ts" setup>
    import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, toRaw, watch } from 'vue';
    import { TreeItem } from '@/utils/types';
    import { useTreeStore } from '@/stores/tree';

    const store = useTreeStore();

    const props = defineProps<{ item: TreeItem; parent?: TreeItem }>();
    const _this = ref<{ inputRef: HTMLInputElement }>(null);
    const $item = ref({ ...toRaw(props.item), children: props.item.children ? [] : null })

    const icon = computed(() => props.item.children ? (props.item.open ? `${store.folderIcon}-open` : store.folderIcon) : store.fileIcon)

    function newTreeItem(isFolder = false) {

        const _parent = props.item.children ? props.item : props.parent;
        const newItem = { label: isFolder ? store.newFolderName : store.newFileName, active: true, children: isFolder ? [] : null, editable: true, prefix: store.newFilePrefix };
        if (_parent) {
            _parent.open = true;
            _parent.children.push(newItem)
        } else {
            store.items.push(newItem)
        }
    }

    const ctxMenuItems = ($item: TreeItem) => [
        [
            {
                label: 'Rename', icon: 'i-tabler-pencil', onSelect() { $item.editable = true },
            },
            {
                label: store.newFileLabel, icon: 'i-tabler-file-plus', onSelect() { newTreeItem() },
            },
            { label: store.newFolderLabel, icon: 'i-tabler-folder-plus', onSelect() { newTreeItem(true) } },],
        [{ label: 'Delete', icon: 'i-tabler-trash', color: 'error' }]
    ]

    const out = ($item: TreeItem) => {
        $item.editable = false;
        setTimeout(() => { $item.active = true; }, 200)

    }


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


    watch([$item, _this], ([$item, $this]) => {

        if ($item.editable && $this?.inputRef) {
            const inp = $this.inputRef;
            setTimeout(() => {
                inp.focus();
                inp.onblur = () => { out($item) };
                inp.onkeyup = (e) => {
                    // console.log(e.key)
                    if (e.key.toLowerCase() == "enter")
                        out($item)
                };

            }, 200)

        }
    }, { deep: true, immediate: true })

</script>
<template>
    <li class="w-full p-0 m-0">
        <UContextMenu :items="ctxMenuItems($item)">

            <UButton :disabled="$item.editable" :onmouseup="() => {
                $item.active = true
            }" @click="() => {
                $item.open = !$item.open;

            }" :variant="$item.active ? 'soft' : 'link'" :icon="icon" :color="$item.active ? 'secondary' : 'neutral'"
                :ui="{ base: 'w-full', leadingIcon: $item.children && !$item.open ? '*:fill-current' : '' }">
                <span :class="`${store.ui.prefix || ''}`" v-if="$item.prefix">{{ $item.prefix }}</span>
                <span v-if="!$item.editable">{{ item.label }}</span>
                <UInput ref="_this" autofocus v-else size="xs" variant="subtle" v-model="item.label" />
            </UButton>
        </UContextMenu>
        <ul v-if="$item.children && $item.open" class="ml-4.5 border-l border-l-accented" v-for="ch of item.children">
            <TuTreeItem :item="ch" :parent="item" />
        </ul>
    </li>

</template>