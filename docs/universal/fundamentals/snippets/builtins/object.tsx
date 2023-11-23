import * as reactive from "@starbeam/collections";

// #highlight next
const person = reactive.object({
  name: "Preston",
  affiliation: "ember-resources",
});

function card(person: { name: string; affiliation: string }) {
  // #highlight next
  return `${person.name} (${person.affiliation})`;
}

// #highlight next
render(() => <p>{card(person)}</p>);

// #highlight start
// Updating `affiliation` will update the rendered `card`
person.affiliation = "Starbeam";
// #highlight end

// ---cut-after---
declare function render(callback: () => JSX.Element): void;
