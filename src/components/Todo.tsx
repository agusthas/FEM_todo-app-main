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
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
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
      pointerEvents: 'none',
    },

    todoInput: {
      flex: 1,
    },

    todoDeleteButton: {
      ref: getRef('todoDeleteButton'),
      opacity: 0,
    },

    todoDragging: {
      boxShadow: theme.shadows.lg,
      border: 'none',
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
  const { classes, cx } = useStyles(todo.completed);
  return (
    <Draggable key={todo.title} index={index} draggableId={todo.title}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.wrapper, {
            [classes.todoDragging]: snapshot.isDragging,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Checkbox
            icon={({ className }) => (
              <img src={checkIcon} className={className} />
            )}
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
      )}
    </Draggable>
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
        <DragDropContext
          onDragEnd={({ source, destination }) => {
            if (!destination) {
              return;
            }

            if (destination.index === source.index) {
              return;
            }

            handlers.reorder({
              from: source.index,
              to: destination?.index || 0,
            });
          }}
        >
          <Droppable droppableId="dnd-todo-list" direction="vertical">
            {(provided) => (
              <ScrollArea
                sx={(theme) => ({
                  height: 420,
                  [theme.fn.smallerThan('md')]: {
                    height: 300,
                  },
                })}
                viewportRef={provided.innerRef}
                {...provided.droppableProps}
              >
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
                {provided.placeholder}
              </ScrollArea>
            )}
          </Droppable>
        </DragDropContext>

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

          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
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

      <MediaQuery
        largerThan="sm"
        styles={{
          display: 'none',
        }}
      >
        <Group
          position="center"
          p="md"
          mt="lg"
          sx={(theme) => ({
            borderRadius: theme.radius.xs,
            backgroundColor:
              theme.colorScheme === 'dark'
                ? 'var(--todo-bg-dark)'
                : 'var(--todo-bg-light)',
          })}
        >
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

      <Text align="center" mt={40}>
        Drag and drop to reorder list
      </Text>
    </>
  );
}
