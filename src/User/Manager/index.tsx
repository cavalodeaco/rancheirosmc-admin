import { Pagination, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { User } from "../../FetchData";
import { UserTable } from "../Table";

interface UserManagerProps {
    userData: User[];
}

export function UserManager({ userData }: UserManagerProps) {
    const [tableUserData, setTableUserData] = useState<User[]>([]);
    const [activeUserPage, setActiveUserPage] = useState(1);
    const [limitPage, setLimitPage] = useState(10);

    function handlePagination(page: number) {
        setActiveUserPage(page);
        setTableUserData(userData.slice((page-1)*limitPage, page*limitPage));
    }

    useEffect(() => {
        setTableUserData(userData.slice((activeUserPage-1)*limitPage, activeUserPage*limitPage));
    }, [userData]);

    return (
        <Stack>
            <Title>Alunos</Title>
            <UserTable userData={tableUserData} />
            <Pagination page={activeUserPage} onChange={handlePagination} total={userData?.length/limitPage} />
        </Stack>
    );

}