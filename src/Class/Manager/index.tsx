import {
  Alert,
  Badge,
  Button,
  createStyles,
  Flex,
  Modal,
  Pagination,
  Stack,
  TextInput,
  Transition,
} from "@mantine/core";
import { useDisclosure, useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { IconAlertCircle, IconCircleCheck, IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { Admin, Class } from "../../FetchData";
import { CreateForm } from "../CreateForm";
import { ClassTable } from "../Table";
import { AlertType } from "../../Menu";
import Tokens from "../../AuthenticationForm/Tokens";

interface ClassManagerProps {
  classData: Class[];
  admin: Admin | undefined;
}

const searchableFields = [
  "city",
  "name",
  "location",
  "date",
  "updated_by",
  "created_at",
  "updated_at",
];

const useStyles = createStyles((theme) => ({
  stretch: {
    flexGrow: 1,
  },

  actions: {
    justifyContent: "space-between",
  },
}));

function filterData(data: Class[], search: string, searchBy: string = "todos") {
  console.log("filterData", search);
  const query = search.toLowerCase().trim();
  return data.filter((item) => {
    if (query === "") {
      return true;
    }
    const n_item = item as any;
    function search(field: string) {
      const [key, rest] = field.split(".");
      if (rest) {
        console.log(
          "rest",
          rest,
          n_item[key][rest].toLowerCase().includes(query)
        );
        if (n_item[key][rest].toLowerCase().includes(query)) {
          return true;
        }
      } else if (n_item[key].toLowerCase().includes(query)) {
        return true;
      }
      return false;
    }
    if (searchBy === "todos") {
      for (const field of searchableFields) {
        if (search(field)) return true;
      }
      return false;
    } else {
      search(searchBy);
    }
  });
}

function sortData(
  data: Class[],
  payload: { search: string; searchBy: string }
) {
  return filterData(data, payload.search, payload.searchBy);
}

export function ClassManager({ classData, admin }: ClassManagerProps) {
  const [tokens, setTokens] = useLocalStorage<Tokens>({
    key: "tokens",
  });
  const { classes } = useStyles();
  const [tableClassData, setTableClassData] = useState<Class[]>([]);
  const [activeClassPage, setActiveClassPage] = useState(1);
  const [limitPage, setLimitPage] = useState(10);
  const [searchBy, setSearchBy] = useState("todos");
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(classData);
  const [totalClassData, setTotalClassData] = useState(0);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const marks = [
    { value: 25, label: "25%" },
    { value: 50, label: "50%" },
    { value: 75, label: "75%" },
  ];
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");

  function changeLimit(value: number) {
    console.log("Limit: ", value);
    // limit % of totalClassData
    setLimitPage(Math.ceil((value * 100) / totalClassData));
    handlePagination(1); // move to first page
  }

  function handlePagination(page: number) {
    setActiveClassPage(page);
    setTableClassData(
      sortedData.slice((page - 1) * limitPage, page * limitPage)
    );
  }

  // useEffect(() => {
  //   console.log("Admin", admin);
  // }, [admin]);

  useEffect(() => {
    setSortedData(classData);
    setTableClassData(
      classData.slice(
        (activeClassPage - 1) * limitPage,
        activeClassPage * limitPage
      )
    );
    setTotalClassData(classData.length);
  }, [classData]);

  function handleSearch() {
    console.log("handleButtonSearch", search, searchBy);
    const sorted = sortData(classData, { search: search, searchBy: searchBy });
    console.log("sorted", sorted.length);
    setSortedData(sorted);
    setActiveClassPage(1);
    setTableClassData(sorted.slice(0, limitPage));
  }

  return (
    <>
      <Transition
        mounted={opened}
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
          {(styles) => (
            <div style={styles}>
              <Modal opened={opened} onClose={close} fullScreen={isMobile}>
                <CreateForm />                
              </Modal>
            </div>
          )}
      </Transition>

      <Stack>
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
                {sortedData.length} de {classData.length}
              </Badge>
            }
            rightSectionWidth={"5rem"}
          />
          <Flex gap={"xs"} align="center" className={classes.actions}>
            <Button
              onClick={open}
              disabled={
                admin?.["custom:manager"] || admin?.["custom:manage_class"]
                  ? false
                  : true
              }
            >
              Criar turma
            </Button>
          </Flex>
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
        <ClassTable
          classData={tableClassData}
          setSearchBy={setSearchBy}
          admin={admin}
          setAlert={setAlert}
        />
        <Pagination
          page={activeClassPage}
          onChange={handlePagination}
          total={Math.ceil(sortedData?.length / limitPage)}
        />
      </Stack>
    </>
  );
}
