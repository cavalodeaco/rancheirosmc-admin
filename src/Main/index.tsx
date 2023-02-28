import { useState } from "react";
import {
  AppShell,
  useMantineTheme,
} from "@mantine/core";
import { Menu } from "../Menu";
import { EnrollTable } from "../Enrolltable";


export default function Main() {
  const theme = useMantineTheme();
  const [data, setData] = useState([]);
console.log(JSON.stringify({
  "SK": "373b1f7cdc8f540606891c43eb531b5148a78f68d3a455aa77a13b03d17e83e6",
  "PK": "enroll-891ac671-7078-417b-bff1-88a5d0bb6e06"
}));
  return (
    <AppShell
      navbar={
        <Menu setData={setData} />
      }
    >
      <EnrollTable data={data} />
    </AppShell>
  );
}
