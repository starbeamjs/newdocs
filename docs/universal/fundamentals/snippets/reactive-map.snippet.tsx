import * as reactive from "@starbeam/collections";

// #highlight:normal-api next
const people = reactive.Map<string, Person>();

// This is a placeholder for an actual React renderer.
render(() => {
  return (
    <>
      // #highlight:normal-api start
      {[...people].map(([id, person]) => {
        return (
          <div key={id}>
            {person.name} ({person.affiliation})
          </div>
        );
      })}
      // #highlight:normal-api end
    </>
  );
});

// #highlight:normal-set start
people.set("1", {
  name: "nullvox",
  affiliation: "Auditboard",
});
// #highlight:normal-set end

interface Person {
  name: string;
  affiliation: string;
}

// ---cut-after---
declare function render(callback: () => JSX.Element): void;
