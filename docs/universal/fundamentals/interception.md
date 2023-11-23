# What Can Become Reactive?

In Starbeam, reactive reads and writes look equivalent to non-reactive reads and
writes.

This means that JavaScript syntax that looks dynamic (such as property access
and method calls) can become reactive, while JavaScript syntax that does not
look dynamic (such as reading and writing from `let` variables) is not reactive.

| Can Become Reactive                   | Can Not Become Reactive                            |
| ------------------------------------- | -------------------------------------------------- |
| Accessing a property (`.` or `[]`)    | Accessing a `let` variable                         |
|                                       | Accessing an import (`import { x }`)               |
| Iterating an object's own keys        | Iterating a module's exports                       |
| Checking a property's presence (`in`) | Checking a private field's presence (`#x in this`) |
| Calling a function or method          | Calling an undecorated private method              |
| Accessing a decorated private field   | Accessing an undecorated private field             |

In practice, this means that the entire external API of a JavaScript object can
become reactive.

## Reactive Builtins

Building on this approach, Starbeam provides reactive versions of many JavaScript
builtin collections:

:::info Reactive Types

- `object`
- `array`
- `Map`
- `Set`
- `Array`
- `WeakMap`
- `WeakSet`

:::

Here's an example using a reactive `Map`. The key point is that you use a
reactive `Map` in precisely the same way you would use a non-reactive `Map`.

[[code ./snippets/reactive-map.snippet.tsx #highlight:normal-api]]

This example uses `[...spread]` and normal JavaScript `map` to render the `Map`.

:::tip JSX Syntax Is Just An Example
This example uses JSX syntax as an illustration of how you would render a
reactive object. In practice, you would use the Starbeam renderer for your
framework, and the same principles would apply.
:::

And the same goes for updates. You update a reactive `Map` using its normal
APIs.

[[code ./snippets/reactive-map.snippet.tsx #highlight:normal-set]]
