import {
  createStyles,
  Group,
  Title,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import moonIcon from '../assets/icon-moon.svg';
import sunIcon from '../assets/icon-sun.svg';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '2.5rem',
    letterSpacing: '0.25em',
    color: theme.white,
  },
}));

function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group>
      <UnstyledButton onClick={() => toggleColorScheme()}>
        {colorScheme === 'dark' ? (
          <img src={sunIcon} alt="Sun Icon" />
        ) : (
          <img src={moonIcon} alt="Moon Icon" />
        )}
      </UnstyledButton>
    </Group>
  );
}

export function Header() {
  const { classes } = useStyles();
  return (
    <header className={classes.root}>
      <Title className={classes.title}>TODO</Title>
      <ColorSchemeToggle />
    </header>
  );
}
