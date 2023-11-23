import { object } from "@starbeam/collections";

// #highlight:welcome next
interface Person {
  name: string;
  affiliation: string;
}

// #highlight:welcome next
const person: Person = object({
  name: "Katie Gengler",
  affiliation: "EmberObserver",
});

function card(person: Person) {
  return `${person.name} (${person.affiliation})`;
}

// The `render` function is a placeholder for the Starbeam
// renderer for your framework.
render(() => card(person));

// ---cut-after---
declare function render(callback: () => string): void;
