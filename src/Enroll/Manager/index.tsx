import { Pagination, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { EnrollTable } from "../Table";

interface Enroll {
    Items: any;
    page: any;
}

export function EnrollManager() {
    const [limitData, setLimitData] = useState(2); // limit data shown on table
    const [enrollData, setEnrollData] = useState([]); // enroll data shown on table
    const [enrollsList, setEnrollsList] = useState([[]]); // manages the pages of enrolls
    const [enrollPage, setEnrollPage] = useState(""); // manages 
    const [activeEnrollPage, setActiveEnrollPage] = useState(1);
    const [totalEnrollPage, setTotalEnrollPage] = useState(1);

    async function getEnrollData() {
        console.log("Request enroll data");
        const enrolls: Enroll = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/report/enroll`, {
            headers: enrollPage ? {
                "limit": `${limitData}`,
                "page": JSON.stringify(enrollPage)
            } : { limit: `${limitData}` },
        }) // add body
            .then((response) => response.json())
            .then((data) => data.message);
        return enrolls;
    }

    function manageRequest(enrolls: any) {
        console.log("Manage request");
        if (enrolls.Items.length == 0) { // if no data
            setEnrollPage(""); // stop request
            setActiveEnrollPage(totalEnrollPage-1); // set last valid page
            setTotalEnrollPage(totalEnrollPage-1); 
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
                setEnrollData(enrolls.Items); // table data
                setEnrollsList([enrolls.Items]); // store all data
                setEnrollPage(enrolls.page || "ABC"); // manages next data
                if (enrolls.page) { // if more data
                    setTotalEnrollPage(totalEnrollPage + 1);
                }
            });
        };
        fetchData();
    }, []); // only once


    async function handleEnrollPaginationChange(page: number) {
        setActiveEnrollPage(page);
        // request data if page not empty
        if (enrollPage && page == totalEnrollPage) {
            await getEnrollData().then((enrolls) => {
                manageRequest(enrolls);
            });
        } else {
            setEnrollData(enrollsList[page - 1]);
        }
    }

    return (
        <Stack>
            <EnrollTable data={enrollData} />
            <Pagination page={activeEnrollPage} onChange={handleEnrollPaginationChange} total={totalEnrollPage} />
        </Stack>
    );

}