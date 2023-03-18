import { Alert, Button, createStyles, Flex, Group, Modal, Pagination, Paper, ScrollArea, Select, Slider, Stack, TextInput, Title, Transition, UnstyledButton } from "@mantine/core";
import { IconAlertCircle, IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { Enroll } from "../../FetchData";
import { Admin } from "../../Main";
import { EnrollTable } from "../Table";

const useStyles = createStyles((theme) => ({
    actions: {
        justifyContent: "space-between",
    },
}));

interface EnrollManagerProps {
    enrollData: Enroll[];
    admin: Admin | undefined;
    classList: string[];
}

const searchableFields = ["city", "motorcycle_model", "motorcycle_use", "enroll_status", "motorcycle_brand", "user.driver_license", "user.driver_license_UF", "user.name", "updated_by", "enroll_date", "updated_at"];

function filterData(data: Enroll[], search: string, searchBy: string = 'todos') {
    console.log("filterData", search);
    const query = search.toLowerCase().trim();
    return data.filter((item) => {
        if (query === "") {
            return true;
        }
        const n_item = item as any;
        function search(field: string) {
            const [key, rest] = field.split(".");
            if (rest) {
                console.log("rest", rest, n_item[key][rest].toLowerCase().includes(query));
                if (n_item[key][rest].toLowerCase().includes(query)) {
                    return true;
                }
            } else if (n_item[key].toLowerCase().includes(query)) {
                return true;
            }
            return false;
        }
        if (searchBy === 'todos') {
            for (const field of searchableFields) {
                if (search(field))
                    return true;
            }
            return false;
        } else {
            search(searchBy);
        }
    });
}

function sortData(
    data: Enroll[],
    payload: { search: string, searchBy: string }
) {
    return filterData(data, payload.search, payload.searchBy);
}

interface ActionList {
    [key: string]: Function;
}

export function EnrollManager({ enrollData, admin, classList }: EnrollManagerProps) {
    const { classes } = useStyles();
    const [tableEnrollData, setTableEnrollData] = useState<Enroll[]>([]);
    const [activeEnrollPage, setActiveEnrollPage] = useState(1);
    const [selectedEnroll, setSelectedEnroll] = useState<Enroll[]>([]);
    const [limitPage, setLimitPage] = useState(10);
    const [searchBy, setSearchBy] = useState('todos');
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(enrollData);
    const [totalEnrollData, setTotalEnrollData] = useState(0);
    const [action, setAction] = useState<string | null>("actions");
    const [alert, setAlert] = useState(0);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const actionList =
        {
            "call": function () {
                console.log("call");
                if (selectedClass) {
                    console.log("call", selectedClass);
                } else {
                    setAlert(2);
                }
                setAction(null);
            },
            "certified": function () {
                console.log("certified");
                setAction(null);
            },
            "missed": function () {
                console.log("missed");
                setAction(null);
            },
            "dropout": function () {
                console.log("dropout");
                setAction(null);
            }
        } as ActionList;
    const marks = [
        { value: 25, label: "25%" },
        { value: 50, label: "50%" },
        { value: 75, label: "75%" },
    ];

    function changeLimit(value: number) {
        console.log("Limit: ", value);
        // limit % of totalEnrollData
        setLimitPage(Math.ceil(value * 100 / totalEnrollData));
        handlePagination(1); // move to first page
    }

    function handlePagination(page: number) {
        setActiveEnrollPage(page);
        setTableEnrollData(sortedData.slice((page - 1) * limitPage, page * limitPage));
    }

    useEffect(() => {
        console.log("Admin", admin);
    }, [admin]);

    useEffect(() => {
        setSortedData(enrollData);
        setTableEnrollData(enrollData.slice((activeEnrollPage - 1) * limitPage, activeEnrollPage * limitPage));
        setTotalEnrollData(enrollData.length);
    }, [enrollData]);

    function handleSearch() {
        console.log("handleButtonSearch", search, searchBy)
        const sorted = sortData(enrollData, { search: search, searchBy: searchBy });
        console.log("sorted", sorted.length);
        setSortedData(sorted);
        setActiveEnrollPage(1);
        setTableEnrollData(sorted.slice(0, limitPage));
    }

    function handleAction(value: string) {
        console.log("handleAction", value);
        if (value && selectedEnroll.length > 0) {
            setAlert(0);
            actionList[value]();
        } else {
            setAlert(1);
        }
    }

    return (
        <>
            <Stack>
                <Title>Inscrições</Title>
                <Flex gap={"xs"} className={classes.actions}>
                    <Flex gap={"md"}>
                        <Select
                            data={[
                                { value: "call", label: "Chamar para turma", disabled: admin?.["custom:manager"] !== "true" },
                                { value: "certified", label: "Indicar presença", disabled: admin?.["custom:manager"] !== "true" },
                                { value: "missed", label: "Indicar falta", disabled: admin?.["custom:manager"] !== "true" },
                                { value: "dropout", label: "Indicar desistência", disabled: admin?.["custom:manager"] !== "true" },
                            ]}
                            value={action}
                            placeholder="Ações de inscrição"
                            onChange={handleAction}
                        />
                        <Select
                            placeholder="Turma"
                            data={classList}
                            clearable
                            onChange={setSelectedClass}
                        />
                    </Flex>
                    <Flex gap={"md"}>
                        <TextInput
                            placeholder={`Buscar por ${searchBy}`}
                            mb="md"
                            icon={<IconSearch size="0.9rem" stroke={1.5} />}
                            value={search}
                            onChange={(event) => setSearch(event.currentTarget.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                        />
                        <Button onClick={handleSearch}>Filtrar</Button>
                        <Paper shadow={"xs"} p="xs" withBorder>{sortedData.length}/{enrollData.length}</Paper>
                        {/* <Slider
                            labelAlwaysOn
                            labelTransition="skew-down"
                            labelTransitionDuration={150}
                            labelTransitionTimingFunction="ease"
                            showLabelOnHover
                            defaultValue={10}
                            marks={marks}
                            onChange={changeLimit}
                            min={1}
                            max={100}
                        />                 */}
                    </Flex>
                </Flex>
                {
                    [
                        <UnstyledButton />,
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            title="Selecione alunos para executar uma ação"
                            color="red.6"
                            children={undefined}
                        />,
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            title="Selecione uma turma para realizar chamada"
                            color="yellow.6"
                            children={undefined}
                        />
                        // <Alert
                        //     icon={<IconCircleCheck size={16} />}
                        //     title="Turma cadastrada!"
                        //     color="teal.6"
                        //     children={undefined}
                        // />,
                        // <Alert
                        //     icon={<IconCircleCheck size={16} />}
                        //     title="Turma já existe!"
                        //     color="red.6"
                        //     children={undefined}
                        // />,
                    ][alert]
                }
                <EnrollTable enrollData={tableEnrollData} setSearchBy={setSearchBy} setSelectedEnroll={setSelectedEnroll} />
                <Pagination page={activeEnrollPage} onChange={handlePagination} total={Math.ceil(sortedData?.length / limitPage)} />
            </Stack>
        </>
    );

}