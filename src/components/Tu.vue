<script setup lang="ts">
import { useHomeStore } from '@/stores/home';

    const homeStore = useHomeStore()
</script>

<template>
    <div class="p-4 rounded-sm border-1 border-neutral-700 flex-center flex-col">
        <h1>Just a Tu component</h1>
        <div class="my-2">
            {{ JSON.stringify(homeStore, null, "    ") }}
        </div>
    </div>
</template>