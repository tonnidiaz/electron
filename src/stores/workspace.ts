import { FileTree, HttpOpts } from "@/utils/types";
import { defineStore } from "pinia";
import { TreeItemContent } from "rs/lib";

export const useWorkspaceStore = defineStore("wp", {
    state: () => ({
        workspaces: [] as FileTree[],
        content: null as
            | (TreeItemContent & {
                  response?: {
                      data: string;
                      config?: {
                          status: number;
                          duration: number;
                          size: number;
                          headers: HttpOpts;
                      };
                  };
                  parsedResp: string
              })
            | null,
    }),
});
