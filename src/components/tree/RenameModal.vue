<script setup lang="ts">
    import { useTreeState } from '@/composables/tree-state';
    import { TreeItem } from '@/utils/types';

    defineProps<{  state: ReturnType<typeof useTreeState>; item?: TreeItem; items: TreeItem[] }>();

</script>
<template>
    <UModal :title="state.isRename.value ? 'Rename item' : 'New item'" v-model:open="state.renameModalOpen.value"
        @update:open="o => {
            if (!o) { state.currItem.value = null }
        }">
        <template #body>
            <UForm v-if="state.currItem.value" :state="state.currItem.value" @submit="async (e) => {
                console.log({itemCh: item.children, items: [...items]})
                const r = await state.createNewItem(e, items);
                if (r && item){
                    item.label = r
                }
            }">
                <UInput autofocus aria-selected placeholder="New name" class="w-full" required
                    v-model="state.currItem.value.label" />
                <div class="flex gap-2 mt-2 justify-end">
                    <UButton label="Cancel" size="sm" color="neutral" @click="state.renameModalOpen.value = false"
                        type="button" />
                    <UButton label="Ok" size="sm" type="submit" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>