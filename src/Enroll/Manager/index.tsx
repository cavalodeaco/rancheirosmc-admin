import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Code,
  createStyles,
  Flex,
  Group,
  List,
  Modal,
  Text,
  Pagination,
  Paper,
  ScrollArea,
  Select,
  Slider,
  Stack,
  TextInput,
  ThemeIcon,
  Title,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArchive,
  IconBackspace,
  IconBrandHipchat,
  IconCertificate,
  IconCheckbox,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleMinus,
  IconHourglassEmpty,
  IconMessageCircleOff,
  IconSearch,
} from "@tabler/icons";
import { forwardRef, useEffect, useState } from "react";
import { Admin, Class, Enroll } from "../../FetchData";
import { EnrollTable } from "../Table";
import Tokens from "../../AuthenticationForm/Tokens";
import { useDisclosure, useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { QuestionMark } from "tabler-icons-react";
import { AlertType } from "../../Menu";
import { MessageStatus } from "../Status";

const useStyles = createStyles((theme) => ({
  stretch: {
    flexGrow: 1,
  },

  actions: {
    justifyContent: "space-between",
  },
}));

interface EnrollManagerProps {
  mainEnrollData: Enroll[];
  admin: Admin | undefined;
  classData: Class[];
}

const searchableFields = [
  "enroll_status",
  "city",
  "enroll_date",
  "user.name",
  "user.driver_license",
  "user.driver_license_UF",
  "user.phone",
  "class",
  "updated_by",
]; // "motorcycle_model", "motorcycle_use", "motorcycle_brand","updated_at",

function filterData(
  data: Enroll[],
  search: string,
  searchBy: string = "todos"
) {
  console.log("filterData", search);
  const queries = search.toLowerCase().split("+"); /// split by + and search for each
  return data.filter((item) => {
    if (queries.length === 0) {
      return true;
    }

    function search(field: string, query: string, n_item: any) {
      const [key, rest] = field.split(".");
      if (rest) {
        if (n_item[key][rest]?.toLowerCase().includes(query)) {
          return true;
        }
      } else if (n_item[key]?.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    }

    // loop over queries
    if (searchBy === "todos") {
      let resp = new Set();
      for (const field of searchableFields) {
        for (const query of queries) {
          const queryTrim = query.trim();
          if (search(field, queryTrim, item)) resp.add(query);
        }
      }
      return resp.size === queries.length;
    } else {
      let resp = 0;
      for (const query of queries) {
        const queryTrim = query.trim();
        if (search(searchBy, queryTrim, item)) {
          resp++;
        }
      }
      return resp === queries.length;
    }
  });
}

function sortData(data: Enroll[], sortby: string = "sort_date") {
  return data.sort((a, b) => {
    const n_a: any = a;
    const n_b: any = b;
    const [key, rest] = sortby.split(".");
    if (rest) {
      if (n_a[key][rest] < n_b[key][rest]) {
        return -1;
      }
      if (n_a[key][rest] > n_b[key][rest]) {
        return 1;
      }
      return 0;
    } else {
      if (n_a[key] < n_b[key]) {
        return -1;
      }
      if (n_a[key] > n_b[key]) {
        return 1;
      }
      return 0;
    }
  });
}

interface ActionList {
  [key: string]: Function;
}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: any;
  label: string;
  value: string;
  disabled: boolean;
}

export function EnrollManager({
  mainEnrollData,
  admin,
  classData,
}: EnrollManagerProps) {
  const [tokens, setTokens] = useLocalStorage<Tokens>({
    key: "tokens",
  });
  const { classes } = useStyles();
  const [tableEnrollData, setTableEnrollData] = useState<Enroll[]>([]);
  const [activeEnrollPage, setActiveEnrollPage] = useState(1);
  const [help, { open: open_help, close: close_help }] = useDisclosure(false);
  const [actionStatus, actionStatusHandler] = useDisclosure(false, {
    onOpen: () => console.log("Opened"),
    onClose: () => setAction(null),
  });
  const [messageStatus, setMessageStatus] = useState<MessageStatus[]>([]);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [selectedEnroll, setSelectedEnroll] = useState<Enroll[]>([]);
  const [limitPage, setLimitPage] = useState(10);
  const [searchBy, setSearchBy] = useState("todos");
  const [search, setSearch] = useState("");
  const [enrollData, setEnrollData] = useState<Enroll[]>([]);
  const [sortedData, setSortedData] = useState(enrollData);
  const [totalEnrollData, setTotalEnrollData] = useState(0);
  const [action, setAction] = useState<string | null>("actions");
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const actionList = {
    run_delete: async function (url: string, msg_error: string) {
      const data = {
        enrolls: selectedEnroll.map((item) => ({
          enroll_date: item.enroll_date,
          city: item.city,
          id: item.id,
        })),
      };
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // add tokens from localstorage
          access_token: `${tokens.access_token}`,
          id_token: `${tokens.id_token}`,
        },
        body: JSON.stringify(data),
      };
      try {
        if (process.env.ENV !== "production") {
          console.log("run_delete");
          console.log(data);
        }
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/manager/${url}` as string,
          config
        );
        const body = await response.json();

        // if (response.status == 200) {
        const update = async () => {
          setEnrollData(
            enrollData.filter((item) => {
              return item.id != body.id;
            })
          );
          setMessageStatus(body.message);
          setSelectedEnroll([]);
        };
        update(); // trick async
        // }
      } catch (error) {
        if (process.env.ENV !== "production") {
          console.log("Try error");
          console.log(error);
        }
        setAlert({ type: "error", title: msg_error } as AlertType);
      }
    },
    run: async function (url: string, msg_error: string) {
      const data = {
        class_name: selectedClass,
        enrolls: selectedEnroll.map((item) => ({
          enroll_date: item.enroll_date,
          city: item.city,
          id: item.id,
          name: item.user.name,
          driver_license: item.user.driver_license,
          driver_license_UF: item.user.driver_license_UF,
        })),
      };
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // add tokens from localstorage
          access_token: `${tokens.access_token}`,
          id_token: `${tokens.id_token}`,
        },
        body: JSON.stringify(data),
      };
      try {
        console.log(data);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/manager/${url}` as string,
          config
        );
        const messages: MessageStatus[] = await response.json();

        const update = async () => {
          setEnrollData(
            enrollData.map((item) => {
              for (const message of messages) {
                if (
                  item.city === message?.enroll?.city &&
                  item.enroll_date === message?.enroll?.enroll_date
                ) {
                  item.enroll_status = message?.enroll?.enroll_status;
                  item.updated_by = message?.enroll?.updated_by;
                  item.updated_at = message?.enroll?.updated_at;
                  item.class = message?.enroll?.class;
                  return item;
                }
              }
              return item;
            })
          );
          setMessageStatus(messages);
          setSelectedEnroll([]);
          setSelectedClass(null);
        };
        update(); // trick async
      } catch (error) {
        if (process.env.ENV !== "production") {
          console.log("Run");
          console.log(error);
        }
        setAlert({ type: "error", title: msg_error } as AlertType);
      }

      // TODO: create wame para com mensagens para o próprio usuário com os links de chats para cada aluno selecionado
      // setAction(null);
    },
    call: async function () {
      if (process.env.ENV !== "production") {
        console.log("call");
      }
      if (selectedClass) {
        actionList["run"]("call", "Erro ao realizar chamada!");
      } else {
        setAlert({
          type: "warning",
          title: "Selecione uma turma para realizar chamada!",
        } as AlertType);
      }
    },
    update_status: async function (url: string, msg_error: string) {
      const data = {
        enrolls: selectedEnroll.map((item) => ({
          enroll_date: item.enroll_date,
          city: item.city,
          id: item.id,
          name: item.user.name,
        })),
      };
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // add tokens from localstorage
          access_token: `${tokens.access_token}`,
          id_token: `${tokens.id_token}`,
        },
        body: JSON.stringify(data),
      };
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/manager/${url}` as string,
          config
        );
        const messages: MessageStatus[] = await response.json();
        console.log(messages);

        const update = async () => {
          setEnrollData(
            enrollData.map((item) => {
              for (const message of messages) {
                if (
                  item.city === message?.enroll?.city &&
                  item.enroll_date === message?.enroll?.enroll_date
                ) {
                  item.enroll_status = message?.enroll?.enroll_status;
                  item.updated_by = message?.enroll?.updated_by;
                  item.updated_at = message?.enroll?.updated_at;
                  return item;
                }
              }
              return item;
            })
          );
          setMessageStatus(messages);
        };
        update(); // trick async
      } catch (error) {
        setAlert({ type: "error", title: msg_error } as AlertType);
      }
      // setAction(null);
    },
    confirmed: async function () {
      if (process.env.ENV !== "production") {
        console.log("confirmed");
      }
      actionList["run"]("confirm", "Falha ao confirmar inscrição(ões)!");
    },
    certified: function () {
      if (process.env.ENV !== "production") {
        console.log("certified");
      }
      actionList["run"]("certify", "Falha ao certificar inscrição(ões)!");
    },
    missed: function () {
      if (process.env.ENV !== "production") {
        console.log("missed");
      }
      actionList["run"]("miss", "Falha ao aplicar falta(s)!");
    },
    dropout: function () {
      if (process.env.ENV !== "production") {
        console.log("dropout");
      }
      actionList["run"]("drop", "Falha ao aplicar desistência(s)!");
    },
    ignored: function () {
      if (process.env.ENV !== "production") {
        console.log("ignored");
      }
      actionList["run"]("ignore", "Falha ao aplicar status de ignorado!");
    },
    waiting: async function () {
      if (process.env.ENV !== "production") {
        console.log("waiting");
      }
      actionList["run"]("wait", "Falha ao aplicar volta para lista de espera!");
    },
    delete: async function () {
      if (process.env.ENV !== "production") {
        console.log("delete");
      }
      actionList["run_delete"]("delete", "Falha ao deletar usuário!");
    },
  } as ActionList;
  const marks = [
    { value: 25, label: "25%" },
    { value: 50, label: "50%" },
    { value: 75, label: "75%" },
  ];

  // function changeLimit(value: number) {
  //     console.log("Limit: ", value);
  //     // limit % of totalEnrollData
  //     setLimitPage(Math.ceil(value * 100 / totalEnrollData));
  //     handlePagination(1); // move to first page
  // }

  function handlePagination(page: number) {
    setActiveEnrollPage(page);
    setTableEnrollData(
      sortedData.slice((page - 1) * limitPage, page * limitPage)
    );
  }

  useEffect(() => {
    // console.log("mainEnrollData", mainEnrollData);
    setEnrollData(mainEnrollData);
  }, [mainEnrollData]);

  useEffect(() => {
    const f = async () => {
      handleSearch();
    };
    f();
  }, [enrollData]);

  function handleSearch() {
    console.log("handleSearch", search, searchBy);
    const sorted = filterData(enrollData, search, searchBy);
    setSortedData(sorted);
    setActiveEnrollPage(1);
    setTableEnrollData(sorted.slice(0, limitPage));
  }

  function handleSort(sortby: string) {
    console.log("handleSort", sortby);
    const sorted = sortData(sortedData, sortby);
    setSortedData(sorted);
    setTableEnrollData(
      sorted.slice(
        (activeEnrollPage - 1) * limitPage,
        activeEnrollPage * limitPage
      )
    );
  }

  async function handleAction(value: string) {
    console.log("handleAction", value);
    setMessageStatus([]); // clear message status
    if (value && selectedEnroll.length > 0) {
      setAlert(null);
      setAction(value);
      // show success and fails
      actionStatusHandler.open();
      await actionList[value]();
    } else {
      setAlert({
        type: "warning",
        title: "Selecione ao menos uma inscrição para executar uma ação!",
      } as AlertType);
    }
  }

  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ icon, label, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          {icon} {label}
        </Group>
      </div>
    )
  );

  return (
    <>
      <Transition
        mounted={actionStatus}
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => {
          return (
            <div style={styles}>
              <Modal
                opened={actionStatus}
                onClose={actionStatusHandler.close}
                fullScreen={isMobile}
                title={`Status de atualização: ${action}`}
              >
                <List center spacing="xs" size="sm">
                  {messageStatus.map((item) => {
                    return (
                      <List.Item
                        key={item.id}
                        icon={
                          item?.status === "fail" ? (
                            <ThemeIcon color="red" size={24} radius="xl">
                              <IconCircleMinus size="1rem" />
                            </ThemeIcon>
                          ) : (
                            <ThemeIcon color="teal" size={24} radius="xl">
                              <IconCircleCheck size="1rem" />
                            </ThemeIcon>
                          )
                        }
                      >
                        <Text fz="sm" fw={500}>
                          {item?.enroll?.user?.name}
                        </Text>
                        {item?.status === "fail" ? (
                          <Text fz="xs" c="dimmed">
                            {item?.message}
                          </Text>
                        ) : (
                          <></>
                        )}
                      </List.Item>
                    );
                  })}
                </List>
              </Modal>
            </div>
          );
        }}
      </Transition>
      <Transition
        mounted={help}
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => {
          return (
            <div style={styles}>
              <Modal
                opened={help}
                onClose={close_help}
                fullScreen={isMobile}
                title="Legenda de status"
              >
                <List center spacing="xs" size="sm">
                  <List.Item icon={<IconHourglassEmpty />}>
                    Em lista de espera (disponível para chamar para uma turma)
                    [waiting]
                  </List.Item>
                  <List.Item icon={<IconArchive />}>
                    Inscrição do Google Forms (disponível para chamar para uma
                    turma) [legacy_waiting]
                  </List.Item>
                  <List.Item icon={<IconBrandHipchat color="#00abfb" />}>
                    Convidado para uma turma (entrou em contato com o aluno para
                    uma turma específica) [called]
                  </List.Item>
                  <List.Item icon={<IconBackspace color="#ffbf00" />}>
                    Desistiu da vaga na turma (não poderá participar do curso de
                    forma justificada, informado anteriormente a data do curso)
                    [dropped]
                  </List.Item>
                  <List.Item icon={<IconCheckbox color="#ffec00" />}>
                    Confirmou convite para a turma [confirmed]
                  </List.Item>
                  <List.Item icon={<IconCertificate color="#7bc62d" />}>
                    Participou do curso (aluno recebeu certificado no curso)
                    [certified]
                  </List.Item>
                  <List.Item icon={<IconCircleMinus color="#ff4500" />}>
                    Faltou no curso (este aluno não participou e deve se
                    inscrever novamente se quiser realizar o curso em outra
                    turma) [missed]
                  </List.Item>
                  <List.Item icon={<IconMessageCircleOff color="#ff9300" />}>
                    Não deu resposta ao convite (este aluno deverá se inscrever
                    novamente se quiser realizar o curso em outra turma)
                    [ignored]
                  </List.Item>
                </List>
              </Modal>
            </div>
          );
        }}
      </Transition>
      <Flex direction={"column"} gap={"md"}>
        <TextInput
          placeholder={`Pesquisar`}
          icon={<IconSearch size="0.9rem" stroke={1.5} />}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          rightSection={
            <Badge color="gray" size="xs">
              {sortedData.length} de {enrollData.length}
            </Badge>
          }
          rightSectionWidth={"5rem"}
        />
        {/* <Paper shadow={"xs"} p="xs" withBorder>
                        {sortedData.length}/{enrollData.length}
                    </Paper> */}

        {/* <Slider
                            labelAlwaysOn
                            labelTransition="skew-down"
                            labelTransitionDuration={150}
                            labelTransitionTimingFunction="ease"
                            showLabelOnHover
                            defaultValue={10}
                            marks={marks}
                            onChange={changeLimit}
                            min={1}
                            max={100}
                        />                 */}
        <Flex gap={"xs"} align="center" className={classes.actions}>
          <Select
            placeholder="Turma"
            data={classData.map((item) => item.name)}
            clearable
            className={classes.stretch}
            onChange={setSelectedClass}
            value={selectedClass}
          />
          <Select
            data={[
              {
                value: "call",
                label: "Chamar para turma",
                icon: <IconBrandHipchat color="#00abfb" />,
                disabled:
                  admin?.["custom:manager"] || admin?.["custom:caller"]
                    ? false
                    : true,
              },
              {
                value: "confirmed",
                label: "Confirmar para turma",
                icon: <IconCheckbox color="#ffec00" />,
                disabled:
                  admin?.["custom:manager"] || admin?.["custom:caller"]
                    ? false
                    : true,
              },
              {
                value: "certified",
                label: "Indicar presença",
                icon: <IconCertificate color="#7bc62d" />,
                disabled:
                  admin?.["custom:manager"] || admin?.["custom:caller"]
                    ? false
                    : true,
              },
              {
                value: "missed",
                label: "Indicar falta",
                icon: <IconCircleMinus color="#ff4500" />,
                disabled:
                  admin?.["custom:manager"] || admin?.["custom:caller"]
                    ? false
                    : true,
              },
              {
                value: "dropout",
                label: "Indicar desistência",
                icon: <IconBackspace color="#ffbf00" />,
                disabled:
                  admin?.["custom:manager"] || admin?.["custom:caller"]
                    ? false
                    : true,
              },
              {
                value: "ignored",
                label: "Sem resposta",
                icon: <IconMessageCircleOff color="#ff9300" />,
                disabled:
                  admin?.["custom:manager"] || admin?.["custom:caller"]
                    ? false
                    : true,
              },
            ]}
            value={action}
            placeholder="Ações de inscrição"
            onChange={handleAction}
            itemComponent={SelectItem}
          />
          <ActionIcon
            size={"sm"}
            radius="xl"
            variant="outline"
            onClick={open_help}
          >
            <QuestionMark size="0.875rem" />
          </ActionIcon>
        </Flex>
        {alert?.type === "error" ? (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title={alert?.title}
            color="red.6"
            children={undefined}
            withCloseButton
            onClose={() => {
              setAlert(null);
            }}
          />
        ) : null}
        {alert?.type === "success" ? (
          <Alert
            icon={<IconCircleCheck size={16} />}
            title={alert?.title}
            color="teal.6"
            children={undefined}
            withCloseButton
            onClose={() => {
              setAlert(null);
            }}
          />
        ) : null}
        {alert?.type === "warning" ? (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title={alert?.title}
            color="IconCircleCheck.6"
            children={undefined}
            withCloseButton
            onClose={() => {
              setAlert(null);
            }}
          />
        ) : null}
        <EnrollTable
          enrollData={tableEnrollData}
          setSearchBy={setSearchBy}
          setSelectedEnroll={setSelectedEnroll}
          selectedEnroll={selectedEnroll}
          admin={admin}
          back2List={async () => actionList["waiting"]()}
          deleteUser={async () => actionList["delete"]()}
          setAlert={setAlert}
          handleSort={handleSort}
          classData={classData}
        />
        <Pagination
          page={activeEnrollPage}
          onChange={handlePagination}
          total={Math.ceil(sortedData?.length / limitPage)}
        />
      </Flex>
    </>
  );
}
