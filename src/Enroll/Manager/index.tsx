import { Alert, Button, createStyles, Flex, Group, Modal, Pagination, Paper, ScrollArea, Select, Slider, Stack, TextInput, Title, Transition, UnstyledButton } from "@mantine/core";
import { IconAlertCircle, IconCircleCheck, IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { Enroll } from "../../FetchData";
import { Admin } from "../../Main";
import { EnrollTable } from "../Table";
import Tokens from "../../AuthenticationForm/Tokens";
import { useLocalStorage } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
    actions: {
        justifyContent: "space-between",
    },
}));

interface EnrollManagerProps {
    mainEnrollData: Enroll[];
    admin: Admin | undefined;
    classList: string[];
}

interface Alert {
    type: "success" | "error" | "warning" | "info";
    title: string;
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

export function EnrollManager({ mainEnrollData, admin, classList }: EnrollManagerProps) {
    const [tokens, setTokens] = useLocalStorage<Tokens>({
        key: "tokens",
    });
    const { classes } = useStyles();
    const [tableEnrollData, setTableEnrollData] = useState<Enroll[]>([]);
    const [activeEnrollPage, setActiveEnrollPage] = useState(1);
    const [selectedEnroll, setSelectedEnroll] = useState<Enroll[]>([]);
    const [limitPage, setLimitPage] = useState(10);
    const [searchBy, setSearchBy] = useState('todos');
    const [search, setSearch] = useState('');
    const [enrollData, setEnrollData] = useState<Enroll[]>([]);
    const [sortedData, setSortedData] = useState(enrollData);
    const [totalEnrollData, setTotalEnrollData] = useState(0);
    const [action, setAction] = useState<string | null>("actions");
    const [alert, setAlert] = useState<Alert | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const actionList =
        {
            "call": async function () {
                if (selectedClass) {
                    const data = {
                        class_name: selectedClass,
                        enrolls: selectedEnroll.map((item) => ({
                            enroll_date: item.enroll_date,
                            city: item.city,
                        })),
                    };
                    const config = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            // add tokens from localstorage
                            access_token: `${tokens.access_token}`,
                            id_token: `${tokens.id_token}`,
                        },
                        body: JSON.stringify(data),
                    };
                    try {
                        const response = await fetch(
                            `${process.env.REACT_APP_BACKEND_ADDRESS}/enroll/call` as string,
                            config
                        );
                        const { message, enrolls } = await response.json();
                        const update = async () => {
                            setEnrollData(enrollData.map((item) => {
                                for (const enroll of enrolls) {
                                    if (item.city === enroll.city && item.enroll_date === enroll.enroll_date) {
                                        item.enroll_status = enroll.enroll_status;
                                        item.updated_by = enroll.updated_by;
                                        item.updated_at = enroll.updated_at;
                                        item.class = enroll.class;
                                        return item;
                                    }
                                }
                                return item;
                            }));
                        }
                        update();
                        if (response.status === 200 && message !== "partial") {
                            setAlert({ type: "success", title: "Inscrição(ões) chamada(s) para turma!" } as Alert);
                        } else if (response.status === 206 && message === "partial") {
                            setAlert({ type: "warning", title: "Inscrição(ões) parcialmente chamada(s) para turma!" } as Alert);
                        }
                    } catch (error) {
                        setAlert({ type: "error", title: "Falha ao chamar alunos para turma!" } as Alert);
                    }
                } else {
                    setAlert({ type: "warning", title: "Selecione uma turma para realizar chamada!" } as Alert);
                }

                // TODO: create wame para com mensagens para o próprio usuário com os links de chats para cada aluno selecionado
                setAction(null);
            },
            "confirmed": async function () {
                const data = {
                    enrolls: selectedEnroll.map((item) => ({
                        enroll_date: item.enroll_date,
                        city: item.city,
                    })),
                };
                const config = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // add tokens from localstorage
                        access_token: `${tokens.access_token}`,
                        id_token: `${tokens.id_token}`,
                    },
                    body: JSON.stringify(data),
                };
                try {
                    const response = await fetch(
                        `${process.env.REACT_APP_BACKEND_ADDRESS}/enroll/confirm` as string,
                        config
                    );
                    const { message, enrolls } = await response.json();
                    const update = async () => {
                        setEnrollData(enrollData.map((item) => {
                            for (const enroll of enrolls) {
                                if (item.city === enroll.city && item.enroll_date === enroll.enroll_date) {
                                    item.enroll_status = enroll.enroll_status;
                                    item.updated_by = enroll.updated_by;
                                    item.updated_at = enroll.updated_at;
                                    return item;
                                }
                            }
                            return item;
                        }));
                    }
                    update();
                    if (response.status === 200 && message !== "partial") {
                        setAlert({ type: "success", title: "Inscrição(ões) confirmada(s) para sua(s) turma(s)!" } as Alert);
                    } else if (response.status === 206 && message === "partial") {
                        setAlert({ type: "warning", title: "Inscrição(ões) parcialmente confirmada(s)!" } as Alert);
                    }
                } catch (error) {
                    setAlert({ type: "error", title: "Falha ao confirmar inscrições!" } as Alert);
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

    // useEffect(() => {
    //     console.log("Admin", admin);
    // }, [admin]);

    useEffect(() => {
        // console.log("mainEnrollData", mainEnrollData);
        setEnrollData(mainEnrollData);
    }, [mainEnrollData]);

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

    async function handleAction(value: string) {
        console.log("handleAction", value);
        if (value && selectedEnroll.length > 0) {
            setAlert(null);
            await actionList[value]();
        } else {
            setAlert({ type: "warning", title: "Selecione ao menos uma inscrição para executar uma ação!" } as Alert);
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
                                { value: "confirmed", label: "Confirmar para turma", disabled: admin?.["custom:manager"] !== "true" },
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
                    alert?.type === "error" ?
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            title={alert?.title}
                            color="red.6"
                            children={undefined}
                            withCloseButton
                            onClose={() => { setAlert(null) }}
                        />
                        : null
                }
                {
                    alert?.type === "success" ?
                        <Alert
                            icon={<IconCircleCheck size={16} />}
                            title={alert?.title}
                            color="teal.6"
                            children={undefined}
                            withCloseButton
                            onClose={() => { setAlert(null) }}
                        />
                        : null
                }
                {
                    alert?.type === "warning" ?
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            title={alert?.title}
                            color="IconCircleCheck.6"
                            children={undefined}
                            withCloseButton
                            onClose={() => { setAlert(null) }}
                        />
                        : null
                }
                <EnrollTable enrollData={tableEnrollData} setSearchBy={setSearchBy} setSelectedEnroll={setSelectedEnroll} />
                <Pagination page={activeEnrollPage} onChange={handlePagination} total={Math.ceil(sortedData?.length / limitPage)} />
            </Stack>
        </>
    );

}