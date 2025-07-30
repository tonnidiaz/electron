import { Panel, PanelGroup, PanelResizer } from "@window-splitter/react";
import TuSkeleton from "./TuSkeleton";
import { Divider } from "@heroui/react";

const TuPanels = () => {
    return (
        <PanelGroup>
            <Panel collapsible defaultCollapsed collapsedSize="100%" min="100px">
                <div className="w-full h-full bg-red-500 rounded-md p-2">
                    Helloooooooooooooooooooooooooooooooooooooooooooooo
                </div>
            </Panel>
            <PanelResizer size="10px"><Divider orientation="vertical"/></PanelResizer>
            <Panel min="130px" >
            <div className="w-full h-full bg-green-500 rounded-md"></div>
            </Panel>
        </PanelGroup>
    );
};

export default TuPanels;
