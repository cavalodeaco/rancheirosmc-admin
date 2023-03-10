import { Alert, Button, createStyles, Stepper, UnstyledButton } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons";
import { useState } from "react";
import { z } from "zod";
import Tokens from "../../AuthenticationForm/Tokens";
import Create from "../Create";

const useStyles = createStyles((mantineTheme) => ({
  form: {
    backgroundColor: mantineTheme.white,
    padding: mantineTheme.spacing.xl,
    borderRadius: mantineTheme.radius.md,
    boxShadow: mantineTheme.shadows.lg,
  },

  input: {
    backgroundColor: mantineTheme.white,
    borderColor: mantineTheme.colors.gray[4],
    color: mantineTheme.black,

    "&::placeholder": {
      color: mantineTheme.colors.gray[5],
    },
  },

  inputLabel: {
    color: mantineTheme.black,
  },

  control: {
    backgroundColor: mantineTheme.colors[mantineTheme.primaryColor][6],
  },
}));

const pageSchema = z.object({
  class: z.object({
    location: z.string().min(1, { message: "O campo localização é obrigatório" }),
    date: z.string().min(1, { message: "O campo data é obrigatório" }),
  }),
});


export function CreateForm() {
  const { classes } = useStyles();
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
        date: ""
      }
    },
  });

  const submitForm = async (): Promise<void> => {
    if (!page.validate().hasErrors) {
      setResult(0);
      const data = JSON.stringify(
        page.values["class"]
      );
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "id_token": `${tokens.id_token}`
        },
        body: data,
      };
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/class` as string,
          config
        );
        const { message } = await response.json();
        if (response.status === 201 && message === "created") {
          setResult(2);
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
      <Create page={page} useStyles={useStyles} />
      <Button onClick={submitForm}>Enviar</Button>
      {[
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
          color="teal.6" children={undefined} />
      ][result]}
    </div >
  )
}