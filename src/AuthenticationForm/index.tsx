import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Stack,
  Alert,
  LoadingOverlay,
  Box,
  createStyles,
} from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";
import { useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import Tokens from "./Tokens";
import logo from '../img/logo.webp';

interface LoginFormValues {
  email: string;
  password: string;
}

const useStyles = createStyles(() => ({
  image: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'center',
  },
}));

export default function AuthenticationForm(props: PaperProps) {
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) =>
        /^\S+@\S+$/.test(val) ? null : "Informe seu endereço de e-mail",
      password: (val) =>
        val.length <= 6
          ? "Sua chave de acesso possui mais de 6 caracteres"
          : null,
    },
  });

  const [error, setError] = useState<string>("");

  const [overlay, setOverlay] = useState(false);

  const [tokens, setTokens] = useLocalStorage<Tokens>({
    key: "tokens",
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setOverlay(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/login`,
        {
          method: "POST",
          body: JSON.stringify({
            user: values.email,
            password: values.password,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();
          setTokens(data.message);
          setError("");
          console.log(tokens);
          break;
        case 400:
          setError("Verifique seu e-mail e senha e tente novamente.");
          break;
        default:
          throw new Error("failed to login");
      }
    } catch (err) {
      setError(
        "Algo deu errado, verifique sua conexão com a internet e tente novamente."
      );
      throw err;
    } finally {
      setOverlay(false);
    }
  };

  return (
    <Box
      sx={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: 420,
        paddingTop: 40,
      }}
    >
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={overlay} overlayBlur={2} />
        <Paper radius="md" p="xl" withBorder {...props}>
          <Box className={classes.image}>
            <img src={logo} alt="Pilotando Para Vida" height={200} />
          </Box>
          <Divider
            label="Acesso restrito - Rancheiros Admin"
            labelPosition="center"
            my="lg"
          />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              {error && (
                <Alert
                  icon={<AlertCircle size={16} />}
                  title="Falha de autenticação"
                  color="red"
                >
                  {error}
                </Alert>
              )}
              <TextInput
                label="E-mail"
                placeholder="jackson.teller@gmail.com"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email}
              />
              <PasswordInput
                label="Chave de acesso"
                placeholder="******"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={form.errors.password}
              />
            </Stack>
            <Group position="apart" mt="xl">
              <Button type="submit">Entrar</Button>
            </Group>
          </form>
        </Paper>
      </div>
    </Box>
  );
}
