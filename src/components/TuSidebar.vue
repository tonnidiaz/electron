<script setup lang="ts">
import { TabsItem } from '@nuxt/ui';
    import { ref, watch } from 'vue';

    const collapsed = ref(true);
    const c = ref(false);

    function toggleCollapse() {
        collapsed.value = !collapsed.value
    }
    const currTab = ref(0)
    const items = ref<TabsItem[]>([
        { icon: 'i-tabler-files', slot: 'files' },
        { icon: 'i-tabler-users', slot: 'users' },
        { icon: 'i-tabler-info-circle' },
        { icon: 'i-tabler-settings' },
    ]);
 

    watch(currTab, () => {
        collapsed.value = false;
        c.value = false
    })

</script>
<template>
    <UTabs v-model="currTab" :content="!collapsed" orientation="vertical" class="bg-elevated/40 items-start pt-"
        :ui="{ content: 'pr-2 py-3 max-h-full h-full relative', trigger: 'px-1' }" variant="link" :items="items">
        <template #leading="{ item, index }">
            <div class="">
                <UButton @click="() => {
                    if (c) { toggleCollapse() }
                    else { c = true }
                }
                " :color="index == currTab ? 'primary' : 'neutral'" variant="ghost" :icon="item.icon" />
            </div>
        </template>

        <template #files>
            <WorkspaceTab/>
        </template>
        <template #users>
            <div class="w-40"></div>
        </template>
    </UTabs>

</template>