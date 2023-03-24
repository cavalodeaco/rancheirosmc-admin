import { Alert, Button, Group, UnstyledButton } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons";
import { useState } from "react";
import { z } from "zod";
import Tokens from "../../AuthenticationForm/Tokens";
import Create from "../Create";

const pageSchema = z.object({
  class: z.object({
    // validate location using regex to identify the pattern https://goo.gl/maps/XXXXXX
    location: z.string().refine((value) => {
      const regex = new RegExp(
        "^(https:\\/\\/goo\\.gl\\/maps\\/)"
      );
      return regex.test(value);
    }, { message: "Localização inválida, utilizar https://goo.gl/maps/XXXXXX" }),
    // validate date using regex to identify the pattern DD/MM/AAAA
    date: z.string().refine((value) => {
      const regex = new RegExp(
        "^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[012])\\/([0-9]{4})$"
      );
      return regex.test(value);
    }, { message: "Data inválida, utilizar DD/MM/AAAA" }),
    city: z.enum(["curitiba", "maringa", "londrina", "cambira"]),
  }),
});

export function CreateForm() {
  const [tokens, setTokens] = useLocalStorage<Tokens>({
    key: "tokens",
  });
  const [alert, setAlert] = useState(false);
  const [result, setResult] = useState(0);

  const page = useForm({
    validate: zodResolver(pageSchema),
    initialValues: {
      class: {
        city: "curitiba",
        location: "",
        date: "",
      },
    },
  });

  const submitForm = async (): Promise<void> => {
    if (!page.validate().hasErrors) {
      setResult(0);
      const data = JSON.stringify(page.values["class"]);
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // add tokens from localstorage
          access_token: `${tokens.access_token}`,
          id_token: `${tokens.id_token}`,
        },
        body: data,
      };
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/class` as string,
          config
        );
        const { message } = await response.json();
        console.log("response", response.status, message)
        if (response.status === 201 && message === "created") {
          setResult(2);
        } else if (response.status === 409 && message === "Class already exist!") {
          setResult(3);
        } else {
          setResult(1);
        }
      } catch (error) {
        setResult(1);
      }
      setAlert(true);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <Create page={page} />
      <Group position="apart" mt="xl">
        <Button onClick={submitForm}>Enviar</Button>
      </Group>
      {
        [
          <UnstyledButton />,
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Não conseguimos fazer o cadastro da turma"
            color="red.6"
          >
            Entre em contato.
          </Alert>,
          <Alert
            icon={<IconCircleCheck size={16} />}
            title="Turma cadastrada!"
            color="teal.6"
            children={undefined}
          />,
          <Alert
            icon={<IconCircleCheck size={16} />}
            title="Turma já existe!"
            color="red.6"
            children={undefined}
          />,
        ][result]
      }
    </div>
  );
}
