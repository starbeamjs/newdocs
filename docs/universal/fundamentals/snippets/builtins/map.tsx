import * as reactive from "@starbeam/collections";

// #highlight next
const person = reactive.Map<string, string>();
person.set("name", "Preston");
person.set("affiliation", "ember-resources");

function card(person: Map<string, string>) {
  // #highlight next
  return `${person.get("name")} (${person.get("affiliation")})`;
}

// #highlight next
render(() => <p>{card(person)}</p>);

// #highlight start
// Updating `affiliation` will update the rendered `card`
person.set("affiliation", "Starbeam");
// #highlight end

// ---cut-after---
declare function render(callback: () => JSX.Element): void;
