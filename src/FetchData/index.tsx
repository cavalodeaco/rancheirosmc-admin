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
    user: User;
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
    enroll: Enroll[];
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
        const fetchData = async () => {
            // enroll data
            console.log("Fetching enroll data");
            let flag = false;
            let dataEnroll: Enroll[] = [];
            do {
                let enrolls: EnrollResponse | undefined = await getEnrollData();
                if (enrolls) {
                    dataEnroll = [...dataEnroll, ...enrolls.Items];
                    setEnrollPage(enrolls.page || ""); // manages next data
                }
                flag = enrolls?.page;
            } while (flag);
            console.log("Enroll data fetched");


            console.log("Fetching user data");
            flag = false;
            let dataUser: User[] = [];
            do {
                let users: UserResponse | undefined = await getUserData();
                if (users) {
                    dataUser = [...userData, ...users.Items];
                    setUserPage(users.page || ""); // manages next data
                }
                flag = users?.page;
            } while (flag);
            console.log("User data fetched");

            // Process data
            // Find the user of each enroll
            dataEnroll = dataEnroll.map((enroll) => {
                const user = dataUser.find((user) =>
                    user.driver_license === enroll.user.driver_license && user.driver_license_UF === enroll.user.driver_license_UF
                );
                if (user) {
                    enroll.user = user;
                }
                return enroll;
            });
            // Find enrolls of each user
            dataUser = dataUser.map((user) => {
                user.enroll = user.enroll.map((user_enroll) => {
                    const enroll = dataEnroll.filter((enroll) =>
                        enroll.enroll_date === user_enroll.enroll_date && enroll.city === user_enroll.city
                    );
                    if (enroll.length > 1) {
                        console.log("####-----> More than one enroll found!! ");
                    }
                    return enroll[0]; // needs to be only one
                });
                return user;
            });

            // Save data
            setEnrollData(dataEnroll); // table data
            setUserData(dataUser); // table data
        };
        fetchData();
    }, [tokens]); // execute only if tokens change    

    return (
        <Main enrollData={enrollData} userData={userData} />
    )

}