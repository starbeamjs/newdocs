# Our Guiding Principle

:::em
We believe that reactive programming should **feel and behave** like regular
programming.
:::

Starbeam reactivity looks and feels like normal JavaScript
programming.

You store state in reactive variables and use functions to
compute values based on the state.

You can decompose your functions into more functions, just like
you would in normal JavaScript, and none of those functions ever
need to know that they're reactive.

You can also use classes to organize your reactive state and
functions, and even use [private fields] and [accessors].

In Starbeam, ==any computation based on reactive variables is
reactive==, no matter how many abstractions are between the
reactive variable and the reactive output.

## A Quick Demonstration

Let's start with a simple example of reactive programming in
Starbeam. It has reactive properties, a reactive function, and
renders a reactive output.

[[code ./snippets/principle.ts as card #highlight:welcome]]

To push the envelope, let's refactor the example to use classes
and private fields.

[[code ./snippets/principle-with-classes.ts as card]]

Even though the reactive state is stored in a private field, and the value is
returned from a getter, the rendered reactive output will still update when the
reactive state changes.

::::details A real-world implementation using decorators

This quick demonstration used a single private field and manual getters to make
it clear that there's no Starbeam-specific magic in the getters that makes the
rendered output reactive.

In practice, you would probably write the `Person` class using JavaScript
decorators:

[[code ./snippets/principle-with-decorators.ts as card]]

::::

## Some of the Benefits

Here are some examples of how Starbeam's principles work in
practice, especially in ways that might be different from other
reactive frameworks you're familiar with.

### Data Updates Happen Immediately

When you update a reactive value, the reactive update happens
immediately. ==Any code that accesses the reactive value will see
the new value.==

There are no exceptions.

This means that you can write elaborate abstractions or libraries
that are built on reactive values, and they will behave exactly
as you expect regardless of how they're used by app code.

### You Derive State Using Normal Functions

If you want to compute a value from reactive values, you just use
functions.

You can also use getters, methods, and the new private versions
of those features to access the reactive values. You can mix and
match JavaScript features however you want. Once you've used a
reactive value to store your state, ==you don't have to think
about reactivity as you compute values.==

### A Longer Demonstration Using Reactive Arrays

This "regular programming" principle goes far beyond single
values.

When your reactive code needs to work with collections, like
arrays, maps and sets, Starbeam's design is based on the same
guiding principle: you can use reactive arrays, maps and sets,
and then ==read from those collections using normal JavaScript==.

In this longer demonstration, we'll create a `People` class that
holds multiple people in a reactive array.

[[code ./snippets/items.snippet.ts]]

As before, we used a private field to store our reactive state,
and created methods for adding more items to the array and
querying the array.

::: info
We could have stored it some other way (like a public field or
even in a `WeakMap`) and everything would have worked just as
well.
:::

We created a `byLocation` method that uses a normal JavaScript
`filter` function to filter the array by location.

The `update` method uses the somewhat obscure `findIndex` method
to find the person we're updating, and updated the array by
replacing the item at that index.

==Other than defining `#people` as a `reactive.array`, the rest
of the `People` class looks and feels like a normal, encapsulated
JavaScript class.==

If we then render the result of `byLocation` into a reactive
output, the renderer will update the output whenever `update` is
called.

**The bottom line is**: While Starbeam's reactive values and
rendering concept may feel analogous to the reactive systems
you're used to, the similarities end with those concepts. All
other reads and writes to those reactive values are normal
JavaScript.

[private fields]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
[accessors]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors
