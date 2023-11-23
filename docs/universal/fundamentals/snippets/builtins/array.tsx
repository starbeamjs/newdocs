import * as reactive from "@starbeam/collections";

// #highlight next
const people = reactive.array([
  {
    name: "Yehuda",
    affiliation: "Ember",
  },
]);

function card(person: { name: string; affiliation: string }) {
  return (
    // #highlight start
    <li key={person.name}>
      {person.name} ({person.affiliation})
    </li>
    // #highlight end
  );
}

render(
  // prettier-ignore
  () => (
    // #highlight start
    <div>
      <p>People: {people.length}</p>
      //                 ^?
      <ul>{people.map(card)}</ul>
    </div>
  ),
  // #highlight end
);

// #highlight start
// Adding a person will update the rendered output
people.push({
  name: "Preston",
  affiliation: "Starbeam",
});
// #highlight end

// ---cut-after---
declare function render(callback: () => JSX.Element): void;
