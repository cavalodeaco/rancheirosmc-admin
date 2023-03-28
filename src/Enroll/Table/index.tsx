import { forwardRef, useState } from 'react';
import { createStyles, Table, Checkbox, ScrollArea, Title, UnstyledButton, Select, Box } from '@mantine/core';
import { Admin, Enroll } from '../../FetchData';
import { IconArchive, IconBackspace, IconBrandHipchat, IconBrandWhatsapp, IconCertificate, IconCheckbox, IconCircleMinus, IconHourglassEmpty, IconMessageCircleOff } from '@tabler/icons';

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
  box: {
    border: '1px solid #eaeaea',
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
  setSearchBy: Function;
  setSelectedEnroll: Function;
  admin: Admin | undefined;
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: any;
  value: string;
  disabled: boolean;
}


const regex = /\d+/g;

export function EnrollTable({ enrollData, setSearchBy, setSelectedEnroll, admin }: EnrollTableProps) {
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState<Array<string>>([]);
  const [selectedSearch, setSelectedSearch] = useState<string>('todos');
  const toggleRow = (id: string) => {
    if (selection.includes(id)) {
      setSelection((current) => current.filter((item) => item !== id));
      setSelectedEnroll((current: Enroll[]) => current.filter((item) => item.id !== id));
    } else {
      setSelection((current) => [...current, id]);
      setSelectedEnroll((current: Enroll[]) => [...current, enrollData.find((item) => item.id === id)]);
    }
  }
  const toggleAll = () => {
    setSelection((current) => (current.length === enrollData.length ? [] : enrollData.map((item) => item.id)));
    setSelectedEnroll((current: Enroll[]) => (current.length === enrollData.length ? [] : enrollData));
  };

  const status:any = {
    "waiting": <IconHourglassEmpty />,
    "legacy_waiting": <IconArchive />,
    "called": <IconBrandHipchat color='#00abfb'/>,
    "confirmed": <IconCheckbox color='#ffec00'/>,
    "certified": <IconCertificate color='#7bc62d'/>,
    "dropped": <IconBackspace color='#ffbf00'/>,
    "missed": <IconCircleMinus color='#ff4500'/>,
    "ignored": <IconMessageCircleOff color='#ff9300'/>,
  }

  const rows = enrollData.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => toggleRow(item.id)}
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

        <td>{status[item?.enroll_status]}</td>
        <td>{item.city}</td>
        <td>{admin?.["custom:manager"] ? item.enroll_date : item.enroll_date.substring(0, 10)}</td>
        <td>{item.user.name}</td>
        <td>{`${item.user.driver_license}/${item.user.driver_license_UF}`}</td>
        <td align='center'>{item?.enroll_status==="called" 
            ? <a href={`https://web.whatsapp.com/send/?phone=55${item.user.phone.match(regex)?.join('')}&text&type=phone_number&app_absent=0`} target='_blank'>
                <IconBrandWhatsapp />
              </a> 
          : item.user.phone.match(regex)?.join('')}</td>
        {/* <td>{item.motorcycle_brand}</td> */}
        <td>{item.class == 'none' ? '' : item.class}</td>
        <td>{item.updated_by}</td>
        {/* <td>{item.updated_at.substring(0,9)}</td> */}
      </tr>
    );
  });

  function handleSearchBy (search:string) {
    if (selectedSearch === search) {
      setSearchBy('todos');
      setSelectedSearch('todos');
    } else {
      setSearchBy(search);
      setSelectedSearch(search);
    }
  }

  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ icon, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        {icon}
      </div>
    )
  );

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
            <th><Box className={selectedSearch === "enroll_status" ? classes.box : ''}><UnstyledButton onClick={() => handleSearchBy('enroll_status')}><Title size={15}>Status</Title></UnstyledButton></Box></th>
            {/* <th style={{ width: 80 }}>
            <Select
                  data={[
                      {
                          value: "call",
                          icon: <IconBrandHipchat color='#00abfb' />,
                          disabled: admin?.["custom:manager"] || admin?.["custom:caller"] ? false : true,
                      },
                      {
                          value: "confirmed",
                          label: "Confirmar para turma",
                          icon: <IconCheckbox color='#ffec00' />,
                          disabled: admin?.["custom:manager"] || admin?.["custom:caller"] ? false : true,
                      },
                      {
                          value: "certified",
                          label: "Indicar presença",
                          icon: <IconCertificate color='#7bc62d' />,
                          disabled: admin?.["custom:manager"] || admin?.["custom:posclass"] ? false : true,
                      },
                      {
                          value: "missed",
                          icon: <IconCircleMinus color='#ff4500' />,
                          disabled: admin?.["custom:manager"] || admin?.["custom:posclass"] ? false : true,
                      },
                      {
                          value: "dropout",
                          icon: <IconBackspace color='#ffbf00' />,
                          disabled: admin?.["custom:manager"] || admin?.["custom:caller"] ? false : true,
                      },
                      {
                          value: "ignored",
                          icon: <IconMessageCircleOff color='#ff9300' />,
                          disabled: admin?.["custom:manager"] || admin?.["custom:caller"] ? false : true,
                      },
                  ]}
                  // value={action}
                  // placeholder="Ações de inscrição"
                  // onChange={handleAction}
                  itemComponent={SelectItem}
                  size="sm"
              />
            </th> */}
            <th><Box className={selectedSearch === "city" ? classes.box : ''}><UnstyledButton onClick={() => handleSearchBy('city')}><Title size={15}>Cidade</Title></UnstyledButton></Box></th>
            <th><Box className={selectedSearch === "enroll_date" ? classes.box : ''}><UnstyledButton onClick={() => handleSearchBy('enroll_date')}><Title size={15}>Data da inscrição</Title></UnstyledButton></Box></th>
            <th><Box className={selectedSearch === "user.name" ? classes.box : ''}><UnstyledButton onClick={() => handleSearchBy('user.name')}><Title size={15}>Nome</Title></UnstyledButton></Box></th>
            <th><Box className={selectedSearch === "user.driver_license" ? classes.box : ''}><UnstyledButton onClick={() => handleSearchBy('user.driver_license')}><Title size={15}>CNH</Title></UnstyledButton></Box></th>
            <th><Title size={15}>Contato</Title></th>
            <th><Box className={selectedSearch === "class" ? classes.box : ''}><UnstyledButton onClick={() => handleSearchBy('class')}><Title size={15}>Turma</Title></UnstyledButton></Box></th>
            {/* <th><UnstyledButton onClick={() => handleSearchBy('motorcycle_brand')}><Title size={15}>Marca moto</Title></UnstyledButton></th> */}
            <th><Box className={selectedSearch === "updated_by" ? classes.box : ''}><UnstyledButton onClick={() => handleSearchBy('updated_by')}><Title size={15}>Atualizado por</Title></UnstyledButton></Box></th>
            {/* <th><UnstyledButton onClick={() => handleSearchBy('updated_at')}><Title size={15}>Data de atualização</Title></UnstyledButton></th> */}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}