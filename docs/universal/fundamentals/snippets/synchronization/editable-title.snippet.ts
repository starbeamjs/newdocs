import { on, tracked } from "@starbeam/universal";

export class Title {
  @tracked accessor #title: string | null = null;
  readonly #htmlTitle: HTMLTitleElement | null = null;

  constructor() {
    const htmlTitle = document.querySelector("title");

    if (htmlTitle) {
      this.#htmlTitle = htmlTitle;

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

  set title(value: string) {
    if (this.#htmlTitle) {
      // #highlight start
      // Since we're synchronizing with external state, treat
      // the title element as the source of truth and update it.
      // This will ultimately trigger the mutation observer and
      // update the reactive state and update any render that
      // used the `title` getter in our framework's rendering
      // lifecycle.
      // #highlight end
      this.#htmlTitle.nodeValue = value;
    }
  }

  get title(): string | null {
    return this.#title;
  }
}
