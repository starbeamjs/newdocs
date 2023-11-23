# Reactive Fields

So far, we've learned how to create
reactive versions of objects, arrays and other builtin JavaScript objects.

When building your own classes, you can easily use reactive objects in your
implementation.

[[code ./snippets/nesting.snippet.ts]]

From the perspective of external code, these getters behave like normal
properties, and can be accessed like any other JavaScript object.

If `card` is rendered reactively, any changes to `#data.name` or
`#data.affiliation` (even when made through the getters and setters) will be reflected in the UI.

## Enter Reactive Fields

While this works just fine, it can get tedious and repetitive.

Instead, you can create _reactive fields_ using the `@reactive` decorator.

[[code ./snippets/reactive-fields.snippet.ts]]

From the perspective of external code, these fields _also_ work like normal
JavaScript properties, and reactively rendering `card` will update whenever
either of the fields change.

While you **could** get along just fine without reactive fields, they make
writing reactive classes much more convenient, and let you focus on your
application logic rather than the mechanics of getters and setters.

## Do More With Reactive Fields

In addition to `@tracked property`, you can also use `@reactive` on **private**
fields (`@reactive #name`), and any changes you make to the private fields will
invalidate any getters, setters or methods that access them.

You can also use `@reactive` together with decorators like `@readonly` from any
library of standard JavaScript decorators.

Finally, the `@reactive` decorator also works seamlessly with TypeScript 5+,
including type support, without the need for any special experimental flags.

:::warning Build Tools

While `tsc`, `swc` and `babel` support compiling standard JavaScript decorators,
your build tool may not (yet) support them.

We hope to see rapid ecosystem adoption of this standard feature in the near
future (and then we'll be able to remove this box).

:::
