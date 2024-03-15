import {
  MantineTheme,
  Select,
  TextInput,
  UseStylesOptions,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { ReactElement } from "react";

export default function Create({
  page,
}: {
  page: UseFormReturnType<{
    class: {
      city: string;
      location: string;
      date: string;
    };
  }>;
}): ReactElement {
  return (
    <>
      <Select
        label="Cidade do treinamento"
        mt="md"
        withAsterisk
        {...page.getInputProps("class.city")}
        data={[
          { value: "curitiba", label: "Curitiba" },
          { value: "maringa", label: "Maringá" },
          { value: "londrina", label: "Londrina" },
          { value: "cambira", label: "Cambira" },
          { value: "medianeira", label: "Medianeira" },
          { value: "arapongas", label: "Arapongas" },
        ]}
      />
      <TextInput
        label="Localização"
        placeholder="https://goo.gl/maps/xxxxx"
        mt="md"
        withAsterisk
        {...page.getInputProps("class.location")}
      />
      <TextInput
        label="Data do treinamento"
        placeholder="DD/MM/AAAA"
        mt="md"
        withAsterisk
        {...page.getInputProps("class.date")}
      />
    </>
  );
}
