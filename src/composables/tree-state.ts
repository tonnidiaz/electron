import { TreeItem } from "@/utils/types"
import { ref } from "vue"

export const useTreeState = () =>{
    const items = ref<TreeItem[]>([]);
}