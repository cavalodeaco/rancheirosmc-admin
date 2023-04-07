import { useLocalStorage } from "@mantine/hooks";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import Tokens from "../AuthenticationForm/Tokens";
import Main from "../Main";
import { Notification } from "@mantine/core";
import { IconBrandWhatsapp, IconX } from "@tabler/icons";

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
  id: string;
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

export interface Admin {
  name: string;
  email: string;
  phone_number: string;
  "custom:caller": boolean;
  "custom:cities": boolean;
  "custom:enroll_status": boolean;
  "custom:download": boolean;
  "custom:manager": boolean;
  "custom:manage_class": boolean;
  "custom:viewer": boolean;
  "custom:posclass": boolean;
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
  const [admin, setAdmin] = useState<Admin>();
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  function logout() {
    localStorage.clear();
    window.location.href = "/"; // was this really necessary?
  }

  // useEffect(() => {
  //     // admin null
  //     console.log("admin", admin);
  // }, [admin]);

  useEffect(() => {
    // decode id token using jsonwebtoken
    if (tokens) {
      const decoded: any = jwtDecode(tokens.id_token);
      setAdmin({
        name: decoded["name"],
        email: decoded["email"],
        phone_number: decoded["phone_number"],
        "custom:caller": decoded["custom:caller"] === "true",
        "custom:cities": decoded["custom:cities"] === "true",
        "custom:enroll_status": decoded["custom:enroll_status"] === "true",
        "custom:download": decoded["custom:download"] === "true",
        "custom:manager": decoded["custom:manager"] === "true",
        "custom:manage_class": decoded["custom:manage_class"] === "true",
        "custom:viewer": decoded["custom:viewer"] === "true",
        "custom:posclass": decoded["custom:posclass"] === "true",
      } as Admin);
    }
  }, [tokens]);

  async function adminFetch(input: RequestInfo | URL, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.status === 401) {
      logout();
    } else if (response.status === 200) {
      const data = await response.json();
      return data.message;
    } else if (response.status === 500) {
      // internal server error
      const data = await response.json();
      setAlert(true);
      // 'https://wa.me/?text=${alertMsg}'
      const date = new Date();
      const message = `${admin?.name} :: ${date.toLocaleString(
        "pt-BR"
      )}:${date.getMilliseconds()} :: ${data.replace(/ /g, "%20")}`;
      setAlertMsg(`https://wa.me/?text=${message}`);
    }
    return undefined;
  }

  async function getEnrollData() {
    console.log("Request data");
    if (tokens) {
      // only proceed if tokens are available
      const headers = {
        limit: "200",
        // add tokens from localstorage
        access_token: `${tokens.access_token}`,
        id_token: `${tokens.id_token}`,
      };
      const enrolls: EnrollResponse = await adminFetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/report/enroll`,
        {
          method: "GET",
          headers: enrollPage
            ? { ...headers, page: JSON.stringify(enrollPage) }
            : headers,
        }
      ); // add body
      // TODO: try error handling
      return enrolls;
    }
    return undefined;
  }

  async function getUserData() {
    console.log("Request data");
    if (tokens) {
      // only proceed if tokens are available
      const headers = {
        limit: "200",
        // add tokens from localstorage
        access_token: `${tokens.access_token}`,
        id_token: `${tokens.id_token}`,
      };
      const users: UserResponse = await adminFetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/report/user`,
        {
          method: "GET",
          headers: userPage
            ? { ...headers, page: JSON.stringify(userPage) }
            : headers,
        }
      ); // add body
      return users;
    }
    return undefined;
  }

  async function getClassData() {
    console.log("Request data");
    if (tokens) {
      // only proceed if tokens are available
      const headers = {
        limit: "200",
        // add tokens from localstorage
        access_token: `${tokens.access_token}`,
        id_token: `${tokens.id_token}`,
      };
      const classes: ClassResponse = await adminFetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/class`,
        {
          method: "GET",
          headers: userPage
            ? { ...headers, page: JSON.stringify(userPage) }
            : headers,
        }
      ); // add body
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
        if (enrolls?.Items) {
          dataEnroll = [...dataEnroll, ...enrolls?.Items];
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
        if (users?.Items) {
          dataUser = [...userData, ...users?.Items];
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
        if (classes?.Items) {
          dataClass = [...classData, ...classes?.Items];
          setUserPage(classes.page || ""); // manages next data
        }
        flag = classes?.page;
      } while (flag);
      console.log("Class data fetched");

      // Process data
      // Find the user of each enroll
      dataEnroll = dataEnroll.map((enroll) => {
        const user = dataUser.find(
          (user) =>
            user.driver_license === enroll.user.driver_license &&
            user.driver_license_UF === enroll.user.driver_license_UF
        );
        if (user) {
          enroll.user = user;
        }
        enroll.id = `${enroll.city}/${enroll.enroll_date}`;
        return enroll;
      });
      // Find enrolls of each user
      dataUser = dataUser.map((user) => {
        user.enroll = user.enroll.map((user_enroll) => {
          const enroll = dataEnroll.filter(
            (enroll) =>
              enroll.enroll_date === user_enroll.enroll_date &&
              enroll.city === user_enroll.city
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
  }, [admin]); // execute only if admin change

  return (
    <>
      {alert ? (
        <Notification
          icon={<IconX size="1.1rem" />}
          color="red"
          onClose={() => setAlert(false)}
        >
          Envie esta mensagem para o grupo de Suporte do PPV Admin clicando no
          link{" "}
          <a href={alertMsg} target="_blank">
            <IconBrandWhatsapp />
          </a>
          .
        </Notification>
      ) : (
        <Main
          enrollData={enrollData}
          userData={userData}
          classData={classData}
          admin={admin}
        />
      )}
    </>
  );
}
