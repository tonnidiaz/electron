<script setup lang="ts">
    import { TableColumn } from '@nuxt/ui/runtime/components/Table.vue.js';
    import { computed, h } from 'vue';
    import { useHomeStore } from '@/stores/home';
    import HomeTabField from './HomeTabField.vue';
    import UCheckbox from '@nuxt/ui/runtime/components/Checkbox.vue'
    import UButton from '@nuxt/ui/runtime/components/Button.vue'

    const props = defineProps<{ k: 'params' | 'headers' }>();

    const homeStore = useHomeStore()

    type Row = { key: string, value: any };

    const data = computed<Row[]>(() => [...homeStore[props.k], ["", ""]].map(el => ({
        key: el.at(0) || "", value: el.at(1)
    })))

    const columns: TableColumn<Row>[] = [
        {
            id: 'select',
            header: ({ table }) => {
                const totalRows = table.getRowCount() - 1;
                const selectedRows = table.getSelectedRowModel().rows.length;
                return h(UCheckbox, {
                    modelValue: selectedRows > 0 && selectedRows < totalRows
                        ? 'indeterminate'
                        : selectedRows >= totalRows,
                    'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
                        table.toggleAllPageRowsSelected(!!value),
                    'aria-label': 'Select all'
                })
            },
            cell: ({ row }) =>{
                const isLastRow = row.index == homeStore[props.k].length;
                // console.log({isLastRow})
                if (isLastRow){
                    homeStore.selected[props.k][row.index] = true;
                }
                return /* isLastRow ? null : */ h(UCheckbox, {
                    disabled: isLastRow,
                    modelValue: row.getIsSelected(),
                    'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
                    'aria-label': 'Select row',
                    tabIndex: -1
                })}
        },
        {
            id: 'delete',
            cell: ({ row }) => row.index == homeStore[props.k].length ? null :
                h(UButton, {
                    size: 'xs',
                    variant: 'ghost',
                    color: 'error',
                    icon: 'i-tabler-trash-2',
                    tabIndex: -1,
                    onClick: () => {
                        homeStore[props.k].splice(row.index, 1)
                    }

                })
        },
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
        <UTable :ui="{ td: 'nth-[2]:p-0', th: 'nth-[2]:p-0', tr: 'bg-transparent! data-[selected=false]:opacity-50!' }"
            v-model:row-selection="homeStore.selected[k]" :columns="columns" :data="data"
            class="border border-muted rounded-md"></UTable>
    </div>
</template>