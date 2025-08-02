<script setup lang="ts">
    import { TableColumn } from '@nuxt/ui/runtime/components/Table.vue.js';
    import { computed, h } from 'vue';
    import { useHomeStore } from '@/stores/home';
    import HomeTabField from './HomeTabField.vue';

    const props = defineProps<{ k: 'params' | 'headers' }>();

    const homeStore = useHomeStore()

    type Row = { key: string, value: any };

    const data = computed<Row[]>(() => [...homeStore[props.k], []].map(el => ({
        key: el.at(0) || "", value: el.at(1)
    })))

    const columns: TableColumn<Row>[] = [
        {
            accessorKey: 'key', header: 'key', cell: ({ row }) => {
                return h(HomeTabField, { placeholder: 'key', k: props.k, index: row.index, dataLen: data.value.length, isVal: false })
            }
        },
        {
            accessorKey: 'value', header: 'value', cell: ({ row }) => {
                return h(HomeTabField, { placeholder: 'value', k: props.k, index: row.index, dataLen: data.value.length, isVal: true })
            }
        },

    ]
</script>
<template>
    <div class="w-full flex-col">
        <UTable :columns="columns" :data="data" class="border border-muted rounded-md"></UTable>
    </div>
</template>