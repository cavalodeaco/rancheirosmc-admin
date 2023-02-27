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
