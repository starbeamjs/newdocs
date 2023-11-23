import * as reactive from "@starbeam/collections";

// #highlight next
const tags = reactive.Set<string>();
tags.add("javascript");
tags.add("typescript");

render(() => (
  <div>
    // #highlight next
    <p>({tags.size})</p>
    <ul>
      // #highlight start
      {[...tags].map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
      // #highlight end
    </ul>
  </div>
));

// #highlight start
// Adding a tag will invalidate the rendered tag cloud
tags.add("json");
// #highlight end

// #highlight start
// Adding a tag that already exists in the set will not
// invalidate the rendered tag cloud
tags.add("json");
// #highlight end

// ---cut-after---
declare function render(callback: () => JSX.Element): void;
