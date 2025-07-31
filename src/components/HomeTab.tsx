import { homeStore } from "@/redux/reducers/home";
import { TuRootState } from "@/redux/store";
import {
    Checkbox,
    Input,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import { produce } from "immer";
import { useDispatch, useSelector } from "react-redux";

const HomeTab = ({ k: key }: { k: "headers" | "params" | "body" }) => {
    const homeState = useSelector((s: TuRootState) => s.home);
    const dispatch = useDispatch();

    const Row = ({ k, v, i }: { k?: any; v?: any; i: number }) => (
        <TableRow key={i}>
            <TableCell>
                <Checkbox size="md" />
            </TableCell>
            <TableCell>
                <Input
                    size="sm"
                    radius="sm"
                    classNames={{
                        inputWrapper: [
                            "bg-default/20",
                            "hover:bg-default/20!",
                            "focus-within:bg-default/20!",
                        ],
                        input: ["text-xs"],
                    }}
                    value={k}
                    onChange={(e) => {
                        const _k = e.target.value;
                        // e.g. params
                        const item = produce(homeState[key], (draft) => {
                            if (!_k && draft.length > i) {
                                draft.filter((_, j) => j != i);
                            } else if (draft.length <= i) {
                                draft.push([_k, v]);
                            } else {
                                draft[i][0] = _k;
                            }
                        });
                        dispatch(homeStore.setField([key, item]));
                    }}
                />
            </TableCell>
            <TableCell>
                <Input
                    size="sm"
                    radius="sm"
                    classNames={{
                        inputWrapper: [
                            "bg-default/20",
                            "hover:bg-default/20!",
                            "focus-within:bg-default/20!",
                        ],
                        input: ["text-xs"],
                    }}
                    value={v}
                    onChange={(e) => {
                        const _v = e.target.value;
                        const item = produce(homeState[key], (draft) => {
                            draft[i][1] = _v;
                        });
                        dispatch(homeStore.setField([key, item]));
                    }}
                />
            </TableCell>
        </TableRow>
    );
    return (
        <div className="w-full flex-col">
            <Table
                selectionMode="none"
                classNames={{ base: "bg-red-600!" }}
                className="bg-red-500!"
                radius="none"
            >
                <TableHeader>
                    <TableColumn>
                        <Checkbox />
                    </TableColumn>
                    <TableColumn>Key</TableColumn>
                    <TableColumn>Value</TableColumn>
                </TableHeader>

                <TableBody>
                    <>
                        {homeState[key].map(([k, v], i) => Row({ k, v, i }))}
                        {Row({ i: homeState[key].length })}
                    </>
                </TableBody>
            </Table>
        </div>
    );
};

export default HomeTab;
