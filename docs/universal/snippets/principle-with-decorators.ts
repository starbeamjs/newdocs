/* eslint-disable @typescript-eslint/prefer-readonly */
// ---cut---
export class Person {
  @tracked accessor #name: string;
  @tracked accessor #affiliation: string;

  constructor(name: string, affiliation: string) {
    this.#name = name;
    this.#affiliation = affiliation;
  }

  get card(): string {
    return `${this.#name} (${this.#affiliation})`;
  }
}

const person = new Person("Katie Gengler", "EmberObserver");

// The `render` function is a placeholder for the Starbeam
// renderer for your framework.
render(() => person.card);

// ---cut-after---
declare function render(callback: () => string): void;

declare function tracked<This, Value>(
  target: ClassAccessorDecoratorTarget<This, Value>,
  context: ClassAccessorDecoratorContext,
): ClassAccessorDecoratorResult<This, Value>;
