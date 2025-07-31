import {
    Button,
    Divider,
    Input,
    Progress,
    Select,
    SelectItem,
    Tab,
    Tabs,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizer } from "@window-splitter/react";
import { METHODS, TMethod } from "@/utils/consts";
import { formatCode, isValidURL, sleep } from "@/utils/funcs";
import axios, { AxiosError, isAxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { TuRootState } from "@/redux/store";
import { homeStore } from "@/redux/reducers/home";
import HomeTab from "@/components/HomeTab";
import _ from "lodash";
import TuButton from "@/components/TuButton";
import TuForm from "@/components/TuForm";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { useSkipInitialEffect } from "@/utils/hooks";

let started = false;
let axiosAbortCtrl: AbortController | undefined;

const HomeView = () => {
    const homeState = useSelector((s: TuRootState) => s.home);
    const dispatch = useDispatch();

    const [url, setUrl] = useState("");
    const [jsonRes, setJsonRes] = useState("");
    const [response, setResponse] = useState<{
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
            dispatch(homeStore.updateState(jsonS));
            if (isValidURL(jsonS.url)) {
                const queryStr = new URLSearchParams(jsonS.params).toString();
                setUrl(jsonS.url + (queryStr ? "?" + queryStr : ''));
            }
        }
    };

    const genFullParams = (updateUrl: boolean) => {
        const _url = isValidURL(url);
        if (!_url) return;
        const urlParams = Object.fromEntries(_url.searchParams);
        const stateParams = Object.fromEntries(homeState.params);
        if (_.isEqual(urlParams, stateParams)) {
            return;
        }
        // console.log({ urlParams, stateParams });
        const fullParams = updateUrl ? stateParams : urlParams;
        const entries = Object.entries(fullParams);

        // construct a new url string
        const params = new URLSearchParams(fullParams).toString();
        let newUrl = `${_url.origin}${_url.pathname}?${params}`;
        // console.log({ newUrl });
        newUrl = newUrl.replace(`=undefined`, "");
        // homeState.params = entries;\

        if (updateUrl) {
            // on params update
            setUrl(newUrl);
            dispatch(homeStore.setField(["url", newUrl]));
        } else {
            // on url field update
            dispatch(homeStore.setField(["params", entries]));
        }
    };

    const onSubmit = async (e) => {
        const t1 = Date.now();
        try {
            axiosAbortCtrl = new AbortController();
            e.preventDefault();
            console.log(homeState.method, { url });
            dispatch(homeStore.setField(["response", null]));
            // await sleep(3000);
            const res = await axios.request({
                url,
                method: homeState.method,
                // params: Object.fromEntries(homeState.params),
                headers: Object.fromEntries(homeState.headers),
                data:
                    homeState.method == "GET"
                        ? null
                        : Object.fromEntries(homeState.body),
                signal: axiosAbortCtrl.signal,
            });
            let elapsed = Date.now() - t1;
            dispatch(homeStore.setField(["response", res.data]));
            setResponse({
                status: res.status,
                duration: elapsed,
                size: Number(res.headers["content-length"]) / 1024,
            });
        } catch (err) {
            const duration = Date.now() - t1;
            console.log(err);
            let msg: any = { message: "Failed to send request." };
            let status = 500;
            let size = 0;

            if (axios.isCancel(err)) {
                console.log("Request canceled");
                msg = "Request canceled!";
            } else if (isAxiosError(err)) {
                let _err = err as AxiosError;
                msg = _err.response?.data || _err.message;
                status = _err.status || status;
                size = Number(_err.config?.headers["content-length"] || 0);
            }
            setResponse({ status, duration, size: 0 });
            dispatch(homeStore.setField(["response", msg]));
        }
    };

    /* ---------------------------- EFFECTS -------------------------------- */

    useEffect(() => {
        if (!started) {
            started = true;
            loadState();
            // axios.get("http://localhost:8000/bots?limit=10").then(r=> console.log(r.data)).catch(console.log)
        }

        window.electronAPI.onShowEditorCtxMenu((e, act, target) => {
            switch (act) {
                case "clear":
                    if (target == "editor") setJsonRes("");
                    else if (target == "input") setUrl("");
                    break;
            }
        });
    }, []);

    useSkipInitialEffect(() => {
        console.log("[on_home_state]");
        const _url = isValidURL(url);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                ...homeState,
                url: _url ? `${_url.origin}${_url.pathname}` : _url,
                response: "",
            })
        );
    }, [homeState]);

    useSkipInitialEffect(() => {
        started = true;
        console.log("params changed", homeState.params);
        // params changes. Update local url
        genFullParams(true);
    }, [homeState.params]);

    useSkipInitialEffect(() => {
        started = true;
        console.log("url changed", url);
        // url changed. Update state.params
        genFullParams(false);
    }, [url]);

    useEffect(() => {
        const res = homeState.response;
        if (res && typeof res == "object") {
            formatCode(JSON.stringify(res)).then(setJsonRes);
        } else {
            setJsonRes((res || "").toString());
        }
    }, [homeState.response]);
    /* ---------------------------- END EFFECTS -------------------------------- */
    return (
        <div className="flex flex-col gap-2 h-full overflow-hidden">
            <PanelGroup autosaveId="home__panel" orientation="vertical">
                <Panel
                    isStaticAtRest
                    collapsible
                    defaultCollapsed
                    collapsedSize="220px"
                    className="overflow-y-scroll!"
                >
                    <div className="flex flex-col w-full gap-1 5">
                        <TuForm onSubmit={onSubmit} className="flex w-full">
                            <Input
                                errorMessage="Fill out this field with a valid value"
                                required
                                spellCheck="false"
                                value={url}
                                onValueChange={setUrl}
                                radius="sm"
                                placeholder="e.g. https://tunedstreamz.com"
                                type="url"
                                onContextMenu={(_e) => {
                                    window.electronAPI.showEditorCtxMenu(
                                        "input"
                                    );
                                }}
                                classNames={{
                                    inputWrapper: [
                                        "focus-within:bg-default/60!",
                                        "dark:hover:bg-default/45",
                                        "dark:focus-within:bg-default/45!",
                                        "focus-within:bg-default/45!",
                                        "bg-default/45!",
                                        // "dark:focus:bg-default/45",
                                        "px-1.5",
                                        "mx-0",
                                        "w-full",
                                        "flex-1",
                                        "group-data:!bg-default/45",
                                        "data-[hover=true]:!bg-default/45",
                                        "group-data-[hover=true]:!bg-default/45",
                                        "data-[focus=true]:!bg-default/45",
                                        "group-data-[focus=true]:!bg-default/45",
                                        "group-data-[focus-visible=true]:ring-0!",
                                        "font-mono!",
                                    ],
                                    input: ["text-xs"],
                                }}
                                startContent={
                                    <div className="w-40 relative bg-">
                                        <Select
                                            aria-label="method"
                                            placeholder="METHOD"
                                            size="sm"
                                            radius="sm"
                                            classNames={{
                                                base: "pr-1.5",
                                                trigger:
                                                    "rounded-none dark:hover:bg-transparent! text-sm!",
                                                value: "text-xs!",
                                            }}
                                            className="border-r border-neutral-700"
                                            // value={homeState.method}
                                            defaultSelectedKeys={[
                                                homeState.method,
                                            ]}
                                            onChange={(v) =>
                                                dispatch(
                                                    homeStore.setField([
                                                        "method",
                                                        v.target
                                                            .value as TMethod,
                                                    ])
                                                )
                                            }
                                        >
                                            {METHODS.map((el) => (
                                                <SelectItem key={el}>
                                                    {el}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                }
                                endContent={
                                    <TuButton
                                        type="submit"
                                        className="p-0 m-0"
                                        color="primary"
                                        size="sm"
                                    >
                                        Send
                                    </TuButton>
                                }
                            />
                        </TuForm>
                        <div className="flex w-full flex-col">
                            <Tabs
                                aria-label="Options"
                                classNames={{ panel: "p-0 pt-1.5!" }}
                            >
                                <Tab key="params" title="params">
                                    <HomeTab k="params" />
                                </Tab>
                                <Tab key="body" title="body">
                                    <HomeTab k="body" />
                                </Tab>
                                <Tab key="headers" title="headers">
                                    <HomeTab k="headers" />
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </Panel>
                <PanelResizer
                    className="bg-neutral-800/10 relative flex flex-col gap-0.5"
                    size="14px"
                >
                    <Divider />
                    <Divider />
                </PanelResizer>
                <Panel collapsible>
                    <div className="relative h-full w-full p-1 bg-default/20 rounded-md flex flex-col overflow-y-hidden">
                        <Tabs>
                            <Tab
                                key="response"
                                title="response"
                                className="flex-1 relative min-h-0"
                            >
                                <div className="p-1 bg-neutral-900/50 rounded-sm relative h-full flex flex-col max-h-full">
                                    <div className="w-full flex gap-2 px-2 py-1 rounded-sm bg-default/40">
                                        <Button size="sm" isIconOnly>
                                            <i className="fi fi-br-copy"></i>
                                        </Button>
                                        <Button
                                            size="sm"
                                            isIconOnly
                                            onPress={() => setJsonRes("")}
                                        >
                                            <i className="fi fi-br-broom"></i>
                                        </Button>
                                    </div>

                                    <div
                                        onContextMenu={(_e) => {
                                            window.electronAPI.showEditorCtxMenu(
                                                "editor"
                                            );
                                        }}
                                        className="flex-1 min-h-0 overflow-y-scroll"
                                    >
                                        {homeState.response == null ? (
                                            <div className="w-full h-full flex-center gap-2 flex-col opacity-70">
                                                <Progress
                                                    style={{ width: 200 }}
                                                    isIndeterminate
                                                    size="sm"
                                                    color="default"
                                                />
                                                <Button
                                                    onPress={() => {
                                                        axiosAbortCtrl.abort();
                                                    }}
                                                    size="sm"
                                                    variant="ghost"
                                                    color="warning"
                                                >
                                                    Cancel request
                                                </Button>
                                            </div>
                                        ) : (
                                            <CodeMirror
                                                readOnly
                                                theme={"dark"}
                                                extensions={[json()]}
                                                value={jsonRes}
                                                className="**:bg-neutral-900/20!"
                                            />
                                        )}
                                    </div>
                                </div>
                            </Tab>
                            <Tab key="headers" title="headers"></Tab>
                            <Tab key="cookies" title="cookies"></Tab>
                            <Tab
                                style={{ pointerEvents: "none" }}
                                disabled
                                title={
                                    !homeState.response ? null : (
                                        <div
                                            className={`flex gap-3 items-center flex-1 font-mono text-xs font-bold ${response.status != 200 ? "text-red-500" : "text-success"}`}
                                        >
                                            <span title="status">
                                                {response.status}
                                            </span>
                                            <span title="duration">
                                                {" "}
                                                <i className="fi fi-br-clock"></i>
                                                {response.duration}ms
                                            </span>
                                            <span title="size">
                                                {response.size.toFixed(3)}kb
                                            </span>
                                        </div>
                                    )
                                }
                            />
                        </Tabs>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default HomeView;
