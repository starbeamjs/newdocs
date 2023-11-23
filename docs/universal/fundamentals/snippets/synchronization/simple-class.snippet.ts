import { on, tracked } from "@starbeam/universal";

export class Title {
  // We're using the "tracked" decorator with a private field,
  // which allows us to mutate `#title` directly without
  // exposing a mutable field to users of `Title`.
  // #highlight next
  @tracked accessor #title: string | null = null;

  constructor() {
    const htmlTitle = document.querySelector("title");

    if (htmlTitle) {
      // on.sync allows us to define the synchronization
      // behavior of this class.
      // #highlight next
      on.sync(() => {
        const observer = new MutationObserver(() => {
          this.#title = htmlTitle.nodeValue;
        });

        observer.observe(htmlTitle, { childList: true });

        return () => {
          observer.disconnect();
        };
      });
    }
  }

  // Whenever #title is synchronized, it will invalidate any
  // render that used the `title` getter.
  // #highlight start
  get title(): string | null {
    return this.#title;
  }
  // #highlight end
}
