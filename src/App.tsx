import React from "react";
import { MantineProvider, Box } from "@mantine/core";
import { theme } from "./theme";
import { useThemeDetector } from "./utils/useThemeDetector";
import AuthenticationForm from "./AuthenticationForm";

function App() {
  document.title = "PPV Admin";
  const isDarkTheme = useThemeDetector();
  return (
    <MantineProvider
      theme={{ ...theme, colorScheme: isDarkTheme ? "dark" : "light" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Box
        sx={{
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: 420,
          paddingTop: 40,
        }}
      >
        <AuthenticationForm />
      </Box>
    </MantineProvider>
  );
}

export default App;
