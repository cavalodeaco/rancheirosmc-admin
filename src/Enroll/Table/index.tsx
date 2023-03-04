import { useState } from 'react';
import { createStyles, Table, Checkbox, ScrollArea, Title} from '@mantine/core';
import { Enroll } from '../../FetchData';

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

interface EnrollTableProps {
  enrollData: Enroll[];
}

export function EnrollTable({ enrollData }: EnrollTableProps) {
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState(['1']);
  const toggleRow = (enroll_date: string) =>
    setSelection((current) =>
      current.includes(enroll_date) ? current.filter((item) => item !== enroll_date) : [...current, enroll_date]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === enrollData.length ? [] : enrollData.map((item) => item.enroll_date)));

  const rows = enrollData.map((item) => {
    const selected = selection.includes(item.enroll_date);
    return (
      <tr key={item.enroll_date} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(item.enroll_date)}
            onChange={() => toggleRow(item.enroll_date)}
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
        <td>{item.city}</td>
        <td>{item.enroll_status}</td>
        <td>{item.enroll_date}</td>
        <td>{`${item.user.driver_license}/${item.user.driver_license_UF}`}</td>
        <td>{item.motorcycle_brand}</td>
        <td>{item.updated_by}</td>
        <td>{item.updated_at}</td>
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
                checked={selection.length === enrollData.length}
                indeterminate={selection.length > 0 && selection.length !== enrollData.length}
                transitionDuration={0}
              />
            </th>
            <th><Title size={15}>Cidade</Title></th>
            <th><Title size={15}>Status</Title></th>
            <th><Title size={15}>Data da inscrição</Title></th>
            <th><Title size={15}>Aluno (CNH)</Title></th>
            <th><Title size={15}>Marca moto</Title></th>
            <th><Title size={15}>Atualizado por</Title></th>
            <th><Title size={15}>Data de atualização</Title></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}