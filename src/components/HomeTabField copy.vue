<script setup lang="ts">
    import { useHomeStore } from '@/stores/home';
    import { typeMap } from '@/utils/consts';
    import { computed, ref } from 'vue';

    const homeStore = useHomeStore()
    const props = defineProps<{ k: 'params' | 'headers'; index: number; dataLen: number; isVal: boolean; placeholder?: string }>();

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
    const checkboxCond = computed(()=> fieldType.value == 'checkbox')

    const fieldType = ref(typeMap[typeof item.value?.at(1)] || 'text')
</script>
<template>
    <UButtonGroup class='w-full'>
        <UInput v-if="!isVal || !checkboxCond" :placeholder="placeholder" :type=" isVal ? fieldType : 'text'" spellcheck="false" class='w-full'
            :modelValue=" fieldType != 'file' && item?.at(props.isVal ? 1 : 0)" @update:model-value="(val: any) => {
                if (isVal)
                    item = [item?.at(0) || '', val];
                else {
                    item = [val, item?.at(1) || ''];
                    if ((!k && !item.at(1)) && index + 2 == dataLen) {
                        items.pop();
                    } else if (k && items.length <= index) {
                        items.push(['', ''])
                    }
                }
            }" :ui="{ base: 'w-full flex-1' }">
        </UInput>
        <UCheckbox :model-value="item?.at(1)" @update:model-value="(v)=>{
            item = [item?.at(0) || '', v];
        }" class="flex-1" v-else-if="isVal && checkboxCond"/>
        <USelect v-if="isVal && k != 'params'" v-model="fieldType" size="xs" placeholder="type"
            :items="['text', 'number', 'checkbox', 'file']" :ui="{
                base: checkboxCond ? 'mr-4' : '',
                content: 'min-w-fit'
            }" />
    </UButtonGroup>
</template>