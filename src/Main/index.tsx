import { useEffect, useState } from "react";
import {
  AppShell, Center, createStyles, Group, Header, Space, Title,
} from "@mantine/core";
import { Menu } from "../Menu";
import { EnrollManager } from "../Enroll/Manager";
import { UserManager } from "../User/Manager";
import TextPPV from "../TextPPV/TextPPV";
import ppvicon from '../img/iconppv.svg';
import { Enroll, User } from "../FetchData";
import { useLocalStorage } from "@mantine/hooks";
import jwtDecode from "jwt-decode";
import Tokens from "../AuthenticationForm/Tokens";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    }
  }
}
);

interface MainProps {
  enrollData: Enroll[];
  userData: User[];
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

export default function Main({ enrollData, userData }: MainProps) {
  const { classes, cx } = useStyles();
  const [isEnroll, setIsEnroll] = useState(false);
  const [isUser, setIsUser] = useState(false);
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

  return (
    <AppShell
      header={
        <Header height={60} p="xs">
          <Group className={classes.header} position="center">
            <Title order={3} transform="uppercase" italic>
              <Center>
                <img src={ppvicon} alt="Pilotando Para Vida" height={36} />
                <Space w="xs" />
                Pilotando Para
                {' '}
                <TextPPV text="Vida" />
              </Center>
            </Title>
          </Group>
        </Header>}
      navbar={
        <Menu setIsEnroll={setIsEnroll} setIsUser={setIsUser} admin={admin}/>
      }
    >
      {isEnroll && <EnrollManager enrollData={enrollData} admin={admin}/>}
      {isUser && <UserManager userData={userData}  admin={admin}/>}
    </AppShell>
  );
}
