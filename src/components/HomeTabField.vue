<script setup lang="ts">
    import { TreeItemContent } from 'rs/lib';
import { computed, ref } from 'vue';

    const props = defineProps<{ k: 'params' | 'headers'; index: number; dataLen: number; isVal: boolean; store: TreeItemContent }>();

    const items = computed({
        get() { return props.store[props.k] }, set(val) {
            props.store[props.k] = val;
        }
    })
    const item = computed({
        get() { return props.store[props.k][props.index] }, set(val) {
            props.store[props.k][props.index] = val;
        }
    })

    const fieldType = ref("text")
</script>
<template>
    <UInput :type="fieldType" spellcheck="false" class='w-full' :modelValue="item?.at(props.isVal ? 1 : 0)" @update:model-value="(val: any) => {
        if (isVal)
            item = [item?.at(0) || '', val];
        else {
            item = [val, item?.at(1) || ''];
            if ((!k && !item.at(1)) && index + 2 == dataLen) {
                items.pop();
            } else if (k && items.length <= index) {
                console.log('[i]', props.store.selected[k]);
                props.store.selected[k][items.length - 2] = true;
                props.store.selected[k][items.length - 1] = true;
            }
        }
    }" >
    </UInput>
</template>