<script setup lang="ts">
    import { onMounted, watch } from "vue";
    import UApp from "@nuxt/ui/components/App.vue";
    import { useHomeStore } from "./stores/home";
    import { storeToRefs } from "pinia";
    import { formatCode } from "./utils/funcs";
    import { type NavigationMenuItem } from "@nuxt/ui";
import { addIconifyIcons } from "./iconify";
import RFView from "./views/RFView.vue";

    const homeStore = useHomeStore();
    const { response } = storeToRefs(homeStore);
    const menuItems: NavigationMenuItem[] = [
        {
            label: "File",
            open: true,
            children: [
                {
                    label: "Save",
                    tooltip: {
                        text: 'helo',
                        kbds: ["meta", "S"]
                    },
                    onSelect: () => {
                        console.log("Saving file...");
                    },
                },
                { label: "Save as" },
                { label: "Quit" },
            ],
        },
        {
            label: "Edit",
            children: [{ label: "Undo" }, { label: "Redo" }],
        },
    ];
    defineShortcuts(extractShortcuts(menuItems))

    const initDb = () =>{
        console.log('\nINIT_DB')
        window.electronAPI.invoke('initDb', '').then(console.log).catch(console.log)
    }
    watch(
        response,
        async ({ data: res }) => {
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
        initDb()
        addIconifyIcons().then(()=>{
            console.log('[icons addes]')
        })
    });
</script>

<template>
    <UApp>
        <main class="h-full w-full max-h-full bg-default">
            <UNavigationMenu v-if="false" :skip-delay-duration="0" trailing-icon="none" :delay-duration="0"
                :disable-pointer-leave-close="false" content-orientation="vertical" variant="link" :arrow="true" :ui="{
                    item: 'p-0!',
                    linkTrailingIcon: 'hidden',
                    viewport: 'bg-transparent min-w-0 border-none ring-0',
                    content:
                        'bg-neutral-900 shadow-lg shadow-black max-w-fit',
                }" class="**:transition-none! **:text-default **:text-xs p-0! pl-1!" :items="menuItems" />
            <div class="h-full max-h-full flex w-full">
                <TuSidebar />
                <div class="flex-1 h-full max-h-full py-4">
                    <RouterView />
                     <!-- <RFView/> -->
                </div>
            </div>
        </main>
    </UApp>
</template>

<style>
    li[data-menu-item] button {
        padding-left: 0.2rem !important;
        padding-right: 0.2rem !important;
    }
</style>
