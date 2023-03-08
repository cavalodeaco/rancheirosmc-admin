import { Flex, Pagination, Paper, ScrollArea, Stack, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { User } from "../../FetchData";
import { UserTable } from "../Table";

interface UserManagerProps {
    userData: User[];
}

const searchableFields = ["name", "driver_license_UF", "driver_license", "email", "phone", "enroll.city", "enroll.motorcycle_model", "enroll.motorcycle_use", "enroll.enroll_status", "enroll.motorcycle_brand", "enroll.updated_by", "enroll.enroll_date", "enroll.updated_at"];

function filterData(data: User[], search: string, searchBy: string = 'todos') {
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
    data: User[],
    payload: { search: string, searchBy: string }
) {
    return filterData(data, payload.search, payload.searchBy);
}

export function UserManager({ userData }: UserManagerProps) {
    const [tableUserData, setTableUserData] = useState<User[]>([]);
    const [activeUserPage, setActiveUserPage] = useState(1);
    const [limitPage, setLimitPage] = useState(10);
    const [searchBy, setSearchBy] = useState('todos');
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(userData);
    const [totalUserData, setTotalUserData] = useState(0);
    const marks = [
        { value: 25, label: "25%" },
        { value: 50, label: "50%" },
        { value: 75, label: "75%" },
    ];

    function changeLimit(value: number) {
        console.log("Limit: ", value);
        // limit % of totalUserData
        setLimitPage(Math.ceil(value * 100 / totalUserData));
        handlePagination(1); // move to first page
    }

    function handlePagination(page: number) {
        setActiveUserPage(page);
        setTableUserData(sortedData.slice((page - 1) * limitPage, page * limitPage));
    }

    useEffect(() => {
        setSortedData(userData);
        setTableUserData(userData.slice((activeUserPage - 1) * limitPage, activeUserPage * limitPage));
        setTotalUserData(userData.length);
    }, [userData]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
        const sorted = sortData(userData, { search: value, searchBy: searchBy });
        setSortedData(sorted);
        setTableUserData(sorted.slice((activeUserPage - 1) * limitPage, activeUserPage * limitPage));
    };

    return (
        <Stack>
            <ScrollArea>
                <Title>Alunos</Title>
                <Flex gap={"md"}>
                    <TextInput
                        placeholder={`Buscar por ${searchBy}`}
                        mb="md"
                        icon={<IconSearch size="0.9rem" stroke={1.5} />}
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <Paper shadow={"xs"} p="xs" withBorder>Total de alunos: {userData.length}</Paper>
                    <Paper shadow={"xs"} p="xs" withBorder>Total após filtro: {sortedData.length}</Paper>
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
                <UserTable userData={tableUserData} />
                <Pagination page={activeUserPage} onChange={handlePagination} total={Math.ceil(userData?.length / limitPage)} />
            </ScrollArea>
        </Stack>
    );

}