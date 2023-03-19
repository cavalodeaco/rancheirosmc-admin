import { Button, Flex, Pagination, Paper, ScrollArea, Stack, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { User } from "../../FetchData";
import { Admin } from "../../Main";
import { UserTable } from "../Table";

interface UserManagerProps {
    userData: User[];
    admin: Admin | undefined;
}

const searchableFields = ["name", "driver_license_UF", "driver_license", "email", "phone", "updated_at", "updated_by", "created_at"];

function filterData(data: User[], search: string, searchBy: string = 'todos') {
    console.log("filterData: ", search);
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

export function UserManager({ userData, admin }: UserManagerProps) {
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
        console.log("Admin", admin);
    }, [admin]);

    useEffect(() => {
        setSortedData(userData);
        setTableUserData(userData.slice((activeUserPage - 1) * limitPage, activeUserPage * limitPage));
        setTotalUserData(userData.length);
    }, [userData]);

    function handleSearch() {
        console.log("handleButtonSearch", search, searchBy)
        const sorted = sortData(userData, { search: search, searchBy: searchBy });
        console.log("sorted", sorted.length);
        setSortedData(sorted);
        setActiveUserPage(1);
        setTableUserData(sorted.slice(0, limitPage));
    }

    return (
        <Stack>
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
                <Paper shadow={"xs"} p="xs" withBorder>{sortedData.length}/{userData.length}</Paper>
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
            <Pagination id="user-pagination" page={activeUserPage} onChange={handlePagination} total={Math.ceil(sortedData?.length / limitPage)} />
        </Stack>
    );

}