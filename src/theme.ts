import { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  colorScheme: "dark",
  colors: {
    brand: [
      "#D8CAA3",
      "#D7C082",
      "#DCBA5E",
      "#E8B834",
      "#FFBB04", // <- primary shade color
      "#D29F17",
      "#AC8826",
      "#8F752E",
      "#786532",
      "#665833"
    ],
  },
  primaryColor: 'brand',
  primaryShade: 5,
  headings: {
    fontFamily: 'Comfortaa, Ubuntu, sans-serif',
    fontWeight: 'normal',
  },
};