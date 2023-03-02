import { useState } from "react";
import {
  AppShell,
} from "@mantine/core";
import { Menu } from "../Menu";
import { EnrollManager } from "../Enroll/Manager";
import { UserManager } from "../User/Manager";


export default function Main() {
  const [isEnroll, setIsEnroll] = useState(false);
  const [isUser, setIsUser] = useState(false);

  return (
    <AppShell
      navbar={
        <Menu setIsEnroll={setIsEnroll} setIsUser={setIsUser} />
      }
    >
      {isEnroll && <EnrollManager />}
      {isUser && <UserManager />}
    </AppShell>
  );
}
