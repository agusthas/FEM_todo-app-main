import {
  Box,
  ColorScheme,
  ColorSchemeProvider,
  Container,
  Global,
  MantineProvider,
  MantineThemeOverride,
  Stack,
} from '@mantine/core';
import { useColorScheme, useHotkeys, useLocalStorage } from '@mantine/hooks';
import { Header } from './components/Header';
import { TodoList } from './components/Todo';
import { TodoCreate } from './components/TodoCreate';
import { TodoContextProvider } from './contexts/TodoContext';

const theme: MantineThemeOverride = {
  fontFamily:
    'Josefin Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
  headings: {
    fontFamily:
      'Josefin Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
  },
};

function GlobalStyles() {
  return (
    <Global
      styles={(theme) => ({
        ':root': {
          '--check-background':
            'linear-gradient(90deg, hsl(192, 100%, 67%), hsl(280, 87%, 65%))',
          '--bright-blue': 'hsl(220, 98%, 61%)', // button color text

          '--main-bg-light': 'hsl(0, 0%, 98%)', // main bg
          '--todo-bg-light': 'hsl(236, 33%, 92%)', // todo background
          '--light-grayish-blue': 'hsl(233, 11%, 84%)',
          '--dark-grayish-blue': 'hsl(236, 9%, 61%)',
          '--very-dark-grayish-blue': 'hsl(235, 19%, 35%)',

          '--main-bg-dark': 'hsl(235, 21%, 11%)', // main bg
          '--todo-bg-dark': 'hsl(235, 24%, 19%)', // todo background
          '--light-grayish-blue-dark': 'hsl(234, 39%, 85%)',
          '--light-grayish-blue-hover': 'hsl(236, 33%, 92%)',
          '--dark-grayish-blue-dark': 'hsl(234, 11%, 52%)',
          '--very-dark-grayish-blue-dark': 'hsl(233, 14%, 35%)',
        },

        body: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? 'var(--main-bg-dark)'
              : 'var(--main-bg-light)',
          color:
            theme.colorScheme === 'dark'
              ? 'var(--very-dark-grayish-blue-dark)'
              : 'var(--very-dark-grayish-blue)',
        },
      })}
    />
  );
}

export default function App() {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'todo-app-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'light' ? 'dark' : 'light'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          ...theme,
          colorScheme,
        }}
      >
        <GlobalStyles />

        <Box
          sx={(theme) => ({
            backgroundImage:
              theme.colorScheme === 'dark'
                ? `url('/images/bg-desktop-dark.jpg')`
                : `url('/images/bg-desktop-light.jpg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            position: 'absolute',
            zIndex: -1,
            width: '100%',
            height: 300,

            [theme.fn.smallerThan('sm')]: {
              backgroundImage:
                theme.colorScheme === 'dark'
                  ? `url('/images/bg-mobile-dark.jpg')`
                  : `url('/images/bg-mobile-light.jpg')`,
            },
          })}
        />

        <Container
          size={550}
          sx={{
            display: 'grid',
            placeItems: 'center',
            minHeight: '100vh',
          }}
        >
          <TodoContextProvider>
            <div style={{ width: '100%' }}>
              <Stack>
                <Header />
                <TodoCreate />
              </Stack>

              <TodoList />
            </div>
          </TodoContextProvider>
        </Container>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
