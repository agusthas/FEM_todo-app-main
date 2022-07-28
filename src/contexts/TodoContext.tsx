import { useListState, UseListStateHandlers } from '@mantine/hooks';
import { createContext, useContext } from 'react';
import { ITodo, todoData } from '../data';

interface ITodoContext {
  todos: ITodo[];
  handlers: UseListStateHandlers<ITodo>;
}
const TodoContext = createContext<ITodoContext>({
  todos: [],
  handlers: {} as UseListStateHandlers<ITodo>,
});

export function TodoContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [todos, handlers] = useListState(todoData);

  return (
    <TodoContext.Provider
      value={{
        todos,
        handlers,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => {
  return useContext(TodoContext);
};
