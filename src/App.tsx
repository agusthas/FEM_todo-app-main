import { MantineProvider, Title } from '@mantine/core';

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Title>Welcome to Mantine</Title>
    </MantineProvider>
  );
}
