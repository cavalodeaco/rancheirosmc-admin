import { Pagination, Stack, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Tokens from "../../AuthenticationForm/Tokens";
import { EnrollTable } from "../Table";

interface Enroll {
    Items: any;
    page: any;
}

export function EnrollManager() {
    const [tokens, setTokens] = useLocalStorage<Tokens>({
        key: "tokens",
    });
    const [limitData, setLimitData] = useState(10); // limit data shown on table
    const [enrollData, setEnrollData] = useState([]); // enroll data shown on table
    const [enrollsList, setEnrollsList] = useState([[]]); // manages the pages of enrolls
    const [enrollPage, setEnrollPage] = useState(""); // manages 
    const [activeEnrollPage, setActiveEnrollPage] = useState(1);
    const [totalEnrollPage, setTotalEnrollPage] = useState(1);

    async function getEnrollData() {
        console.log("Request enroll data");
        if (tokens) { // only proceed if tokens are available
            const headers = {
                "limit": `${limitData}`,
                // add tokens from localstorage        
                "access_token": `${tokens.access_token}`,
                "id_token": `${tokens.id_token}`
            };
            const enrolls: Enroll = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/report/enroll`, {
                method: "GET",
                headers: enrollPage ? {...headers, "page": JSON.stringify(enrollPage) } : headers
            }) // add body
                .then((response) => response.json())
                .then((data) => data.message);
            return enrolls;
        }
        return undefined;
    }

    function manageRequest(enrolls: any) {
        console.log("Manage request - enroll data");
        if (enrolls.Items.length === 0) { // if no data
            setEnrollPage(""); // stop request
            setActiveEnrollPage(totalEnrollPage - 1); // set last valid page
            setTotalEnrollPage(totalEnrollPage - 1);
        } else {
            setEnrollData(enrolls.Items); // table data
            setEnrollsList([...enrollsList, enrolls.Items]); // store all data
            setEnrollPage(enrolls.page || ""); // manages next data
            if (enrolls.page) { // if more data
                setTotalEnrollPage(totalEnrollPage + 1); // not using enrollList because the setState is async
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getEnrollData().then(async (enrolls) => {
                if (enrolls) {
                    setEnrollData(enrolls.Items); // table data
                    setEnrollsList([enrolls.Items]); // store all data
                    setEnrollPage(enrolls.page || ""); // manages next data
                    if (enrolls.page) { // if more data
                        setTotalEnrollPage(totalEnrollPage + 1);
                    }
                }
            });
        };
        fetchData();
    }, [tokens]); // execute only if tokens change


    async function handleEnrollPaginationChange(page: number) {
        setActiveEnrollPage(page);
        // request data if page not empty
        if (enrollPage && page === totalEnrollPage) {
            await getEnrollData().then((enrolls) => {
                manageRequest(enrolls);
            });
        } else {
            setEnrollData(enrollsList[page - 1]);
        }
    }

    return (
        <Stack>
            <Title>Inscrições</Title>
            <EnrollTable data={enrollData} />
            <Pagination page={activeEnrollPage} onChange={handleEnrollPaginationChange} total={totalEnrollPage} />
        </Stack>
    );

}