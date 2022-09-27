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

export function AuthenticationForm(props: PaperProps) {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Informe seu endereço de e-mail'),
      password: (val) => (val.length <= 6 ? 'Sua senha possui pelo menos 6 caracteres' : null),
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
       Boas vindas ao sistema interno do PPV
      </Text>

      <Divider label="Entre com seus dados" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>

          <TextInput
            label="E-mail"
            placeholder="jackson.teller@gmail.dev"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password}
          />

        </Stack>

        <Group position="apart" mt="xl">
          <Button type="submit">Login</Button>
        </Group>
      </form>
    </Paper>
  );
}