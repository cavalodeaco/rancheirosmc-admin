import { useState } from 'react';
import { createStyles, Table, Checkbox, ScrollArea, Title, UnstyledButton } from '@mantine/core';
import { Enroll } from '../../FetchData';
import { IconBrandHipchat, IconBrandWhatsapp, IconHourglassEmpty } from '@tabler/icons';

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
  setSearchBy: Function
}

const regex = /\d+/g;

export function EnrollTable({ enrollData, setSearchBy }: EnrollTableProps) {
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
        <td align='center'>{item.enroll_status === "waiting" ? <IconHourglassEmpty /> : ((item.enroll_status === "called") ? <IconBrandHipchat /> : item.enroll_status)}</td>
        <td>{item.enroll_date.substring(0,9)}</td>
        <td>{item.user.name}</td>
        <td>{`${item.user.driver_license}/${item.user.driver_license_UF}`}</td>
        <td>{item.user.phone.match(regex)?.join('')}</td>
        {/* <td>
          <a href={`https://web.whatsapp.com/send/?phone=55${item.user.phone.match(regex)?.join('')}&text&type=phone_number&app_absent=0`} target='_blank'>
            <IconBrandWhatsapp />
          </a>
        </td> */}
        <td>{item.motorcycle_brand}</td>
        <td>{item.updated_by}</td>
        <td>{item.updated_at.substring(0,9)}</td>
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
            <th><UnstyledButton onClick={() => setSearchBy('city')}><Title size={15}>Cidade</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('enroll_status')}><Title size={15}>Status</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('enroll_date')}><Title size={15}>Data da inscrição</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('user.name')}><Title size={15}>Nome</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('user.driver_license')}><Title size={15}>CNH</Title></UnstyledButton></th>
            <th><Title size={15}>Contato</Title></th>
            <th><UnstyledButton onClick={() => setSearchBy('motorcycle_brand')}><Title size={15}>Marca moto</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('updated_by')}><Title size={15}>Atualizado por</Title></UnstyledButton></th>
            <th><UnstyledButton onClick={() => setSearchBy('updated_at')}><Title size={15}>Data de atualização</Title></UnstyledButton></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}