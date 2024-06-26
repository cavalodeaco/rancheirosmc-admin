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
  Transition,
  Modal,
  Button,
  Anchor,
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
  IconSkull,
} from "@tabler/icons";
import { AlertType } from "../../Menu";
import { string } from "zod";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

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
  selectedEnroll: Enroll[];
  admin: Admin | undefined;
  back2List: Function;
  deleteUser: Function;
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
  selectedEnroll,
  admin,
  back2List,
  deleteUser,
  setAlert,
  handleSort,
  classData,
}: EnrollTableProps) {
  const [itemDelete, setItemDelete] = useState<string>("");
  const [deleteModal, { open: open_delete, close: close_delete }] =
    useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const { classes, cx } = useStyles();
  const [selectedSearch, setSelectedSearch] = useState<string>("todos");
  const toggleRow = (id: string) => {
    if (selectedEnroll.find((item) => item.id === id)) {
      setSelectedEnroll((current: Enroll[]) =>
        current.filter((item) => item.id !== id)
      );
    } else {
      setSelectedEnroll((current: Enroll[]) => [
        ...current,
        enrollData.find((item) => item.id === id),
      ]);
    }
  };
  const toggleAll = () => {
    setSelectedEnroll((current: Enroll[]) =>
      current.length === enrollData.length ? [] : enrollData
    );
  };

  async function back2WaitingList(item_id: string) {
    console.log(item_id);
    if (selectedEnroll.length > 1) {
      console.log("Selecione somente uma inscrição");
      setAlert({
        type: "error",
        title: "Selecione somente uma inscrição",
      } as AlertType);
      return undefined;
    }
    if (!selectedEnroll.find((item) => item.id === item_id)) {
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
    setSelectedEnroll([]);
  }

  async function deleteEnroll(item_id: string) {
    if (selectedEnroll.length > 1) {
      console.log("Selecione somente uma inscrição");
      setAlert({
        type: "error",
        title: "Selecione somente uma inscrição",
      } as AlertType);
      return undefined;
    }
    if (!selectedEnroll.find((item) => item.id === item_id)) {
      console.log("Selecione a inscrição que deseja deletar");
      setAlert({
        type: "warning",
        title: "Selecione a inscrição que deseja deletar",
      } as AlertType);
      return undefined;
    }
    deleteUser();
    setSelectedEnroll([]);
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
    const selected = selectedEnroll.some(
      (selectedEnrollItem) => selectedEnrollItem.id === item.id
    );
    const _class = classData.find(
      (item_class) => item_class.name === item.class
    );

    item.text_link = `?text=Olá%20${item?.user?.name ? item?.user?.name.split(" ")[0] : ""
      },\%0AAqui%20é%20${admin?.name.split(" ")[0]
      }%20-%20Rancheiros%20Moto%20Clube,%20tudo%20certo?\%0Ahttps://www.rancheirosmc.com.br\%0A\%0AEstou%20entrando%20em%20contato%20para%20confirmar%20sua%20presença%20em%20nosso%20treinamento%20do%20curso%20Manobras%20para%20Vida%20.\%0A\%0AO%20curso%20ocorrerá%20na%20região%20de%20${_class?.city
      }%20no%20dia%20${_class?.date}%20no%20seguinte%20local%20${_class?.location
      }\%0A\%0AGostaria%20de%20reafirmar%20a%20nossa%20alegria%20em%20tê-lo(a)%20conosco%20e%20lembra-lo(a)%20de%20algumas%20recomendações%20importantes:\%0A\%0A1.%20O%20treinamento%20inicia%20pontualmente%20as%208h.\%0A\%0A2.%20Para%20a%20realização%20do%20treinamento%20é%20necessário%20que%20venha%20com%20a%20sua%20motocicleta%20(não%20fornecemos%20motos)\%0A\%0A3.%20Você%20deverá%20vir%20devidamente%20equipado,%20com%20capacete,%20calça%20comprida%20e%20calçado%20fechado%20(por%20segurança%20esses%20são%20os%20requisitos%20mínimos,%20sendo%20vedada%20a%20participação%20caso%20não%20sejam%20cumpridos)\%0A\%0A4.%20Somente%20será%20certificado%20o%20aluno(a)%20que%20permanecer%20até%20o%20final%20do%20treinamento.\%0A\%0AQualquer%20dúvida%20estamos%20a%20disposição%20para%20esclarecimentos.\%0A\%0ADeus%20abençoe%20grandemente.&type=phone_number&app_absent=0`;
    return (
      <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selected}
            onChange={() => toggleRow(item.id)}
            transitionDuration={0}
          />
        </td>
        <td>{status[item?.enroll_status]}</td>
        <td>{item.city}</td>
        <td>{admin?.["custom:manager"] ? item.enroll_date : item.sort_date}</td>
        <td>{item.user.name}</td>
        <td>{`${item.user.driver_license}/${item.user.driver_license_UF}`}</td>
        <td align="center">
          {item?.user?.phone && (
            <Anchor
              href={
                (/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(
                  navigator.userAgent
                )
                  ? "whatsapp://wa.me/55"
                  : "https://wa.me/55") +
                item?.user?.phone.match(regex)?.join("") +
                (item?.enroll_status === "called" ? item.text_link : "")
              }
              target="_blank"
              rel="noreferrer"
            >
              {(item?.user?.phone).replace(
                /^(\d{2})(\d{5})(\d{4}).*/,
                "($1) $2-$3"
              )}
            </Anchor>
          )}
        </td>
        <td>{item.class == "none" ? "" : item.class}</td>
        <td>{item.terms.authorization == true ? "Sim" : "Não"}</td>
        <td>{item.updated_by}</td>
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
                <Menu.Item
                  disabled={!admin?.["custom:manager"]}
                  icon={<IconSkull size="1rem" stroke={1.5} />}
                  onClick={() => {
                    // console.log(item.id);
                    setItemDelete(item.id);
                    open_delete();
                  }}
                >
                  Deletar
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
    <>
      <Transition
        mounted={deleteModal}
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => {
          return (
            <div style={styles}>
              <Modal
                opened={deleteModal}
                onClose={close_delete}
                fullScreen={isMobile}
                title="Deseja apagar inscrição?"
              >
                <Button
                  onClick={() => {
                    // console.log(itemDelete);
                    close_delete();
                    deleteEnroll(itemDelete);
                  }}
                >
                  Apagar inscrição
                </Button>
              </Modal>
            </div>
          );
        }}
      </Transition>
      <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={selectedEnroll.length === enrollData.length}
                  indeterminate={
                    selectedEnroll.length > 0 &&
                    selectedEnroll.length !== enrollData.length
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
                  <UnstyledButton
                    onClick={() => handleSearchBy("enroll_status")}
                  >
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
                          disabled: admin?.["custom:manager"] || admin?.["custom:caller"] ? false : true,
                      },
                      {
                          value: "missed",
                          icon: <IconCircleMinus color='#ff4500' />,
                          disabled: admin?.["custom:manager"] || admin?.["custom:caller"] ? false : true,
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
    </>
  );
}
