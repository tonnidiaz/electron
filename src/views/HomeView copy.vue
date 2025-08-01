<script setup lang="ts">
    import { useHomeStore } from '@/stores/home';
    import { METHODS } from '@/utils/consts';
    import { isValidURL } from '@/utils/funcs';
    import _ from 'lodash';
    import { storeToRefs } from 'pinia';
    import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
    import { reactive, toRaw, watch } from 'vue';

    const homeStore = useHomeStore();
    const { url: storeUrl } = storeToRefs(homeStore)

    const id = "home__panel"
    const formState = reactive({
    });

    watch(() => homeStore.params, params => {
        console.log('[on_params]')
        const paramsStr = new URLSearchParams(params.filter((el) => el.length == 2 || el.at(0))).toString();
        const url = isValidURL(homeStore.url);
        let newUrl = paramsStr ? `?${paramsStr}` : '';
        if (url) {
            newUrl = `${url.origin}${url.pathname}${newUrl}`;
        }
        console.log({ paramsStr })
        homeStore.url = newUrl
    }, { deep: true })

    watch([storeUrl, homeStore.params], ([url]) => {
        const _url = isValidURL(url);
        if (_url) {
            console.log({ url })
            const urlParams = Object.entries(Object.fromEntries(_url.searchParams));
            const params = toRaw(homeStore.params);
            // console.log({ params, urlParams })
            if (_.isEqual(params, urlParams)) return;

            console.log({ params: urlParams })
            homeStore.params = urlParams;
            // homeStore.setParams(urlParams)
        }
    },)
</script>

<template>
    <div class="flex flex-col gap-2 h-full overflow-hidden">
        <SplitterGroup :id="id" :auto-save-id="id" direction="vertical">
            <SplitterPanel class="overflow-y-scroll px-4">
                <div class="flex flex-col w-full gap-1 5">
                    <UForm :state="formState" class="flex w-full">
                        <UButtonGroup class="w-full">
                            <USelect :items="[...METHODS]" v-model="homeStore.method" placeholder="Method"
                                :ui="{ content: 'min-w-fit' }" />
                            <UInput variant="outline" spellcheck="false" required v-model="homeStore.url"
                                placeholder="e.g. https://tunedstreamz.com" type="url" class="flex-1"
                                :ui="{ trailing: 'pr-1', base: 'pr-15 font-mono' }">

                                <template #trailing>
                                    <UButton type="submit" class="w-13 flex-center" size="xs">Send</UButton>
                                </template>
                            </UInput>
                        </UButtonGroup>
                    </UForm>
                    <UTabs variant="link" color="neutral" class="w-full"
                        :items="[{ label: 'Params' }, { label: 'Body' }, { label: 'Headers' }]">

                        <template #content="{ item: tab }">
                            <HomeTab :k="tab.label.toLowerCase() as any" />
                        </template>
                    </UTabs>
                </div>
            </SplitterPanel>
            <SplitterResizeHandle class="p-1 my-1 rounded-md flex-col flex gap-1">
                <USeparator orientation="horizontal"></USeparator>
                <USeparator orientation="horizontal"></USeparator>
            </SplitterResizeHandle>
            <SplitterPanel>
                <Tu />
            </SplitterPanel>
        </SplitterGroup>
    </div>
</template>