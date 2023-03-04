import { useState } from 'react';
import { createStyles, Table, Checkbox, ScrollArea, Title } from '@mantine/core';
import { User } from '../../FetchData';

const useStyles = createStyles((theme) => ({
    rowSelected: {
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
    },
}));

interface UserTableProps {
    userData: User[]
}

export function UserTable({ userData }: UserTableProps) {
    const { classes, cx } = useStyles();
    const [selection, setSelection] = useState(['1']);
    const toggleRow = (PK: string) =>
        setSelection((current) =>
            current.includes(PK) ? current.filter((item) => item !== PK) : [...current, PK]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === userData.length ? [] : userData.map((item) => item.PK)));

    const rows = userData.map((item) => {
        const selected = selection.includes(item.PK);
        return (
            <tr key={item.PK} className={cx({ [classes.rowSelected]: selected })}>
                <td>
                    <Checkbox
                        checked={selection.includes(item.PK)}
                        onChange={() => toggleRow(item.PK)}
                        transitionDuration={0}
                    />
                </td>
                {/* <td>
          <Group spacing="sm">
            <Avatar size={26} src={item.avatar} radius={26} />
            <Text size="sm" weight={500}>
              {item.name}
            </Text>
          </Group>
        </td> */}
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>{item.email}</td>
                <td>{item.driver_license}</td>
                <td>{item.driver_license_UF}</td>
                <td>{item.enroll.length}</td>
            </tr>
        );
    });

    return (
        <ScrollArea>
            <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                <thead>
                    <tr>
                        <th style={{ width: 40 }}>
                            <Checkbox
                                onChange={toggleAll}
                                checked={selection.length === userData.length}
                                indeterminate={selection.length > 0 && selection.length !== userData.length}
                                transitionDuration={0}
                            />
                        </th>
                        <th><Title size={15}>Nome</Title></th>
                        <th><Title size={15}>Telefone</Title></th>
                        <th><Title size={15}>E-mail</Title></th>
                        <th><Title size={15}>CNH</Title></th>
                        <th><Title size={15}>UF</Title></th>
                        <th><Title size={15}>Total de inscrições</Title></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
}