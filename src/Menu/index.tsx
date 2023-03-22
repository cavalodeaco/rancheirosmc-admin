import { useState } from "react";
import {
    Box,
    createStyles,
    Flex,
    Navbar,
    ScrollArea,
    Space,
    Title,
} from "@mantine/core";
import {
    IconHelmet,
    IconHome,
    IconLogout,
    IconMotorbike,
    IconUser,
} from "@tabler/icons";
import { UserCircle } from "tabler-icons-react";
import { Admin } from "../FetchData";

const useStyles = createStyles((theme, _params, getRef) => {
    const icon: string = getRef("icon");
    return {
        fullHeight: {
            height: "100vh",
        },

        container: {
            justifyContent: "space-between",
            minHeight: "calc(100vh - 60px)",
            paddingBottom: `calc(${theme.spacing.xl}px * 2 + 60px)`,
        },

        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
            }`,
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
            }`,
        },

        link: {
            ...theme.fn.focusStyles(),
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            fontSize: theme.fontSizes.sm,
            color:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[1]
                    : theme.colors.gray[7],
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,

            "&:hover": {
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[6]
                        : theme.colors.gray[0],
                color: theme.colorScheme === "dark" ? theme.white : theme.black,

                [`& .${icon}`]: {
                    color:
                        theme.colorScheme === "dark"
                            ? theme.white
                            : theme.black,
                },
            },
        },

        linkIcon: {
            ref: icon,
            color:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[2]
                    : theme.colors.gray[6],
            marginRight: theme.spacing.sm,
        },

        linkActive: {
            "&, &:hover": {
                backgroundColor: theme.fn.variant({
                    variant: "light",
                    color: theme.primaryColor,
                }).background,
                color: theme.fn.variant({
                    variant: "light",
                    color: theme.primaryColor,
                }).color,
                [`& .${icon}`]: {
                    color: theme.fn.variant({
                        variant: "light",
                        color: theme.primaryColor,
                    }).color,
                },
            },
        },
    };
});

interface MenuProps {
    setIsEnroll: Function | any;
    setIsUser: Function | any;
    setIsClass: Function | any;
    admin: Admin | undefined;
    opened: boolean;
    setOpened: Function;
    active: string;
    setActive: Function;
}

export function Menu({
    setIsEnroll,
    setIsUser,
    setIsClass,
    admin,
    opened,
    setOpened,
    active,
    setActive
}: MenuProps) {
    const { classes, cx } = useStyles();

    const data = [
        {
            link: "",
            label: "Métricas",
            icon: IconHome,
            action: () => {
                if (active !== "Métricas") {
                    // if not in the same page
                    setIsEnroll(false);
                    setIsUser(false);
                    setIsClass(false);
                }
            },
        },
        {
            link: "",
            label: "Inscrições",
            icon: IconMotorbike,
            action: async () => {
                if (active !== "Inscrições") {
                    // if not in the same page
                    setIsEnroll(true);
                    setIsUser(false);
                    setIsClass(false);
                }
            },
        },
        // {
        //     link: "",
        //     label: "Alunos",
        //     icon: IconUser,
        //     action: async () => {
        //         if (active !== "Alunos") {
        //             // if not in the same page
        //             setIsEnroll(false);
        //             setIsUser(true);
        //             setIsClass(false);
        //         }
        //     },
        // },
        {
            link: "",
            label: "Turmas",
            icon: IconHelmet,
            action: async () => {
                if (active !== "Turmas") {
                    // if not in the same page
                    setIsEnroll(false);
                    setIsUser(false);
                    setIsClass(true);
                }
            },
        },
    ];

    const links = data.map((item) => (
        <a
            className={cx(classes.link, {
                [classes.linkActive]: item.label === active,
            })}
            href={item.link}
            key={item.label}
            onClick={async (event) => {
                event.preventDefault();
                await item.action();
                setActive(item.label);
                setOpened(false);
            }}
        >
            <item.icon />
            <Space w="xs" />
            <Title size={18}>{item.label}</Title>
        </a>
    ));

    return (
        <Navbar
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 300, lg: 300 }}
            p="md"
        >
            <ScrollArea className={classes.fullHeight}>
                <Flex direction="column" className={classes.container}>
                    <Navbar.Section>{links}</Navbar.Section>
                    <Navbar.Section className={classes.footer}>
                        <Box className={classes.link}>
                            <UserCircle />
                            <Space w="xs" />
                            <Title size={12}>{admin?.name || "--"}</Title>
                        </Box>
                        <a
                            href="/"
                            className={classes.link}
                            onClick={() => {
                                localStorage.clear();
                                // window.location.href = "/";
                            }}
                        >
                            <IconLogout />
                            <Space w="xs" />
                            <Title size={18}>Logout</Title>
                        </a>
                    </Navbar.Section>
                </Flex>
            </ScrollArea>
        </Navbar>
    );
}
