import React from "react";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { useThemeDetector } from "./utils/useThemeDetector";
import AuthenticationForm from "./AuthenticationForm";
import { useLocalStorage } from "@mantine/hooks";
import Tokens from "./AuthenticationForm/Tokens";
import Main from "./Main";

function App() {
  document.title = "PPV Admin";
  const isDarkTheme = useThemeDetector();

  const [tokens] = useLocalStorage<Tokens>({
    key: "tokens",
  });

  return (
    <MantineProvider
      theme={{ ...theme, colorScheme: isDarkTheme ? "dark" : "light" }}
      withGlobalStyles
      withNormalizeCSS
    >
      {!tokens ? <AuthenticationForm /> : <Main />}
    </MantineProvider>
  );
}

export default App;
