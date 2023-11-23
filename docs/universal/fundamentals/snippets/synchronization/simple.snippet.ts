import * as reactive from "@starbeam/collections";
import { Sync } from "@starbeam/universal";

interface CurrentTitle {
  title: string | null;
}

export function Title(): Sync<Readonly<CurrentTitle>> {
  return Sync(({ on }) => {
    const htmlTitle = document.querySelector("title");

    // #highlight start
    // 1. Set up internal reactive state for the title. If the
    // <title> does not exist, the "current title" will always
    // be null.
    // #highlight end
    const state: CurrentTitle = reactive.object({
      title: null,
    });

    if (htmlTitle) {
      on.sync(() => {
        // #highlight start
        // 2. Set up a listener to state-change events.
        // In this case, we are setting up a listener
        // that will fire when the title changes.
        // #highlight end
        const observer = new MutationObserver(function () {
          // #highlight start
          // 3. When the external state (the title) changes, update
          // the reactive state to reflect the change.
          state.title = htmlTitle.nodeValue;
          // #highlight end
        });

        observer.observe(htmlTitle, { childList: true });

        // #highlight start
        // 5. When the resource is disposed, disconnect the observer.
        return () => {
          observer.disconnect();
        };
        // #highlight end
      });
    }

    // #highlight start
    // 4. Exposes a public API that allows consumers to access
    // the current state.
    return state;
    // #highlight end

    // In this case, we're just exposing the
    // `{title: string | null}` directly, but we could expose any
    // object we want, and its getters or methods can read from
    // the state.
  });
}
