<script setup lang="ts">
    import { computed } from 'vue';

    const props = defineProps<{ items: [string, any][] }>();
    const data = computed(() => props.items.map(el => ({
        key: el.at(0) || "", value: el.at(1)
    })));
</script>

<template>
    <UTable :data="data" class="border border-muted rounded-md"></UTable>
</template>