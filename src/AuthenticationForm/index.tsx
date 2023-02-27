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
} from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";
import { useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import Tokens from "./Tokens";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function AuthenticationForm(props: PaperProps) {
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
          ? "Sua chave de acesso possui pelo menos 6 caracteres"
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
          <Text size="lg" weight={500}>
            Boas vindas ao sistema interno do projeto Pilotando Para Vida
          </Text>
          <Divider
            label="Entre com seus dados de acesso"
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
