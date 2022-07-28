import { Checkbox, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTodos } from '../contexts/TodoContext';
import { ITodo } from '../data';
import { useStyles } from './Todo';

export function TodoCreate() {
  const { handlers } = useTodos();
  const { classes } = useStyles();

  const form = useForm<ITodo>({
    initialValues: {
      title: '',
      completed: false,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    handlers.prepend(values);

    form.reset();
  };

  return (
    <form
      className={classes.formWrapper}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Checkbox
        icon={({ className }) => (
          <img src="/images/icon-check.svg" className={className} />
        )}
        size="md"
        radius="lg"
        classNames={{
          root: classes.todoCheckbox,
          input: classes.todoCheckboxInput,
        }}
        {...form.getInputProps('completed', { type: 'checkbox' })}
      />
      <TextInput
        size="lg"
        variant="unstyled"
        placeholder="Create a new todo..."
        className={classes.todoInput}
        {...form.getInputProps('title')}
      />
    </form>
  );
}
