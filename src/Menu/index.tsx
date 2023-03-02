import { useState } from 'react';
import { createStyles, Navbar, Group, Code } from '@mantine/core';
import {
  IconHome,
  IconLogout,
  IconMotorbike,
  IconUser,
} from '@tabler/icons';
import { MantineLogo } from '@mantine/ds';

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
  setEnrollData: Function | any;
  setUserData: Function | any;
  setIsEnroll: Function | any;
  setIsUser: Function | any;
  setPagEnrollOnchange: Function | any;
  setTotalEnrollPage: Function | any;
}

interface Enroll {
  Items: any;
  page: any;
}

export function Menu({ setEnrollData, setPagEnrollOnchange, setTotalEnrollPage, setUserData, setIsEnroll, setIsUser }: MenuProps) {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('Métricas');
  const [enrollPage, setEnrollPage] = useState("");
  const [userPage, setUserPage] = useState("");
  
  const [activeEnrollPage, setActiveEnrollPage] = useState(1);

  async function getEnrollData() {
    const enrolls = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/report/enroll`, {
      headers: enrollPage ? {
        "limit": "10",
        "page": JSON.stringify(enrollPage)
      } : { limit: "10" },
    }) // add body
      .then((response) => response.json())
      .then((data) => data.message);
    return enrolls;
  }

  // function handleEnrollPageChange(page: number) {
  //   setActiveEnrollPage(page); // change local page
  //   setEnrollData(enrollsList[page - 1]); // change data on main table
  // }

  const data = [
    {
      link: '', label: 'Métricas', icon: IconHome, action: ()=> {
        if (active != "Métricas") { // if not in the same page
          setIsEnroll(false);
          setIsUser(false);
        } 
      }
    },
    {
      link: '', label: 'Inscrições', icon: IconMotorbike, action: async () => {
        if (active != "Inscrições") { // if not in the same page
          const enrolls:Enroll = await getEnrollData(); // get first data
          // setEnrollsList([...enrollsList, enrolls.Items]);
          setIsEnroll(true);
          setIsUser(false);
          setEnrollPage(enrolls.page || "");
          setEnrollData(enrolls.Items);
          setTotalEnrollPage()
        }
      }
    },
    {
      link: '', label: 'Alunos', icon: IconUser, action: async () => {
        const users = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/report/user`, {
          headers: userPage ? {
            "limit": "10",
            "page": JSON.stringify(userPage)
          } : { limit: "10" },
        }) // add body
          .then((response) => response.json())
          .then((data) => data.message);
        setIsUser(true);
        setIsEnroll(false);
        setUserPage(users.page || "");
        setUserData(users.Items);
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
      <span>{item.label}</span>
    </a>
  ));

  return (
    <Navbar height={"100vh"} width={{ sm: 300 }} p="md">
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <MantineLogo size={28} />
          <Code sx={{ fontWeight: 700 }}>v3.1.2</Code>
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}