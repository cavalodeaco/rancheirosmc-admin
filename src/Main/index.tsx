import { useState } from "react";
import {
  AppShell,
  Pagination,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { Menu } from "../Menu";
import { EnrollTable } from "../Enroll/Table";
import { UserTable } from "../UserTable";
import { EnrollManager } from "../Enroll/Manager";


export default function Main() {
  const theme = useMantineTheme();
  
  const [userData, setUserData] = useState([]);
  const [isEnroll, setIsEnroll] = useState(true); // change to false
  const [isUser, setIsUser] = useState(false);

  return (
    <AppShell
      // navbar={
      //   <Menu setUserData={setUserData} setIsEnroll={setIsEnroll} setIsUser={setIsUser} />
      // }
    >
      {isEnroll && <EnrollManager/>}
      {isUser && <UserTable data={userData} />}
    </AppShell>
  );
}
