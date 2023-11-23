import { object } from "@starbeam/collections";

class Person {
  readonly #data: { name: string; affiliation: string };

  constructor(name: string, affiliation: string) {
    this.#data = object({ name, affiliation });
  }

  get name() {
    return this.#data.name;
  }

  get affiliation() {
    return this.#data.affiliation;
  }
}

const person = new Person("Katie Gengler", "EmberObserver");

function card(person: Person) {
  return `${person.name} (${person.affiliation})`;
}

// The `render` function is a placeholder for the Starbeam
// renderer for your framework.
render(() => card(person));

// ---cut-after---
declare function render(callback: () => string): void;
