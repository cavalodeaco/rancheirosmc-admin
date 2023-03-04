import { Pagination, Stack, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Enroll } from "../../FetchData";
import { EnrollTable } from "../Table";

interface EnrollManagerProps {
    enrollData: Enroll[];
}

export function EnrollManager({ enrollData }: EnrollManagerProps) {
    const [tableEnrollData, setTableEnrollData] = useState<Enroll[]>([]);
    const [activeEnrollPage, setActiveEnrollPage] = useState(1);
    const [limitPage, setLimitPage] = useState(10);

    function handlePagination(page: number) {
        setActiveEnrollPage(page);
        setTableEnrollData(enrollData.slice((page-1)*limitPage, page*limitPage));
    }

    useEffect(() => {
        setTableEnrollData(enrollData.slice((activeEnrollPage-1)*limitPage, activeEnrollPage*limitPage));
    }, [enrollData]);

    return (
        <Stack>
            <Title>Inscrições</Title>
            <EnrollTable enrollData={tableEnrollData} />
            <Pagination page={activeEnrollPage} onChange={handlePagination} total={enrollData?.length/limitPage} />
        </Stack>
    );

}