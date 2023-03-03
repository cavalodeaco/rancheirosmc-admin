import { useState } from "react";
import {
  AppShell, Center, createStyles, Group, Header, Space, Title,
} from "@mantine/core";
import { Menu } from "../Menu";
import { EnrollManager } from "../Enroll/Manager";
import { UserManager } from "../User/Manager";
import TextPPV from "../TextPPV/TextPPV";
import ppvicon from '../img/iconppv.svg';

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

export default function Main() {
  const { classes, cx } = useStyles();
  const [isEnroll, setIsEnroll] = useState(false);
  const [isUser, setIsUser] = useState(false);

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
        <Menu setIsEnroll={setIsEnroll} setIsUser={setIsUser} />
      }
    >
      {isEnroll && <EnrollManager />}
      {isUser && <UserManager />}
    </AppShell>
  );
}
