<script setup lang="ts">
    import { TabsItem, type NavigationMenuItem } from '@nuxt/ui';
    import { ref, watch } from 'vue';

    const collapsed = ref(true);
    const c = ref(false);
    function toggleCollapse() {
        collapsed.value = !collapsed.value
    }
    const currTab = ref(0)
    const items = ref<TabsItem[]>([
        { icon: 'lucide:files', slot: 'files' },
        { icon: 'lucide:users', slot: 'users' },
        { icon: 'lucide:info' },
        { icon: 'lucide:settings' },
    ]);

    watch(currTab, () => {
        collapsed.value = false;
        c.value = false
    })
</script>
<template>
    <UTabs v-model="currTab" :content="!collapsed" orientation="vertical" class="bg-elevated/40 items-start pt-3"
        :ui="{ content: 'pr-2' }" variant="link" :items="items">
        <template #leading="{ item, index }">
            <div class="">
                <UButton @click="() => {
                    // console.log({ index, currTab, collapsed })
                    if (c) { toggleCollapse() }
                    else { c = true }
                }
                " :color="index == currTab ? 'primary' : 'neutral'" variant="ghost" :icon="item.icon" />
            </div>
        </template>

        <template #files>
            <UTree :items="[{
                label: 'app', defaultExpanded: true,
                click: () => { toggleCollapse() },
                children: [
                    {
                        label: 'index.html', icon: 'lucide:file'
                    }
                ]
            }]" />
        </template>
        <template #users>
            <div class="w-40"></div>
        </template>
    </UTabs>

</template>