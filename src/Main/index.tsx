import { useState } from "react";
import {
  AppShell,
  Box,
  Burger,
  Center,
  createStyles,
  Group,
  Header,
  MediaQuery,
  Space,
  Title,
} from "@mantine/core";
import { Menu } from "../Menu";
import { EnrollManager } from "../Enroll/Manager";
import { UserManager } from "../User/Manager";
import TextPPV from "../TextPPV/TextPPV";
import ppvicon from "../img/iconppv.svg";
import { Admin, Class, Enroll, User } from "../FetchData";
import { useLocalStorage } from "@mantine/hooks";
import Tokens from "../AuthenticationForm/Tokens";
import { ClassManager } from "../Class/Manager";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },
  };
});

interface MainProps {
  enrollData: Enroll[];
  userData: User[];
  classData: Class[];
  admin: Admin | undefined;
}

export default function Main({
  enrollData,
  userData,
  classData,
  admin,
}: MainProps) {
  const { classes, cx } = useStyles();
  const [isEnroll, setIsEnroll] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isClass, setIsClass] = useState(false);
  const [active, setActive] = useState("Métricas");

  const [tokens, setTokens] = useLocalStorage<Tokens>({
    key: "tokens",
  });

  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      header={
        <Header height={60} p="xs">
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Group className={classes.header} position="apart">
              <Title order={3} transform="uppercase" italic>
                <Center>
                  <img src={ppvicon} alt="Pilotando Para Vida" height={36} />
                  <Space w="xs" />
                  Pilotando Para <TextPPV text="Vida" />
                </Center>
              </Title>
              <Title order={3} transform="uppercase" italic>
                {active}
              </Title>
              <Box />
            </Group>
          </MediaQuery>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Group className={classes.header} position="apart">
              <img src={ppvicon} alt="Pilotando Para Vida" height={36} />
              <Title order={3} transform="uppercase" italic>
                {active}
              </Title>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                mr="xl"
              />
            </Group>
          </MediaQuery>
        </Header>
      }
      navbar={
        <Menu
          setIsEnroll={setIsEnroll}
          setIsUser={setIsUser}
          setIsClass={setIsClass}
          admin={admin}
          opened={opened}
          setOpened={setOpened}
          active={active}
          setActive={setActive}
        />
      }
    >
      {isEnroll && (
        <EnrollManager
          mainEnrollData={enrollData}
          admin={admin}
          classData={classData}
        />
      )}
      {isUser && <UserManager userData={userData} admin={admin} />}
      {isClass && <ClassManager classData={classData} admin={admin} />}
    </AppShell>
  );
}
