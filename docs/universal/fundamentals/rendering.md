# Reactive Rendering

Once you've created a reactive object or resource using Starbeam,
you can use it in your application using the appropriate Starbeam renderer for
your web framework.

:::tip Universal Reactivity

Starbeam's universal APIs allow you to create reactive objects and synchronize
external state in a way that can be shared across web frameworks. We call these
"universal reactive objects".

Framework renderers provide APIs for using universal reactive objects in
different web frameworks.

:::

To render something using Starbeam, we first need a **reactive object**. We'll
use a reactive todo list as an example.

- First, we'll build the reactive todo list using Starbeam's reactive APIs, and
  without any reference to any specific web framework.
- Then, we'll see how to use Starbeam **renderers** to create a todo list UI
  that will remain up-to-date when the todo list changes.to thyou

### The Universal Reactive Object

Consider these reactive class that represent (a) a list of todo items, (b) a
todo item:

[[code ./snippets/rendering.snippet.ts]]

We wrote this reactive todo list using Starbeam's reactive APIs.

### Rendering

What we mean when we say that the todo list is "reactive" is that we can create
an output UI that is up-to-date with the current state of the todo list.

Starbeam **renderers** allow you to do just that: take a reactive object and use
your framework of choice to render a UI that will remain up-to-date when the
reactive object changes.

:::tabs

== Ember

```gts
class TodoList extends Component {
  readonly #todos = new TodoItems();
  @tracked #filter = (todo: TodoItem) => true;

  createTodo = (e: FormEvent) => {
    e.preventDefault();
    const text = e.target["text"].value;
    this.#todos.add(text);
    e.target["text"].value = "";
  };

  <template>
    <header>
      <h1>Todos</h1>
      <form {{on "submit" (this.createTodo)}}>
        <input
          type="text"
          name="text"
          placeholder="What needs to be done?"
        >
        <button type="submit">Create</button>
      </form>
    </header>
    <section class="main">
      <ul class="todo-list">
        {{#each (this.#todos.filter this.filter) as |todo|}}
          <TodoItem @todo={{todo}} @todos={{this.#todos}} />
        {{/each}}
      </ul>
    </section>
  </template>
}

const TodoItem = <template>
  <li>
    <input
        type="checkbox" checked={{@todo.completed}}
        {{on "input" (@todo.completed)}}
    >

    <p>{{@todo.text}}</p>

    <button {{on "click" (@todos.remove todo)}}>
      x
    </button>
  </li>
</template>
```

== React

```tsx
function TodoList() {
  return useResource(() => {
    function createTodo(e: FormEvent) {
      e.preventDefault();
      const text = e.target["text"].value;
      todos.add(text);
      e.target["text"].value = "";
    }

    const state = reactive.object({
      filter: (todo: TodoItem) => true,
    });

    const todos = new TodoItems();

    return () => (
      <>
        <header>
          <h1>Todos</h1>
          <form onSubmit={createTodo}>
            <input
              type="text"
              name="text"
              placeholder="What needs to be done?"
            />
            <button type="submit">Create</button>
          </form>
        </header>
        <section className="main">
          <ul className="todo-list">
            {todos.filter(state.filter).map((todo) => (
              <TodoItem key={todo.id} todo={todo} todos={todos} />
            ))}
          </ul>
        </section>
      </>
    );
  });
}

interface TodoItemProps {
  todo: TodoItem;
  todos: TodoItems;
}

function TodoItem({ todo, todos }: TodoItemProps) {
  return useReactive(() => (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onInput={() => todo.toggle()}
      />
    </li>
  ));
}
```

== Vue

### `TodoList.vue`

```vue
<script setup>
const todos = new TodoItems();
const filter = ref((todo: TodoItem) => true);

function createTodo(e: FormEvent) {
  e.preventDefault();
  const text = e.target["text"].value;
  todos.add(text);
  e.target["text"].value = "";
}
</script>

<template>
  <header>
    <h1>Todos</h1>

    <form @submit="createTodo">
      <input type="text" name="text" placeholder="What needs to be done?" />
      <button type="submit">Create</button>
    </form>
  </header>
  <section class="main">
    <ul class="todo-list">
      <TodoItem
        v-for="todo in todos.filter(filter)"
        :key="todo.id"
        :todo="todo"
        :todos="todos"
      />
    </ul>
  </section>
</template>
```

### `TodoItem.vue`

```vue
import { useReactive } from "@starbeam/vue";

<script setup>
defineProps<{
  todo: TodoItem;
  todos: TodoItems;
}>();

useReactive();
</script>

<template>
  <li>
    <input type="checkbox" checked @input="todo.toggle()" />
    <p>{{ todo.text }}</p>
    <button @click="todos.remove(todo)">x</button>
  </li>
</template>
```

:::
