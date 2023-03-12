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
    class: string;
}

interface EnrollResponse {
    Items: Enroll[];
    page: any;
}

export interface User {
    name: string;
    email: string;
    phone: string;
    driver_license: string;
    driver_license_UF: string;
    enroll: Enroll[];
    created_at: string;
    updated_at: string;
    updated_by: string;
    PK: string;
    done: boolean;
}

interface UserResponse {
    Items: User[];
    page: any;
}

export interface Class {
    updated_at: string;
    city: string;
    name: string;
    location: string;
    active: string;
    updated_by: string;
    date: string;
    created_at: string;
}

interface ClassResponse {
    Items: Class[];
    page: any;
}

export function FetchData() {
    const [tokens, setTokens] = useLocalStorage<Tokens>({
        key: "tokens",
    });
    const [enrollData, setEnrollData] = useState<Enroll[]>([]);
    const [classData, setClassData] = useState<Class[]>([]);
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
            try {
                const enrolls: EnrollResponse = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/report/enroll`, {
                    method: "GET",
                    headers: enrollPage ? { ...headers, "page": JSON.stringify(enrollPage) } : headers
                }) // add body
                    .then((response) => response.json())
                    .then((data) => data.message);

                return enrolls;
            } catch (error: any) {
                if (error.status === 401 || error.name == "UnauthorizedError") {
                    localStorage.clear();
                    window.location.href = "/";
                }
            }
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

    async function getClassData() {
        console.log("Request data");
        if (tokens) { // only proceed if tokens are available
            const headers = {
                "limit": "200",
                // add tokens from localstorage        
                "access_token": `${tokens.access_token}`,
                "id_token": `${tokens.id_token}`
            };
            const classes: ClassResponse = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/class`, {
                method: "GET",
                headers: userPage ? { ...headers, "page": JSON.stringify(userPage) } : headers
            }) // add body
                .then((response) => response.json())
                .then((data) => data.message);
            return classes;
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

            console.log("Fetching class data");
            flag = false;
            let dataClass: Class[] = [];
            do {
                let classes: ClassResponse | undefined = await getClassData();
                if (classes) {
                    dataClass = [...classData, ...classes.Items];
                    setUserPage(classes.page || ""); // manages next data
                }
                flag = classes?.page;
            } while (flag);
            console.log("Class data fetched");

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
                user.PK = `${user.driver_license}/${user.driver_license_UF}`;
                return user;
            });

            // Save data
            setEnrollData(dataEnroll); // table data
            setUserData(dataUser); // table data
            setClassData(dataClass); // table data
        };
        fetchData();
    }, [tokens]); // execute only if tokens change    

    return (
        <Main enrollData={enrollData} userData={userData} classData={classData}/>
    )

}