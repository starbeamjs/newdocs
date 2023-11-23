import * as reactive from "@starbeam/collections";

export class TodoItems {
  readonly #items = reactive.Map<string, TodoItem>();

  add(title: string): TodoItem {
    const todo = new TodoItem(title);
    this.#items.set(todo.id, todo);
    return todo;
  }

  toggleAll(checked: boolean): void {
    for (const item of this.#items.values()) {
      item.toggle(checked);
    }
  }

  clearCompleted(): void {
    for (const item of this.#items.values()) {
      if (item.completed) {
        this.#items.delete(item.id);
      }
    }
  }

  filter(filter: (item: TodoItem) => boolean): TodoItem[] {
    return [...this.#items.values()].filter(filter);
  }

  remove(id: string): void {
    this.#items.delete(id);
  }
}

class TodoItem {
  readonly id = crypto.randomUUID();
  @tracked accessor completed = false;
  @tracked accessor title: string;

  constructor(title: string) {
    this.title = title;
  }

  toggle(checked = !this.completed): void {
    this.completed = checked;
  }
}

// ---cut-after---
declare function tracked<This, Value>(
  target: ClassAccessorDecoratorTarget<This, Value>,
  context: ClassAccessorDecoratorContext,
): ClassAccessorDecoratorResult<This, Value>;
