import {
  ActionIcon,
  Checkbox,
  createStyles,
  Group,
  MediaQuery,
  Paper,
  ScrollArea,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { UseListStateHandlers } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import checkIcon from '../assets/icon-check.svg';
import crossIcon from '../assets/icon-cross.svg';
import { useTodos } from '../contexts/TodoContext';
import { ITodo } from '../data';

export const useStyles = createStyles(
  (theme, completed: boolean | void, getRef) => ({
    wrapper: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
      backgroundColor:
        theme.colorScheme === 'dark'
          ? 'var(--todo-bg-dark)'
          : 'var(--todo-bg-light)',
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[4]
      }`,

      [`&:hover .${getRef('todoDeleteButton')}`]: {
        opacity: 1,
      },
    },

    formWrapper: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
      borderRadius: theme.radius.sm,
      backgroundColor:
        theme.colorScheme === 'dark'
          ? 'var(--todo-bg-dark)'
          : 'var(--todo-bg-light)',
    },

    todoCheckbox: {
      marginRight: theme.spacing.md,
    },

    todoCheckboxInput: {
      cursor: 'pointer',
      backgroundColor:
        theme.colorScheme === 'dark'
          ? 'var(--todo-bg-dark)'
          : 'var(--todo-bg-light)',
      ':checked': {
        background: `var(--check-background)`,
        border: 'none',
      },
    },

    todoInputDisabled: {
      color:
        theme.colorScheme === 'dark' && completed
          ? 'var(--very-dark-grayish-blue-dark)'
          : theme.colorScheme === 'light' && completed
          ? 'var(--dark-grayish-blue)'
          : theme.colorScheme === 'dark'
          ? 'var(--light-grayish-blue-dark)'
          : 'var(--very-dark-grayish-blue)',
      opacity: 1,
      textDecoration: completed ? 'line-through' : 'none',
      cursor: 'initial',
    },

    todoInput: {
      flex: 1,
    },

    todoDeleteButton: {
      ref: getRef('todoDeleteButton'),
      opacity: 0,
    },
  })
);

function Todo({
  todo,
  index,
  handlers,
}: {
  todo: ITodo;
  index: number;
  handlers: UseListStateHandlers<ITodo>;
}) {
  const { classes } = useStyles(todo.completed);
  return (
    <div className={classes.wrapper}>
      <Checkbox
        icon={({ className }) => <img src={checkIcon} className={className} />}
        size="md"
        radius="lg"
        checked={todo.completed}
        onChange={() =>
          handlers.setItemProp(index, 'completed', !todo.completed)
        }
        classNames={{
          root: classes.todoCheckbox,
          input: classes.todoCheckboxInput,
        }}
      />
      <TextInput
        size="lg"
        disabled
        variant="unstyled"
        value={todo.title}
        classNames={{
          root: classes.todoInput,
          disabled: classes.todoInputDisabled,
        }}
      />

      <ActionIcon
        className={classes.todoDeleteButton}
        onClick={() => handlers.remove(index)}
      >
        <img src={crossIcon} />
      </ActionIcon>
    </div>
  );
}

type TodoType = 'All' | 'Active' | 'Completed';
const todoTypes: TodoType[] = ['All', 'Active', 'Completed'];
export function TodoList() {
  const { todos, handlers } = useTodos();
  const [filtered, setFiltered] = useState<TodoType>('All');

  const todosLeft = useMemo(() => {
    return todos.reduce((acc, todo) => (todo.completed ? acc : acc + 1), 0);
  }, [todos]);

  return (
    <>
      <Paper
        mt="xl"
        radius="sm"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark'
              ? 'var(--todo-bg-dark)'
              : 'var(--todo-bg-light)',
          overflow: 'hidden',
        })}
      >
        <ScrollArea style={{ height: 430 }}>
          {filtered === 'All' &&
            todos.map((todo, i) => (
              <Todo key={i} index={i} todo={todo} handlers={handlers} />
            ))}
          {filtered === 'Active' &&
            todos
              .filter((todo) => !todo.completed)
              .map((todo, i) => (
                <Todo key={i} index={i} todo={todo} handlers={handlers} />
              ))}
          {filtered === 'Completed' &&
            todos
              .filter((todo) => todo.completed)
              .map((todo, i) => (
                <Todo key={i} index={i} todo={todo} handlers={handlers} />
              ))}
        </ScrollArea>

        <Group position="apart" p="md">
          <Text
            size="sm"
            sx={(theme) => ({
              color:
                theme.colorScheme === 'dark'
                  ? 'var(--very-dark-grayish-blue-dark)'
                  : 'var(--dark-grayish-blue)',
            })}
          >
            {todosLeft} items left
          </Text>

          <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
            <Group>
              {todoTypes.map((text) => (
                <UnstyledButton
                  key={text}
                  sx={(theme) => ({
                    fontWeight: 'bold',
                    color:
                      filtered === text
                        ? 'var(--bright-blue)'
                        : theme.colorScheme === 'dark'
                        ? 'var(--very-dark-grayish-blue-dark)'
                        : 'var(--dark-grayish-blue)',

                    '&:hover': {
                      color:
                        theme.colorScheme === 'dark'
                          ? 'var(--light-grayish-blue-dark)'
                          : 'var(--very-dark-grayish-blue)',
                    },
                  })}
                  onClick={() => setFiltered(text)}
                >
                  <Text size="sm">{text}</Text>
                </UnstyledButton>
              ))}
            </Group>
          </MediaQuery>

          <UnstyledButton
            sx={(theme) => ({
              color:
                theme.colorScheme === 'dark'
                  ? 'var(--very-dark-grayish-blue-dark)'
                  : 'var(--dark-grayish-blue)',
              '&:hover': {
                color:
                  theme.colorScheme === 'dark'
                    ? 'var(--light-grayish-blue-dark)'
                    : 'var(--very-dark-grayish-blue)',
              },
            })}
          >
            <Text
              size="sm"
              onClick={() => handlers.filter((todo) => !todo.completed)}
            >
              Clear completed
            </Text>
          </UnstyledButton>
        </Group>
      </Paper>

      <Text align="center" mt={40}>
        Drag and drop to reorder list
      </Text>
    </>
  );
}
