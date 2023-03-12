import { Button, Flex, Pagination, Paper, ScrollArea, Slider, Stack, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { Class } from "../../FetchData";
import { Admin } from "../../Main";
import { CreateForm } from "../CreateForm";
import { ClassTable } from "../Table";

interface ClassManagerProps {
    classData: Class[];
    admin: Admin | undefined;
}

const searchableFields = ["city", "name", "location", "date", "updated_by", "created_at", "updated_at"];

function filterData(data: Class[], search: string, searchBy: string = 'todos') {
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
    data: Class[],
    payload: { search: string, searchBy: string }
) {
    return filterData(data, payload.search, payload.searchBy);
}

export function ClassManager({ classData, admin }: ClassManagerProps) {
    const [tableClassData, setTableClassData] = useState<Class[]>([]);
    const [activeClassPage, setActiveClassPage] = useState(1);
    const [limitPage, setLimitPage] = useState(10);
    const [searchBy, setSearchBy] = useState('todos');
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(classData);
    const [totalClassData, setTotalClassData] = useState(0);
    const [isCreation, setIsCreation] = useState(false);
    const marks = [
        { value: 25, label: "25%" },
        { value: 50, label: "50%" },
        { value: 75, label: "75%" },
    ];

    function changeLimit(value: number) {
        console.log("Limit: ", value);
        // limit % of totalClassData
        setLimitPage(Math.ceil(value * 100 / totalClassData));
        handlePagination(1); // move to first page
    }

    function handlePagination(page: number) {
        setActiveClassPage(page);
        setTableClassData(sortedData.slice((page - 1) * limitPage, page * limitPage));
    }

    useEffect(() => {
        console.log("Admin", admin);
    }, [admin]);

    useEffect(() => {
        setSortedData(classData);
        setTableClassData(classData.slice((activeClassPage - 1) * limitPage, activeClassPage * limitPage));
        setTotalClassData(classData.length);
    }, [classData]);

    function handleSearch() {
        console.log("handleButtonSearch", search, searchBy)
        const sorted = sortData(classData, { search: search, searchBy: searchBy });
        console.log("sorted", sorted.length);
        setSortedData(sorted);
        setActiveClassPage(1);
        setTableClassData(sorted.slice(0, limitPage));
    }

    function handleCreateClass () {
        console.log("handleCreateClass");
        const manager = admin?.["custom:manager"];
        if (manager == "true") {
            setIsCreation(true);
        } else {
            setIsCreation(false);
        }
    }

    return (
        <Stack>
            <Title>Turmas</Title>
            {!isCreation ? <>
                <Flex gap={"md"}>
                    <Button onClick={handleCreateClass}>Criar turma</Button>
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
                    <Paper shadow={"xs"} p="xs" withBorder>{sortedData.length}/{classData.length}</Paper>
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
                <ClassTable classData={tableClassData} setSearchBy={setSearchBy} />
                <Pagination page={activeClassPage} onChange={handlePagination} total={Math.ceil(sortedData?.length / limitPage)} />
            </>
                : <>
                    <Flex gap={"md"}>
                        <Button onClick={() => { setIsCreation(false) }}>Voltar</Button>
                        <CreateForm/>
                    </Flex>
                </>}
        </Stack>
    );

}