<script setup lang="ts">
    import { useHomeStore } from '@/stores/home';
    import { storeToRefs } from 'pinia';
    import { watch } from 'vue';

    const homeStore = useHomeStore();
    const { file } = storeToRefs(homeStore)

    watch(file, f => {
        console.log({ f })
    })
</script>

<template>
    <UTabs size="xs" color="neutral" variant="link"
        :items="[{ label: 'Raw', slot: 'raw' as const }, { label: 'File', slot: 'file' as const }]">
        <template #raw>
            <TuCodeMirror v-model="homeStore.body" basic />
        </template>
        <template #file>
            <div class="m-auto">
                <UFileUpload variant="area" layout="list" position="inside" multiple class="w-80 m-auto "
                    icon="lucide:upload" label="Upload files" dropzone v-model="homeStore.file" />
            </div>
        </template>
    </UTabs>
</template>