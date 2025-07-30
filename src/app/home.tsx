import {
    Button,
    Divider,
    Form,
    Input,
    Select,
    SelectItem,
    Tab,
    Tabs,
} from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizer } from "@window-splitter/react";
import { METHODS, TMethod } from "@/utils/consts";
import { isValidURL, sleep } from "@/utils/funcs";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { TuRootState } from "@/redux/store";
import { homeStore } from "@/redux/reducers/home";
import HomeTab from "@/components/HomeTab";
import _ from "lodash";
import TuButton from "@/components/TuButton";
import TuForm from "@/components/TuForm";
import ReactJson from "react-json-view";

let started = false;
const HomeView = () => {
    const homeState = useSelector((s: TuRootState) => s.home);
    const dispatch = useDispatch();

    const [url, setUrl] = useState("");

    const STORAGE_KEY = `/home__state`;
    const loadState = () => {
        console.log("Loading homeState...");
        const s = localStorage.getItem(STORAGE_KEY);
        if (s) {
            const jsonS = JSON.parse(s);
            dispatch(homeStore.updateState(jsonS));
            setUrl(jsonS.url);
        }
    };

    useEffect(() => {
        if (!started) {
            started = true;
            loadState();
        }
    }, []);
    useEffect(() => {
        console.log("[on_home_state]");
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ ...homeState, url })
        );
    }, [homeState]);

    useEffect(() => {
        // console.log("params changed");
        // params changes. Update local url
        genFullParams(true);
    }, [homeState.params]);

    useEffect(() => {
        // console.log("url changed");
        // url changed. Update state.params
        genFullParams(false);
    }, [url]);

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
            dispatch(homeStore.setField({ key: "url", value: newUrl }));
        } else {
            // on url field update
            dispatch(homeStore.setField({ key: "params", value: entries }));
        }
    };

    const onSubmit = async (e) => {
        try {
            e.preventDefault();
            console.log({ url });
            dispatch(homeStore.setField({ key: "response", value: null }));
            const req = await axios.request({
                url,
                method: homeState.method,
                params: Object.fromEntries(homeState.params),
                headers: Object.fromEntries(homeState.headers),
                data: Object.fromEntries(homeState.body),
            });

            dispatch(homeStore.setField({ key: "response", value: req.data }));
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="flex flex-col gap-2 h-full overflow-hidden">
            <PanelGroup orientation="vertical">
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
                                value={url}
                                onValueChange={setUrl}
                                radius="sm"
                                placeholder="e.g. https://tunedstreamz.com"
                                type="url"
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
                                    ],
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
                                                (homeState.method = v.target
                                                    .value as TMethod)
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
                    <div className="relative flex-1 h-full w-full p-1 bg-default/20 rounded-md flex flex-col">
                        {/* <ReactJson
                            style={{ height: "100%" }}
                            enableClipboard={false}
                            displayArrayKey={false}
                            displayDataTypes={false}
                            theme={"google"}
                            src={json}
                        /> */}

                        <Tabs>
                            <Tab
                                key="response"
                                title="response"
                                className="flex-1"
                            >
                                <div className="p-2 bg-neutral-900/50 rounded-sm relative h-full">
                                    <div className="absolute right-0 top-0 z-20 m-2">
                                        <Button size="sm">Copy</Button>
                                    </div>
                                </div>
                            </Tab>
                            <Tab key="headers" title="headers"></Tab>
                            <Tab key="cookies" title="cookies"></Tab>
                        </Tabs>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default HomeView