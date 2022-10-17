import { useForm } from '@mantine/form';
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
} from '@mantine/core';

export default function AuthenticationForm(props: PaperProps) {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Informe seu endereço de e-mail'),
      password: (val) => (val.length <= 6 ? 'Sua chave de acesso possui pelo menos 6 caracteres' : null),
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
       Boas vindas ao sistema interno do projeto Pilotando Para Vida
      </Text>

      <Divider label="Entre com seus dados de acesso" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>

          <TextInput
            label="E-mail"
            placeholder="jackson.teller@gmail.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email}
          />

          <PasswordInput
            label="Chave de acesso"
            placeholder="******"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password}
          />

        </Stack>

        <Group position="apart" mt="xl">
          <Button type="submit">Entrar</Button>
        </Group>
      </form>
    </Paper>
  );
}