import { useState } from 'react';
import { createStyles, Table, ScrollArea, Title, UnstyledButton, Menu, Group, ActionIcon } from '@mantine/core';
import { Admin, Class } from '../../FetchData';
import { IconCircleCheck, IconCircleMinus, IconDots, IconDownload, IconMap2 } from '@tabler/icons';
import { useLocalStorage } from '@mantine/hooks';
import Tokens from '../../AuthenticationForm/Tokens';
import { AlertType } from '../../Menu';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

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
  setAlert: Function;
}

interface ClassList {
  terms: {
    authorization: boolean;
    responsibility: boolean;
    lgpd: boolean;
  };
  user: {
    driver_license: string;
    driver_license_UF: string;
    name: string;
  };
  enroll_status: string;
}

export function ClassTable({ classData, setSearchBy, admin, setAlert }: ClassTableProps) {
  const [tokens, setTokens] = useLocalStorage<Tokens>({
    key: "tokens",
  });
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState(['1']);
  const toggleRow = (name: string) =>
    setSelection((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === classData.length ? [] : classData.map((item) => item.name)));

  function downloadXLSX(xlsx:any, filename:string) {
    const blob = new Blob([xlsx], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function s2ab(s:any) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i += 1) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  function generateXlsx (class_name:string, data:ClassList[]) {
    // Map data to spreadsheet rows
    const rows = data.map(item => ({
      "Status": item.enroll_status,
      "Nome": item.user.name,
      "CNH (UF)": `${item.user.driver_license} (${item.user.driver_license_UF})`,
      "Imagem": item.terms.authorization ? "Sim" : "Não"
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `${class_name}.xlsx`);
  }

  async function download(name: string) {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // add tokens from localstorage
        access_token: `${tokens.access_token}`,
        id_token: `${tokens.id_token}`,
        filter: `${name}`,
      },
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/class/download` as string,
        config
      );
      const { message } = await response.json();
      if (response.status === 200) {
        setAlert({
          type: "success",
          title: "Arquivo disponível para download!",
        } as AlertType);
        try {
          console.log(message.Items)
          generateXlsx(name, message.Items);
        } catch (error) {
          console.log(error);
      }
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Falha ao baixar arquivo!",
      } as AlertType);
    }
  }

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
              <Menu.Item disabled={!(admin?.["custom:manager"] || admin?.["custom:download"])} icon={<IconDownload size="1rem" stroke={1.5} />} onClick={() => {download(item.name)}}>Lista de alunos</Menu.Item>
              {/* <Menu.Item disabled={!(admin?.["custom:manager"] || admin?.["custom:manage_class"])} icon={<IconCircleMinus size="1rem" stroke={1.5} />}>Desativar turma</Menu.Item> */}
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