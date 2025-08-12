<script setup lang="ts">
    import { useHomeStore } from '@/stores/home';
    import { METHODS } from '@/utils/consts';
    import { isValidURL, searchParamsToEntries } from '@/utils/funcs';
    import _ from 'lodash';
    import { storeToRefs } from 'pinia';
    import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
    import { computed, onMounted, reactive, toRaw, watch } from 'vue';
    import axios, { AxiosError } from 'axios';
    import { Icon } from '@iconify/vue';
import { useWorkspaceStore } from '@/stores/workspace';

    const homeStore = useHomeStore();
    const wpStore = useWorkspaceStore()
    const {content} = storeToRefs(wpStore);

    const { url: storeUrl, response } = storeToRefs(homeStore)

    const id = "home__panel"
    const formState = reactive({
    });

    const win = window;
    const resTabs = [{ label: 'Response' }, { label: 'Headers' }];

    const STORAGE_KEY = `/home__state`;
    const loadState = () => {
        console.log("Loading homeState...");
        const s = localStorage.getItem(STORAGE_KEY);
        if (s) {
            const jsonS = JSON.parse(s);
            homeStore.updateState(jsonS);
            /* const _url = isValidURL(jsonS.url);

            if (_url) {
                homeStore.params = searchParamsToEntries(_url.searchParams)
            } */
        }
    };

    let axiosAbortCtrl: AbortController | undefined;

    const onSubmit = async (e) => {
        const t1 = Date.now();

        try {
            axiosAbortCtrl = new AbortController();
            e.preventDefault();
            const headers = Object.fromEntries(homeStore.headers);
            homeStore.response.data = null;
            // await sleep(3000);
            const res = await axios.request({
                url: homeStore.url,
                method: homeStore.method,
                // params: Object.fromEntries(homeState.params),
                headers,
                data:
                    homeStore.method == "GET"
                        ? null
                        : JSON.parse(homeStore.body),
                signal: axiosAbortCtrl.signal
            });
            let elapsed = Date.now() - t1;
            homeStore.response = {
                data: res.data, config: {
                    status: res.status,
                    duration: elapsed,
                    size: Number(res.headers["content-length"]) / 1024,
                    headers: Object.entries(res.headers),
                }
            };
        } catch (err) {
            const duration = Date.now() - t1;
            console.log("Failed to send req:", err);
            let msg: any = { message: "Failed to send request." };
            let status = 500;
            let size = 0;
            let headers = [];

            if (axios.isCancel(err)) {
                msg = "Request canceled!";
            } else if (axios.isAxiosError(err)) {
                let _err = err as AxiosError;
                msg = _err.response?.data || _err.message;
                status = _err.status || status;
                size = Number(_err.config?.headers["content-length"] || 0);
                headers = Object.entries(_err.response?.headers || {}) || []
            }

            homeStore.response = {
                data: msg, config: {
                    status,
                    duration,
                    size,
                    headers,
                }
            }
        }
    };
    const updatedUrl = computed(() => homeStore.url);

    onMounted(() => {
        loadState();
        window.electronAPI?.onShowEditorCtxMenu((_, act, target) => {
            switch (act) {
                case "clear":
                    if (target == "editor") homeStore.response.data = null;
                    else if (target == "input") homeStore.url = "";
                    break;
            }
        });
    })


    watch([() => homeStore.params, () => homeStore.selected.params], ([paramz, selectedParams]) => {
        const params = paramz.filter((el, i) => (el.length == 2 || el.at(0)) && selectedParams[i])
        const paramsStr = new URLSearchParams(params).toString();
        const url = isValidURL(homeStore.url);
        let newUrl = paramsStr ? `?${paramsStr}` : '';
        if (url) {
            const urlParams = searchParamsToEntries(url.searchParams);
            if (_.isEqual(toRaw(params), urlParams)) {
                return;
            }
            newUrl = `${url.origin}${url.pathname}${newUrl}`;
        }
        homeStore.url = newUrl
    }, { deep: true })

    watch([storeUrl, homeStore.params], ([url]) => {
        const _url = isValidURL(url);
        if (_url) {
            const urlParams = searchParamsToEntries(_url.searchParams);
            const params = toRaw(homeStore.params);
            if (_.isEqual(params, urlParams) || url == updatedUrl.value) return;
            homeStore.params = urlParams;
        }
    })

    watch(() => homeStore, (state) => {
        const _state: typeof state.$state = { ...state.$state };
        delete _state.response;
        delete _state.parsedResp;
        delete _state.file;

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(_state)
        )
    }, { deep: true, immediate: false })

</script>

<template>
    
        <div class="flex-1 flex flex-col gap-2 h-full overflow-hidden">
            <SplitterGroup :id="id" :auto-save-id="id" direction="vertical">
                <SplitterPanel class="overflow-y-scroll px-4">
                    <div class="flex flex-col w-full gap-1 5">
                        <UForm @submit="onSubmit" :state="formState" class="flex w-full">
                            <UButtonGroup class="w-full">
                                <USelect :items="[...METHODS]" v-model="homeStore.method" placeholder="Method"
                                    :ui="{ content: 'min-w-fit' }" />
                                <UInput variant="outline" spellcheck="false" required v-model="homeStore.url"
                                    placeholder="e.g. https://tunedstreamz.com" type="url" class="flex-1"
                                    :ui="{ trailing: 'pr-1', base: 'pr-15 font-mono' }" :oncontextmenu='() => {
                                        win.electronAPI.showEditorCtxMenu(
                                            "input"
                                        );
                                    }'>

                                    <template #trailing>
                                        <UButton type="submit" class="w-13 flex-center" size="xs">Send</UButton>
                                    </template>
                                </UInput>
                            </UButtonGroup>
                        </UForm>
                        <UTabs variant="link" color="neutral" class="w-full" model-value="1"
                            :items="[{ label: 'Params' }, { label: 'Body' }, { label: 'Headers' }]">

                            <template #content="{ item: tab }">
                                <HomeBodyTab v-if="tab.label.toLowerCase() == 'body'" />
                                <HomeTab v-else :k="tab.label.toLowerCase() as any" />
                            </template>
                        </UTabs>
                    </div>
                </SplitterPanel>
                <SplitterResizeHandle class="p-1 my-1 rounded-md flex-col flex gap-1">
                    <USeparator orientation="horizontal"></USeparator>
                    <USeparator orientation="horizontal"></USeparator>
                </SplitterResizeHandle>
                <SplitterPanel class="px-4 relative h-full w-full p-1 rounded-md flex flex-col overflow-y-hidden">

                    <div class="px-2 rounded-sm bg-elevate self-en" v-if="response.data && response.config">
                        <div>
                            <div
                                :class='`flex gap-3 items-center flex-1 font-mono text-xs font-bold ${response.config.status != 200 ? "text-red-500" : "text-success"}`'>
                                <span title="status">
                                    {{ response.config.status }}
                                </span>
                                <span title="duration" class="inline-flex gap-1">
                                    <Icon icon="i-tabler-clock"></Icon>
                                    {{ response.config.duration }}ms
                                </span>
                                <span title="size">
                                    {{ response.config.size.toFixed(3) }}kb
                                </span>
                            </div>
                        </div>

                    </div>
                    <UTabs variant="link" size="md" color="neutral" :ui="{ content: 'flex-1 min-h-0' }" class="h-full"
                        :items="resTabs">

                        <template #content="{ item }">
                            <div class="p-1 bg-neutral-800/20 rounded-sm relative h-full flex flex-col max-h-full">
                                <div class="h-full flex flex-col" v-if="item.label.toLowerCase() == 'response'">
                                    <div v-if="homeStore.parsedResp"
                                        class="w-full flex gap-2 px-2 py-1 rounded-sm bg-elevated">
                                        <UButton icon="i-tabler-copy" size="sm" isIconOnly />
                                        <UButton icon="i-tabler-brush-cleaning" size="sm"
                                            @click="homeStore.response.data = ''" />
                                    </div>

                                    <div @contextmenu='' class="flex-1 min-h-0 overflow-y-scroll">
                                        <div v-if="!homeStore.response"
                                            class="w-full h-full flex-center gap-2 flex-col opacity-70">
                                            <div v-if="homeStore.response == null" class="flex-center gap-2 flex-col ">
                                                <UProgress :ui="{ root: 'w-30' }" size="sm" color="neutral" />
                                                <UButton @click="() => { axiosAbortCtrl.abort() }" size="sm"
                                                    variant="outline" color="warning">
                                                    Cancel request
                                                </UButton>
                                            </div>
                                            <p v-else class="text-md">Nothing to show</p>
                                        </div>
                                        <TuCodeMirror v-else readonly v-model="homeStore.parsedResp" />
                                    </div>
                                </div>
                                <div class="h-full" v-else-if="item.label.toLowerCase() == 'headers'">
                                    <ResTable :items="response.config?.headers || []" />
                                </div>


                            </div>
                        </template>
                    </UTabs>
                </SplitterPanel>
            </SplitterGroup>
        </div>

</template>
