import { useState } from 'react';
import { createStyles, Navbar, Group, Code, Center, Space, Title, Header } from '@mantine/core';
import {
  IconHome,
  IconLogout,
  IconMotorbike,
  IconUser,
} from '@tabler/icons';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {

    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        [`& .${icon}`]: {
          color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
      },
    },
  };
});

interface MenuProps {
  setIsEnroll: Function | any;
  setIsUser: Function | any;
}


export function Menu({ setIsEnroll, setIsUser }: MenuProps) {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('Métricas');

  const data = [
    {
      link: '', label: 'Métricas', icon: IconHome, action: () => {
        if (active !== "Métricas") { // if not in the same page
          setIsEnroll(false);
          setIsUser(false);
        }
      }
    },
    {
      link: '', label: 'Inscrições', icon: IconMotorbike, action: async () => {
        if (active !== "Inscrições") { // if not in the same page
          setIsEnroll(true);
          setIsUser(false);
        }
      }
    },
    {
      link: '', label: 'Alunos', icon: IconUser, action: async () => {
        if (active !== "Alunos") { // if not in the same page
          setIsEnroll(false);
          setIsUser(true);
        }
      }
    }
  ];

  const links = data.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      href={item.link}
      key={item.label}
      onClick={async (event) => {
        event.preventDefault();
        await item.action();
        setActive(item.label);
      }}
    >
      <item.icon />
      <Space w="xs" />
      <Title size={18}>{item.label}</Title>
    </a>
  ));

  return (
    <Navbar height={"95vh"} width={{ sm: 300 }} p="md">
      <Navbar.Section grow>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => {
          localStorage.clear();
          window.location.href = "/";
        }}>
          <IconLogout />
          <Space w="xs" />
          <Title size={18}>Logout</Title>
        </a>
      </Navbar.Section>
    </Navbar >
  );
}