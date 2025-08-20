<script setup lang="ts">
    import { useWorkspaceStore } from '@/stores/workspace';
    import { storeToRefs } from 'pinia';

    const wpStore = useWorkspaceStore();
    const { content } = storeToRefs(wpStore)

</script>

<template>
    <UTabs size="xs" color="neutral" variant="link"
        :items="[{ label: 'Raw', slot: 'raw' as const }, { label: 'File', slot: 'file' as const }]">
        <template #raw>
            <TuCodeMirror v-model="content.body" basic />
        </template>
        <template #file>
            <div class="m-auto">
                <UFileUpload variant="area" layout="list" position="inside" multiple class="w-80 m-auto "
                    icon="i-tabler-upload" label="Upload files" dropzone v-model="wpStore.file" />
            </div>
        </template>
    </UTabs>
</template>