<template>
    <UApp>
        <main class="h-full w-full py-4 max-h-full bg-bg">
            <RouterView/>
        </main>
    </UApp>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import UApp from '@nuxt/ui/components/App.vue'
import { RouterView } from "vue-router";

onMounted(() => {
    console.log(
        '👋 This message is being logged by "App.vue", included via Vite'
    );
});
</script>
