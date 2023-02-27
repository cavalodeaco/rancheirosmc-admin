import { useState } from 'react';
import { createStyles, Navbar, Group, Code } from '@mantine/core';
import {
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

const data = [
  {
    link: '', label: 'Inscrições', icon: IconMotorbike, action: async () => {
      return await fetch( `${process.env.REACT_APP_BACKEND_ADDRESS}/report/enroll`)
                    .then((response) => response.json())
                    .then((data) => data.message.Items);;
    }
  },
  { link: '', label: 'Alunos', icon: IconUser, action: () => console.log('Alunos') },
];

interface MenuProps {
  setData: Function | any;
}

export function Menu({setData}: MenuProps) {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      href={item.link}
      key={item.label}
      onClick={async (event) => {
        event.preventDefault();
        setActive(item.label);
        const data = await item.action();
        setData(data);
      }}
    >
      <item.icon />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <Navbar height={700} width={{ sm: 300 }} p="md">
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