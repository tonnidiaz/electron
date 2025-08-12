<script setup lang="ts">
    import _ from 'lodash';
    import { storeToRefs } from 'pinia';
    import { useWorkspaceStore } from '@/stores/workspace';
    import HomeContent from './home/HomeContent.vue';

    const wpStore = useWorkspaceStore()
    const { content } = storeToRefs(wpStore);

</script>

<template>

    <div class="flex-1 flex flex-col gap-2 h-full overflow-hidden">
        <HomeContent v-if="content" />
    </div>

</template>
