import { useState } from 'react';
import { createStyles, Table, Checkbox, ScrollArea, Title, UnstyledButton, Menu, Group, ActionIcon } from '@mantine/core';
import { Admin, Class } from '../../FetchData';
import { IconCircleCheck, IconCircleMinus, IconDisabled, IconDisabled2, IconDisabledOff, IconDots, IconDownload, IconMap2 } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
  th: {
    padding: '0 !important',
  },
  // icon: {
  //   width: rem(21),
  //   height: rem(21),
  //   borderRadius: rem(21),
  // },
  control: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}));

interface ClassTableProps {
  classData: Class[];
  setSearchBy: Function;
  admin: Admin | undefined;
}

export function ClassTable({ classData, setSearchBy, admin }: ClassTableProps) {
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState(['1']);
  const toggleRow = (name: string) =>
    setSelection((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === classData.length ? [] : classData.map((item) => item.name)));

  const rows = classData.map((item) => {
    const selected = selection.includes(item.name);
    return (
      <tr key={item.name} className={cx({ [classes.rowSelected]: selected })}>
        {/* <td>
          <Checkbox
            checked={selection.includes(item.name)}
            onChange={() => toggleRow(item.name)}
            transitionDuration={0}
          />
        </td>         */}
        <td>{item.active === "true" ? <IconCircleCheck/> : <IconCircleMinus />}</td>
        <td>{item.name}</td>
        <td>{item.city}</td>
        <td>{item.date.substring(0,10)}</td>
        <td><a href={item.location} target='_blank' rel='noreferrer'><IconMap2/></a></td>
        <td>{item.updated_by}</td>
        <td>{item.updated_at.substring(0,10)}</td>
        {admin?.["custom:manager"] || admin?.["custom:download"] ? <td>
        <Group spacing={0} position="right">
          <Menu
            // transitionProps={{ transition: 'pop' }}
            withArrow
            position="bottom-end"
            withinPortal
          >
            <Menu.Target>
              <ActionIcon>
                <IconDots size="1rem" stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconDownload size="1rem" stroke={1.5} />}>Lista de presença</Menu.Item>
              <Menu.Item icon={<IconCircleMinus size="1rem" stroke={1.5} />}>Desativar turma</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          </Group>
        </td>
        : null}
      </tr>
    );
  });

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
        <thead>
          <tr>
            {/* <th style={{ width: 40 }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === classData.length}
                indeterminate={selection.length > 0 && selection.length !== classData.length}
                transitionDuration={0}
              />
            </th> */}
            <th><UnstyledButton onClick={() => setSearchBy('active')}><Title size={15}>Ativa</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('name')}><Title size={15}>Nome</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('city')}><Title size={15}>Cidade</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('date')}><Title size={15}>Data</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('location')}><Title size={15}>Localização</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('updated_by')}><Title size={15}>Atualizado por</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('updated_at')}><Title size={15}>Data de atualização</Title></UnstyledButton></th>
            {admin?.["custom:manager"] || admin?.["custom:download"] ? <th></th> : null}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}