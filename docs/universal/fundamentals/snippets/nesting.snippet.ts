import * as reactive from "@starbeam/collections";

export class Person {
  readonly #data: {
    name: string;
    affiliation: string;
  };

  constructor(name: string, affiliation: string) {
    this.#data = reactive.object({ name, affiliation });
  }

  get card(): string {
    return `${this.#data.name} (${this.#data.affiliation})`;
  }

  get name(): string {
    return this.#data.name;
  }

  set name(value: string) {
    this.#data.name = value;
  }

  get affiliation(): string {
    return this.#data.affiliation;
  }

  set affiliation(value: string) {
    this.#data.affiliation = value;
  }
}
