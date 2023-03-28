import { ActionIcon, Alert, Badge, Button, Code, createStyles, Flex, Group, List, Modal, Pagination, Paper, ScrollArea, Select, Slider, Stack, TextInput, Title, Transition, UnstyledButton } from "@mantine/core";
import { IconAlertCircle, IconArchive, IconBackspace, IconBrandHipchat, IconCertificate, IconCheckbox, IconCircleCheck, IconCircleMinus, IconHourglassEmpty, IconMessageCircleOff, IconSearch } from "@tabler/icons";
import { forwardRef, useEffect, useState } from "react";
import { Admin, Enroll } from "../../FetchData";
import { EnrollTable } from "../Table";
import Tokens from "../../AuthenticationForm/Tokens";
import { useDisclosure, useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { QuestionMark } from "tabler-icons-react";
import { AlertType } from "../../Menu";

const useStyles = createStyles((theme) => ({
    stretch: {
        flexGrow: 1,
    },

    actions: {
        justifyContent: "space-between",
    },
}));

interface EnrollManagerProps {
    mainEnrollData: Enroll[];
    admin: Admin | undefined;
    classList: string[];
}

const searchableFields = ["enroll_status", "city", "enroll_date", "user.name", "user.driver_license", "user.driver_license_UF", "user.phone", "class", "updated_by"]; // "motorcycle_model", "motorcycle_use", "motorcycle_brand","updated_at", 

function filterData(data: Enroll[], search: string, searchBy: string = 'todos') {
    console.log("filterData", search);
    const queries = search.toLowerCase().split("+"); /// split by + and search for each
    return data.filter((item) => {
        if (queries.length === 0) {
            return true;
        }

        function search(field: string, query:string, n_item: any) {
            const [key, rest] = field.split(".");
            if (rest) {
                if (n_item[key][rest]?.toLowerCase().includes(query)) {
                    return true;
                }
            } else if (n_item[key]?.toLowerCase().includes(query)) {
                return true;
            }
            return false;
        }

        // loop over queries
        for (const query of queries) {
            const queryTrim = query.trim();            
            if (searchBy === 'todos') {
                for (const field of searchableFields) {
                    if (search(field, queryTrim, item))
                        return true;
                }
                return false;
            } else {
                return search(searchBy, queryTrim, item);
            }
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

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    icon: any;
    label: string;
    value: string;
    disabled: boolean;
  }

export function EnrollManager({ mainEnrollData, admin, classList }: EnrollManagerProps) {
    const [tokens, setTokens] = useLocalStorage<Tokens>({
        key: "tokens",
    });
    const { classes } = useStyles();
    const [tableEnrollData, setTableEnrollData] = useState<Enroll[]>([]);
    const [activeEnrollPage, setActiveEnrollPage] = useState(1);
    const [opened, { open, close }] = useDisclosure(false);
    const isMobile = useMediaQuery("(max-width: 50em)");  
    const [selectedEnroll, setSelectedEnroll] = useState<Enroll[]>([]);
    const [limitPage, setLimitPage] = useState(10);
    const [searchBy, setSearchBy] = useState('todos');
    const [search, setSearch] = useState('');
    const [defaultSearch, setDefaultSearch] = useState('');
    const [enrollData, setEnrollData] = useState<Enroll[]>([]);
    const [sortedData, setSortedData] = useState(enrollData);
    const [totalEnrollData, setTotalEnrollData] = useState(0);
    const [action, setAction] = useState<string | null>("actions");
    const [alert, setAlert] = useState<AlertType | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const actionList =
        {
            "update_class_and_status": async function (url: string, msg_success: string, msg_warning: string, msg_error: string) {
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
                        `${process.env.REACT_APP_BACKEND_ADDRESS}/manager/${url}` as string,
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
                    if (process.env.ENV !== "production") {
                        console.log("response", response);
                    }
                    if (response.status === 200 && message !== "partial") {
                        setAlert({ type: "success", title: msg_success } as AlertType);
                    } else if (response.status === 206 && message === "partial") {
                        setAlert({ type: "warning", title: msg_warning } as AlertType);
                    }
                } catch (error) {
                    setAlert({ type: "error", title: msg_error } as AlertType);
                }

                // TODO: create wame para com mensagens para o próprio usuário com os links de chats para cada aluno selecionado
                setAction(null);
            },
            "call": async function () {
                if (process.env.ENV !== "production") {
                    console.log("call");
                }
                if (selectedClass) {
                    actionList["update_class_and_status"]("call", "Chamada realizada com sucesso!", "Chamada realizada com sucesso, porém alguns alunos não foram chamados!", "Erro ao realizar chamada!");
                } else {
                    setAlert({ type: "warning", title: "Selecione uma turma para realizar chamada!" } as AlertType);
                }
            },
            "update_status": async function (url: string, msg_success: string, msg_warning: string, msg_error: string) {
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
                        `${process.env.REACT_APP_BACKEND_ADDRESS}/manager/${url}` as string,
                        config
                    );
                    const { message, enrolls } = await response.json();
                    const updateStatus = async (enrolls: any) => {
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

                    updateStatus(enrolls);
                    if (response.status === 200 && message !== "partial") {
                        setAlert({ type: "success", title: msg_success } as AlertType);
                    } else if (response.status === 206 && message === "partial") {
                        setAlert({ type: "warning", title: msg_warning } as AlertType);
                    }
                } catch (error) {
                    setAlert({ type: "error", title: msg_error } as AlertType);
                }
                setAction(null);
            },
            "confirmed": async function () {
                if (process.env.ENV !== "production") {
                    console.log("confirmed");
                }
                actionList["update_status"]("confirm", "Inscrição(ões) confirmada(s) para sua(s) turma(s)!", "Inscrição(ões) parcialmente confirmada(s)!", "Falha ao confirmar inscrição(ões)!");
            },
            "certified": function () {
                if (process.env.ENV !== "production") {
                    console.log("certified");
                }
                actionList["update_status"]("certify", "Inscrição(ões) certificada(s) em sua(s) turma(s)!", "Inscrição(ões) parcialmente certificada(s)!", "Falha ao certificar inscrição(ões)!");
            },
            "missed": function () {
                if (process.env.ENV !== "production") {
                    console.log("missed");
                }
                actionList["update_status"]("miss", "Aplicada(s) falta(s) na(s) inscrição(ões)!", "Falta(s) parcialmente aplicada(s)!", "Falha ao aplicar falta(s)!");
            },
            "dropout": function () {
                if (process.env.ENV !== "production") {
                    console.log("dropout");
                }
                actionList["update_class_and_status"]("drop", "Aplicada(s) desistência(s) na(s) inscrição(ões)!", "Desistência(s) parcialmente aplicada(s)!", "Falha ao ao aplicar desistência(s)!");
            },
            "ignored": function () {
                if (process.env.ENV !== "production") {
                    console.log("ignored");
                }
                actionList["update_class_and_status"]("ignore", "Aplicado status de ignorado na(s) inscrição(ões)!", "Ignorado(s) parcialmente aplicado(s)!", "Falha ao ao aplicar status de ignorado!");
            },
            "waiting": async function () {
                if (process.env.ENV !== "production") {
                    console.log("waiting");
                }
                actionList["update_class_and_status"]("wait", "Inscrição de volta a lista de espera!", "Falha ao voltar inscrição para lista de espera! [obs.: certificados não retornam para lista de espera.]", "Falha ao voltar inscrição para lista de espera! [obs.: certificados não retornam para lista de espera.]");
            },
        } as ActionList;
    const marks = [
        { value: 25, label: "25%" },
        { value: 50, label: "50%" },
        { value: 75, label: "75%" },
    ];

    // function changeLimit(value: number) {
    //     console.log("Limit: ", value);
    //     // limit % of totalEnrollData
    //     setLimitPage(Math.ceil(value * 100 / totalEnrollData));
    //     handlePagination(1); // move to first page
    // }

    function handlePagination(page: number) {
        setActiveEnrollPage(page);
        setTableEnrollData(sortedData.slice((page - 1) * limitPage, page * limitPage));
    }

    // useEffect(() => {
    //     // console.log("mainEnrollData", mainEnrollData);
    //     setEnrollData(mainEnrollData);
    // }, [mainEnrollData]);

    useEffect(() => {
        // console.log(mainEnrollData.length);
        // console.log(admin);
        // TODO: remove default search after backend implementation of filtering data
        let default_city = "";
        if (admin?.["custom:cambira"]) default_city = default_city ? default_city+"+cambira" : "cambira";
        if (admin?.["custom:londrina"]) default_city = default_city ? default_city+"+londrina" : "londrina";
        if (admin?.["custom:maringa"]) default_city = default_city ? default_city+"+maringa" : "maringa";
        if (admin?.["custom:medianeira"]) default_city = default_city ? default_city+"+medianeira" : "medianeira";
        if (admin?.["custom:curitiba"]) default_city = default_city ? default_city+"+curitiba" : "curitiba";
        // status filter 
        let default_filter = "";
        if (admin?.["custom:posclass"] && !admin?.["custom:manager"]) {
            default_filter = 'confirmed+certified+missed';
        } else if (!(admin?.["custom:caller"] || admin?.["custom:manager"])) {
            default_filter = 'waiting+legacy_waiting';
        } else if (admin?.["custom:caller"] && !admin?.["custom:manager"]) {
            default_filter = 'waiting+legacy_waiting+dropped';
        }
        // setDefaultSearch(default_filter ? default_city+"+"+default_filter : default_city);
        setEnrollData(sortData(mainEnrollData, { search: default_filter ? default_city+"+"+default_filter : default_city, searchBy: searchBy }));
    }, [mainEnrollData,admin]);

    useEffect(() => {
        handleSearch();
    }, [enrollData]);

    function handleSearch() {
        console.log("handleSearch", search, searchBy)
        const s_search = search ? (defaultSearch ? `${defaultSearch}+${search}` : search) : defaultSearch;
        const sorted = sortData(enrollData, { search: s_search, searchBy: searchBy });
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
            setAlert({ type: "warning", title: "Selecione ao menos uma inscrição para executar uma ação!" } as AlertType);
        }
    }

    const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
        ({ icon, label, ...others }: ItemProps, ref) => (
          <div ref={ref} {...others}>
            <Group noWrap>
              {icon} {label}
            </Group>
          </div>
        )
      );

    return (
        <>
            <Transition
                mounted={opened}
                transition="fade"
                duration={400}
                timingFunction="ease"
            >
                {(styles) => {
                    return (
                        <div style={styles}>
                            <Modal opened={opened} onClose={close} fullScreen={isMobile} title="Legenda de status">
                                <List
                                    center
                                    spacing="xs"
                                    size="sm">
                                    <List.Item icon={<IconHourglassEmpty />}>
                                        Em lista de espera (disponível para chamar para uma turma)
                                    </List.Item>
                                    <List.Item icon={<IconArchive />}>
                                        Inscrição do Google Forms (disponível para chamar para uma turma)
                                    </List.Item>
                                    <List.Item icon={<IconBrandHipchat color='#00abfb' />}>
                                        Convidado para uma turma (entrou em contato com o aluno para uma turma específica)
                                    </List.Item>
                                    <List.Item icon={<IconBackspace color='#ffbf00' />}>
                                        Desistiu da vaga na turma (não poderá participar do curso de forma justificada, informado anteriormente a data do curso)
                                    </List.Item>
                                    <List.Item icon={<IconCheckbox color='#ffec00' />}>
                                        Confirmou convite para a turma
                                    </List.Item>
                                    <List.Item icon={<IconCertificate color='#7bc62d' />}>
                                        Participou do curso (aluno recebeu certificado no curso)
                                    </List.Item>
                                    <List.Item icon={<IconCircleMinus color='#ff4500' />}>
                                        Faltou no curso (este aluno não participou e deve se inscrever novamente se quiser realizar o curso em outra turma)
                                    </List.Item>
                                    <List.Item icon={<IconMessageCircleOff color='#ff9300' />}>
                                        Não deu resposta ao convite (este aluno deverá se inscrever novamente se quiser realizar o curso em outra turma)
                                    </List.Item>
                                </List>
                            </Modal>
                        </div>
                    );
                }}
            </Transition>
            <Flex direction={"column"} gap={"md"}>
                <TextInput
                    placeholder={`Pesquisar`}
                    icon={<IconSearch size="0.9rem" stroke={1.5} />}
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleSearch();
                        }
                    }}
                    rightSection={
                        <Badge color="gray" size="xs">
                            {sortedData.length} de {enrollData.length}
                        </Badge>
                    }
                    rightSectionWidth={"5rem"}
                />
                {/* <Paper shadow={"xs"} p="xs" withBorder>
                        {sortedData.length}/{enrollData.length}
                    </Paper> */}

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
                <Flex gap={"xs"} align="center" className={classes.actions}>
                    <Select
                        placeholder="Turma"
                        data={classList}
                        clearable
                        className={classes.stretch}
                        onChange={setSelectedClass}
                    />
                    <Select
                        data={[
                            {
                                value: "call",
                                label: "Chamar para turma",
                                icon: <IconBrandHipchat color='#00abfb' />,
                                disabled: admin?.["custom:manager"] || admin?.["custom:caller"] ? false : true,
                            },
                            {
                                value: "confirmed",
                                label: "Confirmar para turma",
                                icon: <IconCheckbox color='#ffec00' />,
                                disabled: admin?.["custom:manager"] || admin?.["custom:caller"] ? false : true,
                            },
                            {
                                value: "certified",
                                label: "Indicar presença",
                                icon: <IconCertificate color='#7bc62d' />,
                                disabled: admin?.["custom:manager"] || admin?.["custom:posclass"] ? false : true,
                            },
                            {
                                value: "missed",
                                label: "Indicar falta",
                                icon: <IconCircleMinus color='#ff4500' />,
                                disabled: admin?.["custom:manager"] || admin?.["custom:posclass"] ? false : true,
                            },
                            {
                                value: "dropout",
                                label: "Indicar desistência",
                                icon: <IconBackspace color='#ffbf00' />,
                                disabled: admin?.["custom:manager"] || admin?.["custom:caller"] ? false : true,
                            },
                            {
                                value: "ignored",
                                label: "Sem resposta",
                                icon: <IconMessageCircleOff color='#ff9300' />,
                                disabled: admin?.["custom:manager"] || admin?.["custom:caller"] ? false : true,
                            },
                        ]}
                        value={action}
                        placeholder="Ações de inscrição"
                        onChange={handleAction}
                        itemComponent={SelectItem}
                    />
                    <ActionIcon size={"sm"} radius="xl" variant="outline" onClick={open}>
                        <QuestionMark size="0.875rem" />
                    </ActionIcon>
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
                <EnrollTable enrollData={tableEnrollData} setSearchBy={setSearchBy} setSelectedEnroll={setSelectedEnroll} admin={admin} back2List={async () => actionList["waiting"]()} setAlert={setAlert}/>
                <Pagination page={activeEnrollPage} onChange={handlePagination} total={Math.ceil(sortedData?.length / limitPage)} />
            </Flex>
        </>
    );

}