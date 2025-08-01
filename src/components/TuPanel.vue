<script setup lang="ts">
    import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
    import { pxToPerc } from '@/utils/funcs';
    import { onBeforeUnmount, onMounted, ref } from 'vue';

    const groupRef = ref<HTMLDivElement>(null);
    const parentSize = ref({ w: 0, h: 0 })

    let observer: ResizeObserver | undefined;

    onMounted(() => {
        observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                parentSize.value = { w: entry.contentRect.width, h: entry.contentRect.height }
            }
        })
        observer.observe(groupRef.value)
    })

    onBeforeUnmount(() => {
        observer.disconnect()
    })
</script>

<template>
    <div ref="groupRef" class="relative">
        <SplitterGroup id="splitter-group-1" auto-save-id="splitter-group-1" direction="horizontal">
            <SplitterPanel style="min-width: 100px;" :min-siz="pxToPerc(100, parentSize.w)">
                <div class="h-full bg-neutral-800/50 p-2 rounded-sm">Panel A</div>
            </SplitterPanel>
            <SplitterResizeHandle class="p-1">
                <USeparator orientation="vertical"></USeparator>
                <USeparator orientation="vertical"></USeparator>
            </SplitterResizeHandle>
            <SplitterPanel>
                <div class="h-full bg-neutral-800/50 p-2 rounded-sm">Panel B</div>
            </SplitterPanel>
        </SplitterGroup>
    </div>

</template>