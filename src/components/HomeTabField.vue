<script setup lang="ts">
    import { useHomeStore } from '@/stores/home';
    import { computed, ref } from 'vue';

    const homeStore = useHomeStore()
    const props = defineProps<{ k: 'params' | 'headers'; index: number; dataLen: number; isVal: boolean }>();

    const items = computed({
        get() { return homeStore[props.k] }, set(val) {
            homeStore[props.k] = val;
        }
    })
    const item = computed({
        get() { return homeStore[props.k][props.index] }, set(val) {
            homeStore[props.k][props.index] = val;
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
                console.log('[i]', homeStore.selected[k]);
                homeStore.selected[k][items.length - 2] = true;
                homeStore.selected[k][items.length - 1] = true;
            }
        }
    }" >
    </UInput>
</template>