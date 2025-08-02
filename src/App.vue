<template>
    <UApp>
        <main class="h-full w-full py-4 max-h-full bg-bg">
            <RouterView />
        </main>
    </UApp>
</template>

<script setup lang="ts">
    import { onMounted, watch } from "vue";
    import UApp from '@nuxt/ui/components/App.vue'
    import { RouterView } from "vue-router";
    import { useHomeStore } from "./stores/home";
    import { storeToRefs } from "pinia";
    import { formatCode } from "./utils/funcs";

    const homeStore = useHomeStore();
    const { response } = storeToRefs(homeStore);

    watch(
        response,
        async ({data: res}) => {
            if (res && typeof res == "object") {
                formatCode(JSON.stringify(res)).then(
                    (v) => (homeStore.parsedResp = v)
                );
            } else {
                homeStore.parsedResp = (res || "").toString();
            }
        },
        { immediate: true }
    );

    onMounted(() => {
        console.log(
            '👋 This message is being logged by "App.vue", included via Vite'
        );
    });
</script>
