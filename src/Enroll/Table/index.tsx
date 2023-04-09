import { forwardRef, useState } from "react";
import {
  createStyles,
  Table,
  Checkbox,
  ScrollArea,
  Title,
  UnstyledButton,
  Select,
  Box,
  Menu,
  Group,
  ActionIcon,
} from "@mantine/core";
import { Admin, Class, Enroll } from "../../FetchData";
import {
  IconArchive,
  IconBackspace,
  IconBrandHipchat,
  IconBrandWhatsapp,
  IconCertificate,
  IconCheckbox,
  IconCircleMinus,
  IconDots,
  IconHourglassEmpty,
  IconMessageCircleOff,
} from "@tabler/icons";
import { AlertType } from "../../Menu";
import { string } from "zod";

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
  th: {
    padding: "0 !important",
  },
  box: {
    border: "1px solid #eaeaea",
  },
  // icon: {
  //   width: rem(21),
  //   height: rem(21),
  //   borderRadius: rem(21),
  // },
  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}));

interface EnrollTableProps {
  enrollData: Enroll[];
  setSearchBy: Function;
  setSelectedEnroll: Function;
  admin: Admin | undefined;
  back2List: Function;
  setAlert: Function;
  handleSort: Function;
  classData: Class[];
}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: any;
  value: string;
  disabled: boolean;
}

const regex = /\d+/g;

export function EnrollTable({
  enrollData,
  setSearchBy,
  setSelectedEnroll,
  admin,
  back2List,
  setAlert,
  handleSort,
  classData,
}: EnrollTableProps) {
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState<Array<string>>([]);
  const [selectedSearch, setSelectedSearch] = useState<string>("todos");
  const toggleRow = (id: string) => {
    if (selection.includes(id)) {
      setSelection((current) => current.filter((item) => item !== id));
      setSelectedEnroll((current: Enroll[]) =>
        current.filter((item) => item.id !== id)
      );
    } else {
      setSelection((current) => [...current, id]);
      setSelectedEnroll((current: Enroll[]) => [
        ...current,
        enrollData.find((item) => item.id === id),
      ]);
    }
  };
  const toggleAll = () => {
    setSelection((current) =>
      current.length === enrollData.length
        ? []
        : enrollData.map((item) => item.id)
    );
    setSelectedEnroll((current: Enroll[]) =>
      current.length === enrollData.length ? [] : enrollData
    );
  };

  async function back2WaitingList(item_id: string) {
    console.log(item_id);
    if (selection.length > 1) {
      console.log("Selecione somente uma inscrição");
      setAlert({
        type: "error",
        title: "Selecione somente uma inscrição",
      } as AlertType);
      return undefined;
    }
    if (!selection.includes(item_id)) {
      console.log(
        "Selecione a inscrição que deseja voltar para a lista de espera"
      );
      setAlert({
        type: "warning",
        title: "Selecione a inscrição que deseja voltar para a lista de espera",
      } as AlertType);
      return undefined;
    }
    back2List();
  }

  const status: any = {
    waiting: <IconHourglassEmpty />,
    legacy_waiting: <IconArchive />,
    called: <IconBrandHipchat color="#00abfb" />,
    confirmed: <IconCheckbox color="#ffec00" />,
    certified: <IconCertificate color="#7bc62d" />,
    dropped: <IconBackspace color="#ffbf00" />,
    missed: <IconCircleMinus color="#ff4500" />,
    ignored: <IconMessageCircleOff color="#ff9300" />,
  };

  const rows = enrollData.map((item) => {
    const selected = selection.includes(item.id);
    const _class = classData.find(
      (item_class) => item_class.name === item.class
    );
    item.text_link = `https://wa.me/5541997399217?text=Olá%20${item.user.name.split("%20")[0]},\%0AAqui%20é%20${
      admin?.name.split("%20")[0]
    }%20-%20Lord%20Riders%20Moto%20Clube,%20tudo%20certo?\%0Ahttps://www.lordriders.com\%0A\%0AEstou%20entrando%20em%20contato%20para%20confirmar%20sua%20presença%20em%20nosso%20treinamento%20do%20curso%20Pilotando%20para%20Vida%20(https://ppv.lordriders.com).\%0A\%0AO%20curso%20ocorrerá%20na%20região%20de%20${
      _class?.city
    }%20no%20dia%20${_class?.date}%20no%20seguinte%20local%20${
      _class?.location
    }.&type=phone_number&app_absent=0`;
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
        <td>{admin?.["custom:manager"] ? item.enroll_date : item.sort_date}</td>
        <td>{item.user.name}</td>
        <td>{`${item.user.driver_license}/${item.user.driver_license_UF}`}</td>
        <td align="center">
          {item?.enroll_status === "called" ? (
            <a href={item.text_link} target="_blank" rel="noreferrer">
              <IconBrandWhatsapp />
            </a>
          ) : (
            item.user.phone.match(regex)?.join("")
          )}
        </td>
        {/* <td>{item.motorcycle_brand}</td> */}
        <td>{item.class == "none" ? "" : item.class}</td>
        <td>{item.terms.authorization == true ? "Sim" : "Não"}</td>
        <td>{item.updated_by}</td>
        {/* <td>{item.updated_at.substring(0,9)}</td> */}
        <td>
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
                <Menu.Item
                  disabled={
                    !(admin?.["custom:manager"] || admin?.["custom:caller"])
                  }
                  icon={<IconHourglassEmpty size="1rem" stroke={1.5} />}
                  onClick={() => {
                    back2WaitingList(item.id);
                  }}
                >
                  Voltar para lista de espera
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </td>
      </tr>
    );
  });

  function handleSearchBy(search: string) {
    if (selectedSearch === search) {
      setSearchBy("todos");
      setSelectedSearch("todos");
    } else {
      setSearchBy(search);
      setSelectedSearch(search);
      handleSort(search);
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
                indeterminate={
                  selection.length > 0 && selection.length !== enrollData.length
                }
                transitionDuration={0}
              />
            </th>
            <th>
              <Box
                className={
                  selectedSearch === "enroll_status" ? classes.box : ""
                }
              >
                <UnstyledButton onClick={() => handleSearchBy("enroll_status")}>
                  <Title size={15}>Status</Title>
                </UnstyledButton>
              </Box>
            </th>
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
            <th>
              <Box className={selectedSearch === "city" ? classes.box : ""}>
                <UnstyledButton onClick={() => handleSearchBy("city")}>
                  <Title size={15}>Cidade</Title>
                </UnstyledButton>
              </Box>
            </th>
            <th>
              <Box
                className={selectedSearch === "sort_date" ? classes.box : ""}
              >
                <UnstyledButton onClick={() => handleSearchBy("sort_date")}>
                  <Title size={15}>Data da inscrição</Title>
                </UnstyledButton>
              </Box>
            </th>
            <th>
              <Box
                className={selectedSearch === "user.name" ? classes.box : ""}
              >
                <UnstyledButton onClick={() => handleSearchBy("user.name")}>
                  <Title size={15}>Nome</Title>
                </UnstyledButton>
              </Box>
            </th>
            <th>
              <Box
                className={
                  selectedSearch === "user.driver_license" ? classes.box : ""
                }
              >
                <UnstyledButton
                  onClick={() => handleSearchBy("user.driver_license")}
                >
                  <Title size={15}>CNH</Title>
                </UnstyledButton>
              </Box>
            </th>
            <th>
              <Title size={15}>Contato</Title>
            </th>
            <th>
              <Box className={selectedSearch === "class" ? classes.box : ""}>
                <UnstyledButton onClick={() => handleSearchBy("class")}>
                  <Title size={15}>Turma</Title>
                </UnstyledButton>
              </Box>
            </th>
            <th>
              <Box>
                <Title size={15}>Imagem</Title>
              </Box>
            </th>
            {/* <th><UnstyledButton onClick={() => handleSearchBy('motorcycle_brand')}><Title size={15}>Marca moto</Title></UnstyledButton></th> */}
            <th>
              <Box
                className={selectedSearch === "updated_by" ? classes.box : ""}
              >
                <UnstyledButton onClick={() => handleSearchBy("updated_by")}>
                  <Title size={15}>Atualizado por</Title>
                </UnstyledButton>
              </Box>
            </th>
            {/* <th><UnstyledButton onClick={() => handleSearchBy('updated_at')}><Title size={15}>Data de atualização</Title></UnstyledButton></th> */}
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
