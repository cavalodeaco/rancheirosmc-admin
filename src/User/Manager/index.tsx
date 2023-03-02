import { Pagination, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { UserTable } from "../Table";

interface User {
    Items: any;
    page: any;
}

export function UserManager() {
    const [limitData, setLimitData] = useState(2); // limit data shown on table
    const [userData, setUserData] = useState([]); // user data shown on table
    const [usersList, setUsersList] = useState([[]]); // manages the pages of users
    const [userPage, setUserPage] = useState(""); // manages 
    const [activeUserPage, setActiveUserPage] = useState(1);
    const [totalUserPage, setTotalUserPage] = useState(1);

    async function getData() {
        console.log("Request data");
        const users: User = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/report/user`, {
            headers: userPage ? {
                "limit": `${limitData}`,
                "page": JSON.stringify(userPage)
            } : { limit: `${limitData}` },
        }) // add body
            .then((response) => response.json())
            .then((data) => data.message);
        return users;
    }

    function manageRequest(users: any) {
        console.log("Manage request");
        if (users.Items.length == 0) { // if no data
            setUserPage(""); // stop request
            setActiveUserPage(totalUserPage-1); // set last valid page
            setTotalUserPage(totalUserPage-1); 
        } else {
            setUserData(users.Items); // table data
            setUsersList([...usersList, users.Items]); // store all data
            setUserPage(users.page || ""); // manages next data
            if (users.page) { // if more data
                setTotalUserPage(totalUserPage + 1); // not using userList because the setState is async
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getData().then(async (users) => {
                setUserData(users.Items); // table data
                setUsersList([users.Items]); // store all data
                setUserPage(users.page || "ABC"); // manages next data
                if (users.page) { // if more data
                    setTotalUserPage(totalUserPage + 1);
                }
            });
        };
        fetchData();
    }, []); // only once


    async function handleUserPaginationChange(page: number) {
        setActiveUserPage(page);
        // request data if page not empty
        if (userPage && page == totalUserPage) {
            await getData().then((users) => {
                manageRequest(users);
            });
        } else {
            setUserData(usersList[page - 1]);
        }
    }

    return (
        <Stack>
            <UserTable data={userData} />
            <Pagination page={activeUserPage} onChange={handleUserPaginationChange} total={totalUserPage} />
        </Stack>
    );

}