<!-- <script setup lang="ts">
import { useHomeStore } from '@/stores/home';
import { isValidURL } from '@/utils/funcs';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const homeStore = useHomeStore();

const {url: storeUrl} = storeToRefs(homeStore)
watch(homeStore.params, params => {
        const paramsStr = new URLSearchParams(params.filter((el) => el.length == 2 || el.at(0))).toString();
        const url = isValidURL(homeStore.url);
        let newUrl = paramsStr ? `?${paramsStr}` : '';
        if (url){
            newUrl = `${url.origin}${url.pathname}${newUrl}` ;
        }
        homeStore.url = newUrl
    })
    watch([storeUrl, homeStore.params], ([url]) => {
        // some algorithim
        if (/** some condition */){
            homeStore.params = [['a', 'b']]
        }
    })
</script> -->