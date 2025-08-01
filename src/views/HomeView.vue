<script setup lang="ts">
    import { useHomeStore } from '@/stores/home';
    import { METHODS } from '@/utils/consts';
    import { isValidURL, searchParamsToEntries } from '@/utils/funcs';
    import _ from 'lodash';
    import { storeToRefs } from 'pinia';
    import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
    import { onMounted, reactive, ref, toRaw, watch } from 'vue';
    import CodeMirror from 'vue-codemirror6';
    import { json } from "@codemirror/lang-json";
    import { oneDark } from '@codemirror/theme-one-dark'
    import axios, { AxiosError } from 'axios';

    const homeStore = useHomeStore();
    const { url: storeUrl } = storeToRefs(homeStore)

    const id = "home__panel"
    const formState = reactive({
    });

    const response = ref<{
        status: number;
        duration: number;
        size: number;
    }>({ status: 200, duration: 100, size: 100 });

    const STORAGE_KEY = `/home__state`;
    const loadState = () => {
        console.log("Loading homeState...");
        const s = localStorage.getItem(STORAGE_KEY);
        if (s) {
            const jsonS = JSON.parse(s);
            homeStore.updateState(jsonS);
            const _url = isValidURL(jsonS.url);

            if (_url) {
                homeStore.params = searchParamsToEntries(_url.searchParams)
            }
        }
    };
    
    let axiosAbortCtrl: AbortController | undefined;

    const onSubmit = async (e) => {
        const t1 = Date.now();
        try {
            axiosAbortCtrl = new AbortController();
            e.preventDefault();
            homeStore.response = null;
            // await sleep(3000);
            const res = await axios.request({
                url: homeStore.url,
                method: homeStore.method,
                // params: Object.fromEntries(homeState.params),
                headers: Object.fromEntries(homeStore.headers),
                data:
                    homeStore.method == "GET"
                        ? null
                        : Object.fromEntries(homeStore.body),
                signal: axiosAbortCtrl.signal
            });
            let elapsed = Date.now() - t1;
            homeStore.response = res.data;
            response.value = {
                status: res.status,
                duration: elapsed,
                size: Number(res.headers["content-length"]) / 1024,
            }
        } catch (err) {
            const duration = Date.now() - t1;
            console.log(err);
            let msg: any = { message: "Failed to send request." };
            let status = 500;
            let size = 0;

            if (axios.isCancel(err)) {
                console.log("Request canceled");
                msg = "Request canceled!";
            } else if (axios.isAxiosError(err)) {
                let _err = err as AxiosError;
                msg = _err.response?.data || _err.message;
                status = _err.status || status;
                size = Number(_err.config?.headers["content-length"] || 0);
            }
            response.value = { status, duration, size: 0 };
            homeStore.response = msg;
        }
    };

    onMounted(()=>{
        loadState();
        window.electronAPI.onShowEditorCtxMenu((e, act, target) => {
            switch (act) {
                case "clear":
                    if (target == "editor") homeStore.response = "";
                    else if (target == "input") homeStore.url = "";
                    break;
            }
        });
    })

    watch(() => homeStore.params, params => {
        const paramsStr = new URLSearchParams(params.filter((el) => el.length == 2 || el.at(0))).toString();
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
            if (_.isEqual(params, urlParams)) return;
            homeStore.params = urlParams;
        }
    })

    watch(() => homeStore, (state) => {
        const _state: typeof state.$state = {...state.$state, params: [], response: "", parsedResp: ""};

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(_state)
        )
    }, {deep: true})

</script>

<template>
    <div class="flex flex-col gap-2 h-full overflow-hidden">
        <SplitterGroup :id="id" :auto-save-id="id" direction="vertical">
            <SplitterPanel class="overflow-y-scroll px-4">
                <div class="flex flex-col w-full gap-1 5">
                    <UForm @submit="onSubmit" :state="formState" class="flex w-full">
                        <UButtonGroup class="w-full">
                            <USelect :items="[...METHODS]" v-model="homeStore.method" placeholder="Method"
                                :ui="{ content: 'min-w-fit' }" />
                            <UInput variant="outline" spellcheck="false" required v-model="homeStore.url"
                                placeholder="e.g. https://tunedstreamz.com" type="url" class="flex-1"
                                :ui="{ trailing: 'pr-1', base: 'pr-15 font-mono' }"
                                :oncontextmenu='()=>{
                                     window.electronAPI.showEditorCtxMenu(
                                        "input"
                                    );
                                }'
                                >

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
            <SplitterPanel class="px-4 relative h-full w-full p-1 rounded-md flex flex-col overflow-y-hidden">
                <UTabs :ui="{ content: 'flex-1 min-h-0' }" class="h-full"
                    :items="[{ label: 'Response' }, { label: 'Headers' }, { label: 'Cookies' }]">
                    <template #content="{ item }">
                        <div class="p-1 bg-neutral-800/20 rounded-sm relative h-full flex flex-col max-h-full">
                            <div class="h-full flex flex-col" v-if="item.label.toLowerCase() == 'response'">
                                <div class="w-full flex gap-2 px-2 py-1 rounded-sm bg-elevated">
                                    <UButton size="sm" isIconOnly>
                                        <i class="fi fi-br-copy"></i>
                                    </UButton>
                                    <UButton size="sm" @click="homeStore.response = ''">
                                        <i class="fi fi-br-broom"></i>
                                    </UButton>
                                </div>

                                <div @contextmenu='' class="flex-1 min-h-0 overflow-y-scroll">
                                    <div v-if="homeStore.response == null"
                                        class="w-full h-full flex-center gap-2 flex-col opacity-70">
                                        <UProgress :ui="{ root: 'w-15' }" size="sm" color="neutral" />
                                        <UButton @click="() => { axiosAbortCtrl.abort() }" size="sm" variant="outline"
                                            color="warning">
                                            Cancel request
                                        </UButton>
                                    </div>

                                    <CodeMirror basic class="h-full" :extensions="[oneDark]" v-else readonly dark
                                        :lang="json()" v-model="homeStore.parsedResp" />
                                </div>
                            </div>

                        </div>
                    </template>
                </UTabs>
            </SplitterPanel>
        </SplitterGroup>
    </div>
</template>

<style>
    @reference "../tw.css";

    .cm-editor {
        height: 100%;
        @apply bg-neutral-900
    }
</style>