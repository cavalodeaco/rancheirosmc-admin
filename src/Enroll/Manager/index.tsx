import { Pagination, Stack, TextInput, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { Enroll } from "../../FetchData";
import { EnrollTable } from "../Table";

interface EnrollManagerProps {
    enrollData: Enroll[];
}


const searchableFields = ["city", "motorcycle_model", "motorcycle_use", "enroll_status", "motorcycle_brand"]; //, "user.driver_license", "user.driver_license_UF"];

function filterData(data: Enroll[], search: string) {
    console.log("filterData", search);
    const query = search.toLowerCase().trim();
    return data.filter((item) => {
        if (query === "") {
            return true;
        }

        if (item["enroll_date"].toLowerCase().includes(query)) {
            return true;
        }

        if (item["enroll_status"].toLowerCase().includes(query)) {
            return true;
        }

        if (item["city"].toLowerCase().includes(query)) {
            return true;
        }

        if (item["motorcycle_model"].toLowerCase().includes(query)) {
            return true;
        }

        if (item["motorcycle_use"].toLowerCase().includes(query)) {
            return true;
        }

        if (item["motorcycle_brand"].toLowerCase().includes(query)) {
            return true;
        }

        if (item["user"]["driver_license_UF"].toLowerCase().includes(query)) {
            return true;
        }

        if (item["user"]["driver_license"].toLowerCase().includes(query)) {
            return true;
        }
        // TODO: check why has any type?!
        // for (const field of searchableFields) {
        //   const [key, ...rest] = field.split(".");
        //   if (rest.length) {
        //     if (item[key][rest].toLowerCase().includes(query)) {
        //       return true;
        //     }
        //   } else if (item[key].toLowerCase().includes(query)) {
        //     return true;
        //   }
        // }
    });
}

function sortData(
    data: Enroll[],
    payload: { search: string }
) {
    return filterData(data, payload.search);
}

export function EnrollManager({ enrollData }: EnrollManagerProps) {
    const [tableEnrollData, setTableEnrollData] = useState<Enroll[]>([]);
    const [activeEnrollPage, setActiveEnrollPage] = useState(1);
    const [limitPage, setLimitPage] = useState(10);

    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(enrollData);
    const [totalPages, setTotalPages] = useState(0);

    function handlePagination(page: number) {
        setActiveEnrollPage(page);
        setTableEnrollData(sortedData.slice((page - 1) * limitPage, page * limitPage));
    }

    useEffect(() => {
        setSortedData(enrollData);
        setTableEnrollData(enrollData.slice((activeEnrollPage - 1) * limitPage, activeEnrollPage * limitPage));
        setTotalPages(enrollData.length / limitPage);
    }, [enrollData]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
        const sorted = sortData(enrollData, { search: value });
        setSortedData(sorted);
        setTableEnrollData(sorted.slice((activeEnrollPage - 1) * limitPage, activeEnrollPage * limitPage));
        setTotalPages(Math.ceil(sorted?.length / limitPage));
    };

    return (
        <Stack>
            <Title>Inscrições</Title>
            <TextInput
                placeholder="Search by any field"
                mb="md"
                icon={<IconSearch size="0.9rem" stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
            />
            <EnrollTable enrollData={tableEnrollData} />
            <Pagination page={activeEnrollPage} onChange={handlePagination} total={Math.ceil(sortedData?.length / limitPage)} />
        </Stack>
    );

}