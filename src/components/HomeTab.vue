<script setup lang="ts">
    import { TableColumn } from '@nuxt/ui/runtime/components/Table.vue.js';
    import { computed, h, resolveComponent } from 'vue';
    import { useHomeStore } from '@/stores/home';

    const props = defineProps<{ k: 'params' | 'body' | 'headers' }>();

    const homeStore = useHomeStore()

    type Row = { key: string, value: any };

    const data = computed<Row[]>(() => [...homeStore[props.k], []].map(el => ({
        key: el.at(0) || "", value: el.at(1)
    })))

    const UInput = resolveComponent("UInput");
    const columns: TableColumn<Row>[] = [
        {
            accessorKey: 'key', header: 'key', cell: ({ row }) => {
                const item = homeStore[props.k];
                // console.log({item})
                return h(UInput, {
                    placeholder: 'key', class: 'w-full', modelValue: item[row.index]?.at(0), 'onUpdate:modelValue': (k) => {
                        item[row.index] = [k, item[row.index]?.at(1) || ''];
                        if ((!k && !item[row.index].at(1)) && row.index + 2 == data.value.length) {
                            item.pop();
                        } else if (k && item.length <= row.index) {
                            item.push(["", ""])
                        }
                    }
                })
            }
        },
        {
            accessorKey: 'value', header: 'value', cell: ({ row }) => {
                const item = homeStore[props.k];
                return h(UInput, {
                    placeholder: 'value', class: 'w-full', modelValue: item[row.index]?.at(1), 'onUpdate:modelValue': (k) => {
                        item[row.index] = [item[row.index]?.at(0) || '', k];
                    }
                })
            }
        },

    ]
</script>
<template>
    <div class="w-full flex-col">
        <UTable :columns="columns" :data="data" class="border border-muted rounded-md"></UTable>
    </div>
</template>