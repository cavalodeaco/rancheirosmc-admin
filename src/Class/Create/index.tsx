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
    useStyles,
}: {
    page: UseFormReturnType<{
        class: {
            city: string;
            location: string;
            date: string;
        };
    }>;
    useStyles: (
        params: void,
        options?:
            | UseStylesOptions<"input" | "form" | "inputLabel" | "control">
            | undefined
    ) => {
        classes: Record<"input" | "form" | "inputLabel" | "control", string>;
        cx: (...args: unknown[]) => string;
        theme: MantineTheme;
    };
}): ReactElement {
    const { classes } = useStyles();

    return (
        <>
            <Select
                label="Cidade do treinamento"
                mt="md"
                withAsterisk
                {...page.getInputProps("class.city")}
                classNames={{
                    input: classes.input,
                    label: classes.inputLabel,
                }}
                data={[
                    { value: "curitiba", label: "Curitiba" },
                    { value: "maringa", label: "Maringá" },
                    { value: "londrina", label: "Londrina" },
                    { value: "cambira", label: "Cambira" },
                ]}
            />
            <TextInput
                label="Localização"
                placeholder="https://goo.gl/maps/xxxxx"
                mt="md"
                classNames={{
                    input: classes.input,
                    label: classes.inputLabel,
                }}
                withAsterisk
                {...page.getInputProps("class.location")}
            />
            <TextInput
                label="Data do treinamento"
                placeholder="DD/MM/AAAA"
                mt="md"
                withAsterisk
                {...page.getInputProps("class.date")}
                classNames={{
                    input: classes.input,
                    label: classes.inputLabel,
                }}
            />
        </>
    );
}
