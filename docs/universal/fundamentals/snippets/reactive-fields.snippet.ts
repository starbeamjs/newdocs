export class Person {
  @tracked accessor name: string;
  @tracked accessor affiliation: string;

  constructor(name: string, affiliation: string) {
    this.name = name;
    this.affiliation = affiliation;
  }

  get card(): string {
    return `${this.name} (${this.affiliation})`;
  }
}

// ---cut-after---

declare function tracked<This, Value>(
  target: ClassAccessorDecoratorTarget<This, Value>,
  context: ClassAccessorDecoratorContext,
): ClassAccessorDecoratorResult<This, Value>;
