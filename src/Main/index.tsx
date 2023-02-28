import { useState } from "react";
import {
  AppShell,
  useMantineTheme,
} from "@mantine/core";
import { Menu } from "../Menu";
import { EnrollTable } from "../Enrolltable";
import { UserTable } from "../UserTable";


export default function Main() {
  const theme = useMantineTheme();
  const [enrollData, setEnrollData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isEnroll, setIsEnroll] = useState(false);
  const [isUser, setIsUser] = useState(false);

  return (
    <AppShell
      navbar={
        <Menu setEnrollData={setEnrollData} setUserData={setUserData} setIsEnroll={setIsEnroll} setIsUser={setIsUser} />
      }
    >
      {isEnroll && <EnrollTable data={enrollData} />}
      {isUser && <UserTable data={userData} />}
    </AppShell>
  );
}
