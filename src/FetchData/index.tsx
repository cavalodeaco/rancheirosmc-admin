import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Tokens from "../AuthenticationForm/Tokens";
import Main from "../Main";

export interface Enroll {
    updated_at: string;
    city: string;
    terms: {
        authorization: boolean;
        responsibility: boolean;
        lgpd: boolean;
    };
    motorcycle_model: string;
    motorcycle_use: string;
    updated_by: string;
    enroll_status: string;
    motorcycle_brand: string;
    enroll_date: string;
    user: {
        driver_license: string;
        driver_license_UF: string;
    };
}

interface EnrollResponse {
    Items: Enroll[];
    page: any;
}

export interface User {
    driver_license_UF: string;
    createdAt: string;
    phone: string;
    name: string;
    driver_license: string;
    PK: string;
    enroll: {
        city: string;
        enroll_date: string;
    }[];
    email: string;
    updatedAt: string;
    done: boolean;
}

interface UserResponse {
    Items: User[];
    page: any;
}

export function FetchData() {
    const [tokens, setTokens] = useLocalStorage<Tokens>({
        key: "tokens",
    });
    const [enrollData, setEnrollData] = useState<Enroll[]>([]);
    const [userData, setUserData] = useState<User[]>([]);
    const [enrollPage, setEnrollPage] = useState(""); // manages 
    const [userPage, setUserPage] = useState(""); // manages 


    async function getEnrollData() {
        console.log("Request data");
        if (tokens) { // only proceed if tokens are available
            const headers = {
                "limit": "200",
                // add tokens from localstorage        
                "access_token": `${tokens.access_token}`,
                "id_token": `${tokens.id_token}`
            };
            const enrolls: EnrollResponse = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/report/enroll`, {
                method: "GET",
                headers: enrollPage ? { ...headers, "page": JSON.stringify(enrollPage) } : headers
            }) // add body
                .then((response) => response.json())
                .then((data) => data.message);
            return enrolls;
        }
        return undefined;
    }

    async function getUserData() {
        console.log("Request data");
        if (tokens) { // only proceed if tokens are available
            const headers = {
                "limit": "200",
                // add tokens from localstorage        
                "access_token": `${tokens.access_token}`,
                "id_token": `${tokens.id_token}`
            };
            const users: UserResponse = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/report/user`, {
                method: "GET",
                headers: userPage ? { ...headers, "page": JSON.stringify(userPage) } : headers
            }) // add body
                .then((response) => response.json())
                .then((data) => data.message);
            return users;
        }
        return undefined;
    }

    useEffect(() => {
        const fetchEnrollData = async () => {
            console.log("Fetching enroll data");
            let flag = false;
            do {
                let enrolls: EnrollResponse | undefined = await getEnrollData();
                if (enrolls) {
                    const data = [...enrollData, ...enrolls.Items];
                    setEnrollData(data); // table data
                    setEnrollPage(enrolls.page || ""); // manages next data
                }
                flag = enrolls?.page;
            } while (flag);
            console.log("Enroll data fetched");
        };
        fetchEnrollData();

        
        const fetchUserData = async () => {
            console.log("Fetching user data");
            let flag = false;
            do {
                let users: UserResponse | undefined = await getUserData();
                if (users) {
                    const data = [...userData, ...users.Items];
                    setUserData(data); // table data
                    setUserPage(users.page || ""); // manages next data
                }
                flag = users?.page;
            } while (flag);
            console.log("User data fetched");
        };
        fetchUserData();

    }, [tokens]); // execute only if tokens change

    return (
        <Main enrollData={enrollData} userData={userData} />
    )

}