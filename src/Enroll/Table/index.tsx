import { useState } from 'react';
import { createStyles, Table, Checkbox, ScrollArea } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

interface EnrollTableProps {
  data: { city: string; status: string; createdAt: string; PK: string }[];
}

export function EnrollTable({ data }: EnrollTableProps) {
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState(['1']);
  const toggleRow = (PK: string) =>
    setSelection((current) =>
      current.includes(PK) ? current.filter((item) => item !== PK) : [...current, PK]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.PK)));

  const rows = data.map((item) => {
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
        <td>{item.city}</td>
        <td>{item.status}</td>
        <td>{item.createdAt}</td>
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
                checked={selection.length === data.length}
                indeterminate={selection.length > 0 && selection.length !== data.length}
                transitionDuration={0}
              />
            </th>
            <th>Cidade</th>
            <th>Status</th>
            <th>Data inscrição</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}