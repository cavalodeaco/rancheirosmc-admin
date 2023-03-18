import { useEffect, useState } from "react";
import {
  AppShell,
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
import { Class, Enroll, User } from "../FetchData";
import { useLocalStorage } from "@mantine/hooks";
import jwtDecode from "jwt-decode";
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
}

export interface Admin {
  name: string;
  email: string;
  phone_number: string;
  "custom:cambira": string;
  "custom:curitiba": string;
  "custom:londrina": string;
  "custom:manager": string;
  "custom:maringa": string;
  "custom:medianeira": string;
  "custom:viewer": string;
}

export default function Main({ enrollData, userData, classData }: MainProps) {
  const { classes, cx } = useStyles();
  const [isEnroll, setIsEnroll] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isClass, setIsClass] = useState(false);
  const [admin, setAdmin] = useState<Admin>();

  const [tokens, setTokens] = useLocalStorage<Tokens>({
    key: "tokens",
  });

  useEffect(() => {
    // decode id token using jsonwebtoken
    if (tokens) {
      const decoded = jwtDecode(tokens.id_token);
      setAdmin(decoded as Admin);
    }
  }, [tokens]);
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      header={
        <Header height={60} p="xs">
          <Group className={classes.header} position="center">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                mr="xl"
              />
            </MediaQuery>
            <Title order={3} transform="uppercase" italic>
              <Center>
                <img src={ppvicon} alt="Pilotando Para Vida" height={36} />
                <Space w="xs" />
                Pilotando Para <TextPPV text="Vida" />
              </Center>
            </Title>
          </Group>
        </Header>
      }
      navbar={
        <Menu
          setIsEnroll={setIsEnroll}
          setIsUser={setIsUser}
          setIsClass={setIsClass}
          admin={admin}
          opened={opened}
        />
      }
    >
      {isEnroll && <EnrollManager enrollData={enrollData} admin={admin} classList={classData.map((item) => item.name)} />}
      {isUser && <UserManager userData={userData} admin={admin} />}
      {isClass && <ClassManager classData={classData} admin={admin} />}
    </AppShell>
  );
}
