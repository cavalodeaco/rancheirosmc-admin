import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { useThemeDetector } from "./utils/useThemeDetector";
import AuthenticationForm from "./AuthenticationForm";
import { useLocalStorage } from "@mantine/hooks";
import Tokens from "./AuthenticationForm/Tokens";
import { CustomFonts } from "./CustomFonts";
import { FetchData } from "./FetchData";

function App() {
  document.title = "PPV Admin";
  const isDarkTheme = useThemeDetector();

  const [tokens] = useLocalStorage<Tokens>({
    key: "tokens",
  });

  return (
    <MantineProvider
      theme={{ ...theme, colorScheme: "dark" }} // isDarkTheme ? "dark" : "light"
      withGlobalStyles
      withNormalizeCSS
    >
      <CustomFonts/>
      {tokens ? <AuthenticationForm /> : <FetchData />}
    </MantineProvider>
  );
}

export default App;
