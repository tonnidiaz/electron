<template>
    <UApp>
        <main class="h-full w-full max-h-full bg-default">
            <div class="h-full max-h-full flex w-full">
                <TuSidebar/>
                <div class="flex-1 h-full max-h-full py-4">
                    <RouterView />

                </div>
            </div>
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
